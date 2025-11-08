'use client';

import {
  writeBatch,
  type Firestore,
  doc,
} from 'firebase/firestore';
import { users, categories, videos, pricingPlans, videoLogs } from './data';
import { type PricingPlan } from './types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// Separate pricing plans by type
const subscriptionPrices = pricingPlans.filter(p => p.type === 'subscription');
const tokenPackagePrices = pricingPlans.filter(p => p.type === 'token');

const pricingData = {
  subscriptionPrices: subscriptionPrices,
  tokenPackagePrices: tokenPackagePrices,
};

export async function seedDatabase(db: Firestore) {
  const batch = writeBatch(db);

  // Seed users
  users.forEach(user => {
    const { id, ...userData } = user;
    const docRef = doc(db, 'users', id);
    batch.set(docRef, userData);
  });

  // Seed categories
  categories.forEach(category => {
    const { id, ...catData } = category;
    const docRef = doc(db, 'categories', id);
    batch.set(docRef, catData);
  });

  // Seed videos
  videos.forEach(video => {
    const { id, categoryId, ...videoData } = video;
    const docRef = doc(db, 'videos', id);
    batch.set(docRef, { ...videoData, categoryId });
  });

  // Seed video logs
  videoLogs.forEach(log => {
    const { id, userId, videoId, ...logData } = log;
    const docRef = doc(db, 'users', userId, 'videoLogs', id);
    batch.set(docRef, { userId, videoId, ...logData });
  });

  // Seed pricing document
  const pricingRef = doc(db, 'settings', 'pricing');
  batch.set(pricingRef, pricingData);

  // Non-blocking commit with detailed error handling
  return batch.commit()
    .then(() => {
        console.log('Database seeded successfully!');
        return { success: true };
    })
    .catch((error) => {
      // The batch write failed, likely due to a security rule violation.
      // We don't know which specific write in the batch failed, so we
      // report a general write error on the database root.
      const contextualError = new FirestorePermissionError({
        path: '/', // The operation is on the root or multiple paths
        operation: 'write',
        // We can't easily provide the data for a large batch, so it's omitted.
      });

      // Emit the centralized error for the development overlay
      errorEmitter.emit('permission-error', contextualError);

      console.error('Error seeding database:', error); // Keep original console error
      return { success: false, error: contextualError };
    });
}
