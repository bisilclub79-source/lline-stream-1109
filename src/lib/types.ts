export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isAdmin: boolean;
  subscription?: {
    planId: string;
    status: 'active' | 'canceled' | 'expired';
    endDate: number; // timestamp
  };
  tokens: {
    balance: number;
    purchaseHistory: {
      packageId: string;
      date: number; // timestamp
      amount: number;
    }[];
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children?: Category[];
}

export interface Video {
  id: string;
  title: string;
  name?: string; // for new videos
  description: string;
  duration: number; // in seconds
  thumbnailId: string;
  categoryId: string;
  accessLevel: 'free' | 'subscription' | 'token';
  tokenCost?: number;
  tags: string[];
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  type: 'subscription' | 'token';
  // For subscriptions
  billingCycle?: 'monthly' | 'yearly';
  // For token packages
  tokenAmount?: number;
}

export interface VideoLog {
  id: string;
  userId: string;
  videoId: string;
  watchedAt: number; // timestamp
  progress: number; // percentage
}
