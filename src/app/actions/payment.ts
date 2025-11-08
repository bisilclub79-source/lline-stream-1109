'use server';

import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// 서버 액션은 'use server' 지시어를 필요로 합니다.
// 이 파일은 Node.js 환경에서 실행됩니다.

// Firebase Admin SDK 초기화
if (!getApps().length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);
    initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (error) {
    console.error('Firebase Admin SDK 초기화 실패:', error);
    // 초기화 실패 시 더 이상 진행하지 않도록 조치
  }
}
const db = getFirestore();

interface ProcessPaymentResult {
    status: 'success' | 'forgery' | 'error';
    message: string;
}

interface CustomData {
    userId: string;
    selectedSubs: { categoryId: string, categoryName: string, planId: string, planName: string, price: number }[];
    selectedTokens: { packageId: string, packageName: string, quantity: number, price: number }[];
    totalAmount: number;
}


export async function processPayment(paymentId: string): Promise<ProcessPaymentResult> {
    const portoneApiSecret = process.env.PORTONE_API_SECRET;
    if (!portoneApiSecret) {
        console.error('PORTONE_API_SECRET이 설정되지 않았습니다.');
        return { status: 'error', message: '서버 설정 오류가 발생했습니다.' };
    }

    try {
        // 1. 포트원 결제 단건 조회 API 호출
        const response = await fetch(`https://api.portone.io/payments/${paymentId}`, {
            method: 'GET',
            headers: {
                'Authorization': `PortOne ${portoneApiSecret}`,
            },
        });
        
        if (!response.ok) {
            const errorBody = await response.json();
            console.error('포트원 API 호출 실패:', errorBody);
            return { status: 'error', message: `결제 정보를 조회하지 못했습니다 (상태: ${response.status})` };
        }

        const paymentData = await response.json();
        
        // 2. 보안 검증
        const customData = paymentData.customData as CustomData;
        
        // 2-1. 금액 위변조 검증
        if (paymentData.amount.total !== customData.totalAmount) {
            console.warn('금액 위변조 시도 감지:', {
                paymentId,
                actualAmount: paymentData.amount.total,
                expectedAmount: customData.totalAmount,
            });
            // TODO: 금액 위변조 시 결제 취소 로직 추가
            return { status: 'forgery', message: '결제 금액이 일치하지 않습니다.' };
        }
        
        // 2-2. 결제 상태 검증
        if (paymentData.status !== 'PAID') {
            console.log('결제가 완료되지 않았습니다:', { paymentId, status: paymentData.status });
            return { status: 'error', message: `결제가 완료되지 않았습니다 (상태: ${paymentData.status})` };
        }

        // 3. 데이터베이스 처리
        const userRef = db.collection('users').doc(customData.userId);
        
        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) {
                throw new Error('사용자 문서를 찾을 수 없습니다.');
            }

            const userData = userDoc.data()!;
            
            // 구독 정보 업데이트
            const newSubscriptions = customData.selectedSubs.map(sub => ({
                ...sub,
                startDate: new Date().toISOString(),
                // TODO: planId에 따라 endDate 계산 로직 추가
                endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(), 
                autoRenew: true,
                status: 'active'
            }));

            // 토큰 구매 내역 업데이트
            const newPurchaseHistory = customData.selectedTokens.map(pkg => ({
                ...pkg,
                purchaseDate: new Date().toISOString(),
            }));
            
            const totalTokensPurchased = customData.selectedTokens.reduce((sum, pkg) => sum + (pkg.quantity * (pkg.tokens || 0)), 0);

            transaction.update(userRef, {
                // 기존 구독 정보에 새로운 구독 추가 (또는 덮어쓰기)
                subscriptions: {
                    ...userData.subscriptions,
                    ...newSubscriptions.reduce((acc, sub) => ({...acc, [sub.categoryId]: sub }), {})
                },
                // 토큰 잔액 및 구매 내역 업데이트
                tokens: {
                    balance: (userData.tokens?.balance || 0) + totalTokensPurchased,
                    purchaseHistory: [...(userData.tokens?.purchaseHistory || []), ...newPurchaseHistory]
                }
            });
        });

        console.log('결제 처리 및 DB 업데이트 성공:', { paymentId });
        return { status: 'success', message: '결제가 성공적으로 처리되었습니다.' };

    } catch (error) {
        console.error('결제 처리 중 오류 발생:', error);
        return { status: 'error', message: '결제 처리 중 서버에서 오류가 발생했습니다.' };
    }
}
