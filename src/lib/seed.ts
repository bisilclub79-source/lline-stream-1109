'use client';

import {
  collection,
  doc,
  setDoc,
  writeBatch,
  type Firestore,
} from 'firebase/firestore';
import { users, categories, videos, pricingPlans, videoLogs } from './data';
import { type PricingPlan } from './types';

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
    const { id, ...videoData } = video;
    // Videos are nested under categories in firestore structure for this project, but backend.json shows categories/{categoryId}/videos/{videoId} which is not correct for top-level videos.
    // The prompt says videos collection.
    // backend.json: /categories/{categoryId}/videos/{videoId}. The data model doesn't support this easily with the mock data.
    // I will put videos in a top level collection for now.
    const docRef = doc(db, 'videos', id);
    batch.set(docRef, videoData);
  });

  // Seed video logs
  videoLogs.forEach(log => {
    const { id, userId, ...logData } = log;
    // path: /users/{userId}/videoLogs/{videoLogId}
    const docRef = doc(db, 'users', userId, 'videoLogs', id);
    batch.set(docRef, logData);
  });

  // Seed pricing document
  const pricingRef = doc(db, 'settings', 'pricing');
  batch.set(pricingRef, pricingData);


  try {
    await batch.commit();
    console.log('Database seeded successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error };
  }
}
