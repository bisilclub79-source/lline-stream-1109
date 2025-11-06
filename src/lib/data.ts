import { User, Category, Video, PricingPlan, VideoLog } from './types';

export const users: User[] = [
  {
    id: 'user-admin',
    email: 'admin@cinestream.com',
    displayName: 'Admin User',
    isAdmin: true,
    subscription: {
      planId: 'sub-yearly',
      status: 'active',
      endDate: new Date().setFullYear(new Date().getFullYear() + 1),
    },
    tokens: {
      balance: 100,
      purchaseHistory: [],
    },
  },
  {
    id: 'user-subscribed',
    email: 'subscriber@cinestream.com',
    displayName: 'Subscribed User',
    isAdmin: false,
    subscription: {
      planId: 'sub-monthly',
      status: 'active',
      endDate: new Date().setDate(new Date().getDate() + 30),
    },
    tokens: {
      balance: 10,
      purchaseHistory: [],
    },
  },
  {
    id: 'user-token',
    email: 'tokenuser@cinestream.com',
    displayName: 'Token User',
    isAdmin: false,
    tokens: {
      balance: 50,
      purchaseHistory: [
        { packageId: 'token-50', date: new Date().getTime(), amount: 50 },
      ],
    },
  },
  {
    id: 'user-free',
    email: 'freeuser@cinestream.com',
    displayName: 'Free User',
    isAdmin: false,
    tokens: {
      balance: 0,
      purchaseHistory: [],
    },
  },
];

export const categories: Category[] = [
  { id: 'cat-1', name: 'Movies', slug: 'movies', parentId: null },
  { id: 'cat-1-1', name: 'Action', slug: 'action', parentId: 'cat-1' },
  { id: 'cat-1-2', name: 'Comedy', slug: 'comedy', parentId: 'cat-1' },
  { id: 'cat-1-3', name: 'Drama', slug: 'drama', parentId: 'cat-1' },
  { id: 'cat-2', name: 'TV Shows', slug: 'tv-shows', parentId: null },
  { id: 'cat-2-1', name: 'Sci-Fi', slug: 'sci-fi', parentId: 'cat-2' },
  { id: 'cat-2-1-1', name: 'Space Opera', slug: 'space-opera', parentId: 'cat-2-1' },
  { id: 'cat-2-2', name: 'Thriller', slug: 'thriller', parentId: 'cat-2' },
  { id: 'cat-3', name: 'Documentaries', slug: 'documentaries', parentId: null },
  { id: 'cat-3-1', name: 'Nature', slug: 'nature', parentId: 'cat-3' },
  { id: 'cat-3-2', name: 'History', slug: 'history', parentId: 'cat-3' },
];

export const videos: Video[] = [
    { id: 'vid-1', title: 'Galactic Warriors', description: 'An epic space battle for the fate of the galaxy.', duration: 7200, thumbnailId: 'thumb-scifi-1', categoryId: 'cat-2-1-1', accessLevel: 'subscription', tags: ['sci-fi', 'action', 'space'] },
    { id: 'vid-2', title: 'The Last Stand-up', description: 'A comedian\'s final, hilarious performance.', duration: 3600, thumbnailId: 'thumb-comedy-1', categoryId: 'cat-1-2', accessLevel: 'free', tags: ['comedy', 'stand-up'] },
    { id: 'vid-3', title: 'City of Shadows', description: 'A detective hunts a killer in a rain-soaked metropolis.', duration: 5400, thumbnailId: 'thumb-thriller-1', categoryId: 'cat-2-2', accessLevel: 'token', tokenCost: 5, tags: ['thriller', 'crime', 'noir'] },
    { id: 'vid-4', title: 'Ocean Depths', description: 'Explore the mysteries of the deep sea.', duration: 2700, thumbnailId: 'thumb-action-1', categoryId: 'cat-3-1', accessLevel: 'subscription', tags: ['documentary', 'nature', 'ocean'] },
    { id: 'vid-5', title: 'The Algorithm of Love', description: 'Two programmers fall in love while building an AI.', duration: 6000, thumbnailId: 'thumb-romance-1', categoryId: 'cat-1-3', accessLevel: 'free', tags: ['drama', 'romance', 'tech'] },
    { id: 'vid-6', title: 'Concrete Jungle Chase', description: 'A high-octane chase through the city.', duration: 6800, thumbnailId: 'thumb-action-2', categoryId: 'cat-1-1', accessLevel: 'subscription', tags: ['action', 'chase', 'crime'] },
    { id: 'vid-7', title: 'Cosmic Drifters', description: 'Sequel to the Galactic Warriors.', duration: 7500, thumbnailId: 'thumb-scifi-2', categoryId: 'cat-2-1-1', accessLevel: 'token', tokenCost: 10, tags: ['sci-fi', 'space opera'] },
    { id: 'vid-8', title: 'Laugh Riot', description: 'More jokes from your favorite comedian.', duration: 4200, thumbnailId: 'thumb-comedy-2', categoryId: 'cat-1-2', accessLevel: 'free', tags: ['comedy', 'live'] },
    { id: 'vid-9', title: 'Rainy Day Confessions', description: 'A touching story of family secrets.', duration: 5000, thumbnailId: 'thumb-drama-1', categoryId: 'cat-1-3', accessLevel: 'subscription', tags: ['drama', 'family'] },
    { id: 'vid-10', title: 'World at War', description: 'A historical look at global conflicts.', duration: 3200, thumbnailId: 'thumb-drama-2', categoryId: 'cat-3-2', accessLevel: 'subscription', tags: ['documentary', 'history', 'war'] },
];

export const pricingPlans: PricingPlan[] = [
    {
        id: 'sub-monthly',
        name: 'Monthly Pass',
        description: 'Unlimited access to all subscription content. Billed monthly.',
        price: 9.99,
        currency: 'USD',
        type: 'subscription',
        billingCycle: 'monthly',
    },
    {
        id: 'sub-yearly',
        name: 'Annual Pass',
        description: 'Get 2 months free! Unlimited access, billed annually.',
        price: 99.99,
        currency: 'USD',
        type: 'subscription',
        billingCycle: 'yearly',
    },
    {
        id: 'token-20',
        name: '20 Tokens',
        description: 'A small pack for premium videos.',
        price: 4.99,
        currency: 'USD',
        type: 'token',
        tokenAmount: 20,
    },
    {
        id: 'token-50',
        name: '50 Tokens',
        description: 'Best value for token users.',
        price: 9.99,
        currency: 'USD',
        type: 'token',
        tokenAmount: 50,
    },
];

export const videoLogs: VideoLog[] = [
    { id: 'log-1', userId: 'user-subscribed', videoId: 'vid-1', watchedAt: new Date().getTime() - 86400000, progress: 95 },
    { id: 'log-2', userId: 'user-subscribed', videoId: 'vid-4', watchedAt: new Date().getTime() - 172800000, progress: 50 },
    { id: 'log-3', userId: 'user-token', videoId: 'vid-3', watchedAt: new Date().getTime() - 3600000, progress: 100 },
];
