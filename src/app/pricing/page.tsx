'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { processPayment } from '@/app/actions/payment';

import { doc, getDoc, collection } from 'firebase/firestore';
import { useFirestore, useCollection } from '@/firebase';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Minus, CreditCard, ShoppingCart } from 'lucide-react';
import type { Category } from '@/lib/types';
import { useMemoFirebase } from '@/firebase/provider';

// Define types for pricing data
interface SubscriptionPrice {
  id: string;
  name: string;
  duration: string;
  price: number;
}
interface TokenPackage {
  id: string;
  name: string;
  tokens: number;
  price: number;
}
interface PricingData {
  subscriptionPrices: SubscriptionPrice[];
  tokenPackagePrices: TokenPackage[];
}

interface SelectedSubscription {
  categoryId: string;
  categoryName: string;
  planId: string;
  planName: string;
  price: number;
}

interface SelectedTokenPackage {
  packageId: string;
  packageName: string;
  quantity: number;
  price: number;
  tokens?: number; // Add tokens to the interface
}

export default function PricingPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [isPricingLoading, setIsPricingLoading] = useState(true);

  const categoriesCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'categories');
  }, [firestore]);

  const { data: categories, isLoading: areCategoriesLoading } = useCollection<Category>(categoriesCollectionRef);
  
  const [selectedSubs, setSelectedSubs] = useState<Record<string, SelectedSubscription>>({});
  const [selectedTokens, setSelectedTokens] = useState<Record<string, SelectedTokenPackage>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch pricing data from Firestore
  useEffect(() => {
    if (!firestore) return;
    const fetchPricing = async () => {
      setIsPricingLoading(true);
      const pricingRef = doc(firestore, 'settings', 'pricing');
      const pricingSnap = await getDoc(pricingRef);
      if (pricingSnap.exists()) {
        setPricingData(pricingSnap.data() as PricingData);
      } else {
        toast({
          variant: 'destructive',
          title: '오류',
          description: '가격 정보를 불러오지 못했습니다.',
        });
      }
      setIsPricingLoading(false);
    };
    fetchPricing();
  }, [firestore, toast]);
  
  const topLevelCategories = useMemo(() => {
    if (!categories) return [];
    const categoryMap = new Map(categories.map(c => [c.id, {...c, children: [] as Category[]}]));
    const roots: (Category & { children: Category[] })[] = [];

    categories.forEach(cat => {
      if (cat.parentId && categoryMap.has(cat.parentId)) {
        const parent = categoryMap.get(cat.parentId);
        const current = categoryMap.get(cat.id);
        if(parent && current) {
          parent.children.push(current);
        }
      } else if (!cat.parentId) {
        const current = categoryMap.get(cat.id);
        if (current) {
          roots.push(current);
        }
      }
    });
    return roots;
  }, [categories]);

  const handleSubSwitch = (categoryId: string, categoryName: string, checked: boolean) => {
    if (!checked) {
      setSelectedSubs(prev => {
        const newState = { ...prev };
        delete newState[categoryId];
        return newState;
      });
    } else {
        // Default to the first plan if user just enabled it
        if(pricingData?.subscriptionPrices?.[0]){
            handleSubPlanSelect(categoryId, categoryName, pricingData.subscriptionPrices[0]);
        }
    }
  };

  const handleSubPlanSelect = (categoryId: string, categoryName: string, plan: SubscriptionPrice) => {
    setSelectedSubs(prev => ({
      ...prev,
      [categoryId]: {
        categoryId,
        categoryName,
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
      },
    }));
  };

  const handleTokenQuantityChange = (pkg: TokenPackage, change: number) => {
    setSelectedTokens(prev => {
      const current = prev[pkg.id] || { packageId: pkg.id, packageName: pkg.name, quantity: 0, price: pkg.price, tokens: pkg.tokens };
      const newQuantity = Math.max(0, current.quantity + change);
      const newState = { ...prev };
      if (newQuantity === 0) {
        delete newState[pkg.id];
      } else {
        newState[pkg.id] = { ...current, quantity: newQuantity };
      }
      return newState;
    });
  };

  const totalAmount = useMemo(() => {
    const subTotal = Object.values(selectedSubs).reduce((sum, sub) => sum + sub.price, 0);
    const tokenTotal = Object.values(selectedTokens).reduce((sum, pkg) => sum + (pkg.price * pkg.quantity), 0);
    return subTotal + tokenTotal;
  }, [selectedSubs, selectedTokens]);
  
  const orderName = useMemo(() => {
    const subItems = Object.values(selectedSubs);
    const tokenItems = Object.values(selectedTokens);
    const totalItems = subItems.length + tokenItems.length;

    if (totalItems === 0) return '주문 내역 없음';

    let name = '';
    if (subItems.length > 0) {
        name = `구독: ${subItems[0].categoryName}`;
    } else if (tokenItems.length > 0) {
        name = `토큰: ${tokenItems[0].packageName}`;
    }

    if (totalItems > 1) {
        name += ` 외 ${totalItems - 1}건`;
    }
    return name;
  }, [selectedSubs, selectedTokens]);

  const handlePayment = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: '로그인이 필요합니다.' });
      router.push('/login');
      return;
    }
    if (totalAmount === 0) {
      toast({ variant: 'destructive', title: '상품을 선택해주세요.' });
      return;
    }
    setIsProcessing(true);

    const paymentId = `payment-${Date.now()}`;
    const customData = {
        userId: user.uid,
        selectedSubs: Object.values(selectedSubs),
        selectedTokens: Object.values(selectedTokens),
        totalAmount,
    };

    if (typeof window.PortOne === 'undefined') {
        toast({ variant: 'destructive', title: '결제 모듈을 로드하지 못했습니다.'});
        setIsProcessing(false);
        return;
    }

    try {
        const response = await window.PortOne.requestPayment({
            storeId: 'store-b39f33eb-e7e5-4067-b710-c76173e988bd',
            channelKey: 'channel-key-317044ec-1dc4-4dfd-8e4f-ae84ba732142',
            paymentId,
            orderName,
            totalAmount,
            customer: {
                customerId: user.uid,
                fullName: user.displayName || '고객',
                email: user.email || undefined,
                phoneNumber: user.phoneNumber || undefined,
            },
            customData,
            isTest: true,
        });

        if (response?.paymentId) {
            const result = await processPayment(response.paymentId);
            if (result.status === 'success') {
                toast({ title: '결제 성공', description: '결제가 성공적으로 완료되었습니다.' });
                router.refresh();
            } else {
                toast({ variant: 'destructive', title: '결제 처리 실패', description: result.message });
            }
        } else if (response?.code) {
             toast({ variant: 'destructive', title: '결제 취소', description: response.message || '사용자가 결제를 취소했습니다.' });
        } else {
             toast({ variant: 'destructive', title: '결제 실패', description: '결제 중 오류가 발생했습니다.' });
        }
    } catch (error) {
        console.error('결제 요청 중 예외 발생:', error);
        toast({ variant: 'destructive', title: '결제 오류', description: '결제 시스템에 예기치 않은 문제가 발생했습니다.' });
    } finally {
        setIsProcessing(false);
    }
  };
  
  const isLoading = isUserLoading || areCategoriesLoading || isPricingLoading;

  if (isLoading) {
    return (
        <div className="container mx-auto max-w-7xl py-12 px-4">
            <header className="mb-10 text-center">
              <Skeleton className="h-10 w-64 mx-auto" />
              <Skeleton className="h-6 w-96 mx-auto mt-4" />
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight font-headline text-center">
          나의 요금제 만들기
        </h1>
        <p className="mt-2 text-lg text-muted-foreground text-center">
          원하는 콘텐츠만 골라 합리적인 플랜을 직접 설계하세요.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* 상품 선택 영역 */}
        <div className="lg:col-span-2 space-y-8">
            {/* 구독 상품 */}
            <Card>
                <CardHeader>
                    <CardTitle>구독 상품</CardTitle>
                    <CardDescription>관심있는 카테고리를 선택하고 구독 기간을 설정하세요.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="multiple" className="w-full">
                        {topLevelCategories.map(cat => (
                            <AccordionItem value={cat.id} key={cat.id}>
                                <AccordionTrigger className="text-lg font-semibold">{cat.name}</AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                        {cat.children && cat.children.length > 0 ? (
                                            cat.children.map(subCat => (
                                            <Card key={subCat.id} className={selectedSubs[subCat.id] ? 'border-primary ring-2 ring-primary' : ''}>
                                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                                    <div>
                                                        <CardTitle className="text-base">{subCat.name}</CardTitle>
                                                        {subCat.instructor && <CardDescription>by {subCat.instructor}</CardDescription>}
                                                    </div>
                                                    <Switch 
                                                        checked={!!selectedSubs[subCat.id]}
                                                        onCheckedChange={(checked) => handleSubSwitch(subCat.id, subCat.name, checked)}
                                                        id={`switch-${subCat.id}`}
                                                    />
                                                </CardHeader>
                                                {selectedSubs[subCat.id] && (
                                                    <CardContent>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {pricingData?.subscriptionPrices.map(plan => (
                                                                <Button 
                                                                    key={plan.id}
                                                                    variant={selectedSubs[subCat.id]?.planId === plan.id ? 'default' : 'outline'}
                                                                    size="sm"
                                                                    onClick={() => handleSubPlanSelect(subCat.id, subCat.name, plan)}
                                                                >
                                                                    {plan.name} ({plan.price.toLocaleString()}원)
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </CardContent>
                                                )}
                                            </Card>
                                            ))
                                        ) : (
                                            <p className="text-muted-foreground p-4 text-sm col-span-full">이 카테고리에는 하위 상품이 없습니다.</p>
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>

            {/* 토큰 구매 */}
            <Card>
                <CardHeader>
                    <CardTitle>토큰 구매</CardTitle>
                    <CardDescription>프리미엄 콘텐츠를 시청할 수 있는 토큰을 구매하세요.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pricingData?.tokenPackagePrices.map(pkg => (
                        <Card key={pkg.id}>
                            <CardHeader>
                                <CardTitle className="text-lg">{pkg.name}</CardTitle>
                                <CardDescription>{pkg.tokens.toLocaleString()} tokens</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-between">
                                <p className="text-xl font-bold">{pkg.price.toLocaleString()}원</p>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleTokenQuantityChange(pkg, -1)}>
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="font-bold w-4 text-center">{selectedTokens[pkg.id]?.quantity || 0}</span>
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleTokenQuantityChange(pkg, 1)}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>

        {/* 결제 요약 카드 */}
        <div className="lg:sticky top-24">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-6 w-6" />
                <span>결제 요약</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm max-h-60 overflow-y-auto pr-2">
                {Object.values(selectedSubs).length === 0 && Object.values(selectedTokens).length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">선택된 상품이 없습니다.</p>
                ) : (
                    <>
                        {Object.values(selectedSubs).map(sub => (
                            <div key={sub.categoryId} className="flex justify-between">
                                <span>구독: {sub.categoryName} ({sub.planName})</span>
                                <span>{sub.price.toLocaleString()}원</span>
                            </div>
                        ))}
                        {Object.values(selectedTokens).map(pkg => (
                            <div key={pkg.packageId} className="flex justify-between">
                                <span>토큰: {pkg.packageName} x{pkg.quantity}</span>
                                <span>{(pkg.price * pkg.quantity).toLocaleString()}원</span>
                            </div>
                        ))}
                    </>
                )}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>총 결제 금액</span>
                  <span>{totalAmount.toLocaleString()}원</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full font-bold text-lg py-6"
                onClick={handlePayment}
                disabled={isProcessing || totalAmount === 0}
              >
                {isProcessing ? '결제 처리 중...' : (
                    <>
                        <CreditCard className="mr-2 h-5 w-5"/>
                        {totalAmount.toLocaleString()}원 결제하기
                    </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

    