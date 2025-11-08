import { User, Category, Video, PricingPlan, VideoLog } from './types';

// --- USERS ---
export const users: User[] = [
  {
    id: 'user-admin',
    email: 'admin@cinestream.com',
    displayName: 'Admin User',
    isAdmin: true,
    photoURL: 'https://i.pravatar.cc/150?u=user-admin',
    subscription: {
      planId: 'sub-yearly',
      status: 'active',
      endDate: new Date().setFullYear(new Date().getFullYear() + 1),
    },
    tokens: {
      balance: 500,
      purchaseHistory: [],
    },
  },
  {
    id: 'user-subscribed-pro',
    email: 'pro@cinestream.com',
    displayName: 'Pro Subscriber',
    isAdmin: false,
    photoURL: 'https://i.pravatar.cc/150?u=user-subscribed-pro',
    subscription: {
      planId: 'sub-yearly',
      status: 'active',
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).getTime(),
    },
    tokens: {
      balance: 100,
      purchaseHistory: [{ packageId: 'token-50', date: new Date(new Date().setDate(new Date().getDate() - 20)).getTime(), amount: 50 }],
    },
  },
  {
    id: 'user-subscribed-basic',
    email: 'basic@cinestream.com',
    displayName: 'Basic Subscriber',
    isAdmin: false,
    photoURL: 'https://i.pravatar.cc/150?u=user-subscribed-basic',
    subscription: {
      planId: 'sub-monthly',
      status: 'active',
      endDate: new Date(new Date().setDate(new Date().getDate() + 15)).getTime(),
    },
    tokens: {
      balance: 10,
      purchaseHistory: [],
    },
  },
  {
    id: 'user-token-heavy',
    email: 'heavy@cinestream.com',
    displayName: 'Heavy Token User',
    isAdmin: false,
    photoURL: 'https://i.pravatar.cc/150?u=user-token-heavy',
    tokens: {
      balance: 150,
      purchaseHistory: [
        { packageId: 'token-50', date: new Date(new Date().setDate(new Date().getDate() - 90)).getTime(), amount: 50 },
        { packageId: 'token-50', date: new Date(new Date().setDate(new Date().getDate() - 60)).getTime(), amount: 50 },
        { packageId: 'token-100', date: new Date(new Date().setDate(new Date().getDate() - 10)).getTime(), amount: 100 },
      ],
    },
  },
  {
    id: 'user-token-light',
    email: 'light@cinestream.com',
    displayName: 'Light Token User',
    isAdmin: false,
    photoURL: 'https://i.pravatar.cc/150?u=user-token-light',
    tokens: {
      balance: 5,
      purchaseHistory: [
        { packageId: 'token-20', date: new Date(new Date().setDate(new Date().getDate() - 5)).getTime(), amount: 20 },
      ],
    },
  },
  {
    id: 'user-free-new',
    email: 'newbie@cinestream.com',
    displayName: 'Newbie Free',
    isAdmin: false,
    photoURL: 'https://i.pravatar.cc/150?u=user-free-new',
    tokens: {
      balance: 0,
      purchaseHistory: [],
    },
  },
  {
    id: 'user-lapsed',
    email: 'lapsed@cinestream.com',
    displayName: 'Lapsed Subscriber',
    isAdmin: false,
    photoURL: 'https://i.pravatar.cc/150?u=user-lapsed',
    subscription: {
      planId: 'sub-monthly',
      status: 'expired',
      endDate: new Date(new Date().setDate(new Date().getDate() - 45)).getTime(),
    },
    tokens: {
      balance: 0,
      purchaseHistory: [],
    },
  },
  {
    id: 'user-gamer',
    email: 'gamer@cinestream.com',
    displayName: 'GamerGeek',
    isAdmin: false,
    photoURL: 'https://i.pravatar.cc/150?u=user-gamer',
    tokens: {
      balance: 30,
      purchaseHistory: [{ packageId: 'token-20', date: new Date(new Date().setDate(new Date().getDate() - 7)).getTime(), amount: 20 }],
    },
  },
  {
    id: 'user-chef',
    email: 'chef@cinestream.com',
    displayName: 'Chef Extraordinaire',
    isAdmin: false,
    photoURL: 'https://i.pravatar.cc/150?u=user-chef',
    subscription: {
      planId: 'sub-monthly',
      status: 'active',
      endDate: new Date(new Date().setDate(new Date().getDate() + 25)).getTime(),
    },
    tokens: {
      balance: 0,
      purchaseHistory: [],
    },
  },
  {
    id: 'user-musician',
    email: 'music@cinestream.com',
    displayName: 'Music Maestro',
    isAdmin: false,
    photoURL: 'https://i.pravatar.cc/150?u=user-musician',
    tokens: {
      balance: 75,
      purchaseHistory: [{ packageId: 'token-100', date: new Date(new Date().setDate(new Date().getDate() - 1)).getTime(), amount: 100 }],
    },
  },
  {
    id: 'user-artist',
    email: 'art@cinestream.com',
    displayName: 'Artistic Soul',
    isAdmin: false,
    photoURL: 'https://i.pravatar.cc/150?u=user-artist',
    subscription: {
      planId: 'sub-yearly',
      status: 'active',
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).getTime(),
    },
    tokens: {
      balance: 20,
      purchaseHistory: [],
    },
  },
];

// --- CATEGORIES ---
export const categories: Category[] = [
  // Level 1
  { id: 'cat-1', name: 'Movies', slug: 'movies', parentId: null },
  { id: 'cat-2', name: 'Educational', slug: 'educational', parentId: null },
  { id: 'cat-3', name: 'Hobbies', slug: 'hobbies', parentId: null },
  { id: 'cat-4', name: 'Documentaries', slug: 'documentaries', parentId: null },

  // Level 2 (Movies)
  { id: 'cat-1-1', name: 'Action', slug: 'action', parentId: 'cat-1' },
  { id: 'cat-1-2', name: 'Comedy', slug: 'comedy', parentId: 'cat-1' },
  { id: 'cat-1-3', name: 'Sci-Fi', slug: 'sci-fi', parentId: 'cat-1' },
  
  // Level 2 (Educational)
  { id: 'cat-2-1', name: 'Science', slug: 'science', parentId: 'cat-2' },
  { id: 'cat-2-2', name: 'History', slug: 'history', parentId: 'cat-2' },

  // Level 2 (Hobbies)
  { id: 'cat-3-1', name: 'Gaming', slug: 'gaming', parentId: 'cat-3' },
  { id: 'cat-3-2', name: 'Cooking', slug: 'cooking', parentId: 'cat-3' },
  { id: 'cat-3-3', name: 'Music', slug: 'music', parentId: 'cat-3' },

  // Level 2 (Documentaries)
  { id: 'cat-4-1', name: 'Nature', slug: 'nature', parentId: 'cat-4' },
  { id: 'cat-4-2', name: 'Biographies', slug: 'biographies', parentId: 'cat-4' },

  // Level 3 (Sci-Fi)
  { id: 'cat-1-3-1', name: 'Space Opera', slug: 'space-opera', parentId: 'cat-1-3' },
  { id: 'cat-1-3-2', name: 'Cyberpunk', slug: 'cyberpunk', parentId: 'cat-1-3' },

  // Level 3 (Gaming)
  { id: 'cat-3-1-1', name: 'Strategy', slug: 'strategy', parentId: 'cat-3-1' },
  { id: 'cat-3-1-2', name: 'RPG', slug: 'rpg', parentId: 'cat-3-1' },
];

// --- VIDEOS ---
export const videos: Video[] = [
    { id: 'vid-1', title: 'Galactic Warriors', description: 'An epic space battle for the fate of the galaxy.', duration: 7200, thumbnailId: 'thumb-scifi-1', categoryId: 'cat-1-3-1', accessLevel: 'subscription', tags: ['sci-fi', 'action', 'space'] },
    { id: 'vid-2', title: 'The Last Stand-up', description: 'A comedian\'s final, hilarious performance.', duration: 3600, thumbnailId: 'thumb-comedy-1', categoryId: 'cat-1-2', accessLevel: 'free', tags: ['comedy', 'stand-up'] },
    { id: 'vid-3', title: 'City of Shadows', description: 'A detective hunts a killer in a rain-soaked metropolis.', duration: 5400, thumbnailId: 'thumb-thriller-1', categoryId: 'cat-1-3-2', accessLevel: 'token', tokenCost: 5, tags: ['thriller', 'crime', 'noir', 'cyberpunk'] },
    { id: 'vid-4', title: 'Ocean Depths', description: 'Explore the mysteries of the deep sea.', duration: 2700, thumbnailId: 'thumb-nature-1', categoryId: 'cat-4-1', accessLevel: 'subscription', tags: ['documentary', 'nature', 'ocean'] },
    { id: 'vid-5', title: 'The Algorithm of Love', description: 'Two programmers fall in love while building an AI.', duration: 6000, thumbnailId: 'thumb-romance-1', categoryId: 'cat-1', accessLevel: 'free', tags: ['drama', 'romance', 'tech'] },
    { id: 'vid-6', title: 'Concrete Jungle Chase', description: 'A high-octane chase through the city.', duration: 6800, thumbnailId: 'thumb-action-2', categoryId: 'cat-1-1', accessLevel: 'subscription', tags: ['action', 'chase', 'crime'] },
    { id: 'vid-7', title: 'Cosmic Drifters', description: 'Sequel to the Galactic Warriors.', duration: 7500, thumbnailId: 'thumb-scifi-2', categoryId: 'cat-1-3-1', accessLevel: 'token', tokenCost: 10, tags: ['sci-fi', 'space opera'] },
    { id: 'vid-8', title: 'Laugh Riot', description: 'More jokes from your favorite comedian.', duration: 4200, thumbnailId: 'thumb-comedy-2', categoryId: 'cat-1-2', accessLevel: 'free', tags: ['comedy', 'live'] },
    { id: 'vid-9', title: 'The Roman Empire', description: 'The rise and fall of a great civilization.', duration: 5000, thumbnailId: 'thumb-drama-2', categoryId: 'cat-2-2', accessLevel: 'subscription', tags: ['history', 'documentary', 'rome'] },
    { id: 'vid-10', name: 'Mastering the Art of Pasta', description: 'A comprehensive guide to making fresh pasta from scratch.', duration: 4800, thumbnailId: 'thumb-cooking-1', categoryId: 'cat-3-2', accessLevel: 'subscription', tags: ['cooking', 'hobby', 'food', 'pasta'] },
    { id: 'vid-11', name: 'Starcraft Pro-Tips', description: 'Learn advanced strategies from a top-tier Starcraft player.', duration: 3200, thumbnailId: 'thumb-gaming-1', categoryId: 'cat-3-1-1', accessLevel: 'token', tokenCost: 3, tags: ['gaming', 'strategy', 'esports'] },
    { id: 'vid-12', name: 'Quantum Physics Explained', description: 'A simple explanation of a complex topic.', duration: 2200, thumbnailId: 'thumb-science-1', categoryId: 'cat-2-1', accessLevel: 'free', tags: ['science', 'physics', 'education'] },
    { id: 'vid-13', name: 'Guitar Basics: Your First Chords', description: 'Start your musical journey by learning the essential guitar chords.', duration: 1800, thumbnailId: 'thumb-music-1', categoryId: 'cat-3-3', accessLevel: 'free', tags: ['music', 'hobby', 'guitar', 'beginner'] },
    { id: 'vid-14', name: 'The World of Eldoria: A Fantasy RPG', description: 'A deep dive into the lore and mechanics of the hit RPG Eldoria.', duration: 5500, thumbnailId: 'thumb-gaming-2', categoryId: 'cat-3-1-2', accessLevel: 'token', tokenCost: 5, tags: ['gaming', 'rpg', 'fantasy'] },
    { id: 'vid-15', name: 'Van Gogh: A Life in Color', description: 'An intimate look at the life and works of Vincent van Gogh.', duration: 4900, thumbnailId: 'thumb-artist-1', categoryId: 'cat-4-2', accessLevel: 'subscription', tags: ['biography', 'art', 'history'] },
];

// --- PRICING PLANS ---
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
        name: 'Starter Pack',
        description: 'A small pack for premium videos.',
        price: 4.99,
        currency: 'USD',
        type: 'token',
        tokenAmount: 20,
    },
    {
        id: 'token-50',
        name: 'Value Pack',
        description: 'Great value for frequent viewers.',
        price: 9.99,
        currency: 'USD',
        type: 'token',
        tokenAmount: 50,
    },
     {
        id: 'token-100',
        name: 'Pro Pack',
        description: 'Best value for token users.',
        price: 17.99,
        currency: 'USD',
        type: 'token',
        tokenAmount: 100,
    },
];

// --- VIDEO LOGS ---
export const videoLogs: VideoLog[] = [
    { id: 'log-1', userId: 'user-subscribed-pro', videoId: 'vid-1', watchedAt: new Date().getTime() - 86400000, progress: 95 },
    { id: 'log-2', userId: 'user-subscribed-pro', videoId: 'vid-4', watchedAt: new Date().getTime() - 172800000, progress: 50 },
    { id: 'log-3', userId: 'user-token-heavy', videoId: 'vid-3', watchedAt: new Date().getTime() - 3600000, progress: 100 },
    { id: 'log-4', userId: 'user-subscribed-basic', videoId: 'vid-6', watchedAt: new Date().getTime() - 259200000, progress: 78 },
    { id: 'log-5', userId: 'user-subscribed-basic', videoId: 'vid-2', watchedAt: new Date().getTime() - 604800000, progress: 100 },
    { id: 'log-6', userId: 'user-token-heavy', videoId: 'vid-7', watchedAt: new Date().getTime() - 120000, progress: 15 },
    { id: 'log-7', userId: 'user-gamer', videoId: 'vid-11', watchedAt: new Date().getTime() - 864000000, progress: 100 },
    { id: 'log-8', userId: 'user-gamer', videoId: 'vid-14', watchedAt: new Date().getTime() - 950400000, progress: 40 },
    { id: 'log-9', userId: 'user-chef', videoId: 'vid-10', watchedAt: new Date().getTime() - 345600000, progress: 90 },
    { id: 'log-10', userId: 'user-musician', videoId: 'vid-13', watchedAt: new Date().getTime() - 432000000, progress: 100 },
    { id: 'log-11', userId: 'user-artist', videoId: 'vid-15', watchedAt: new Date().getTime() - 518400000, progress: 65 },
    { id: 'log-12', userId: 'user-admin', videoId: 'vid-12', watchedAt: new Date().getTime() - 604800000, progress: 100 },
    { id: 'log-13', userId: 'user-subscribed-pro', videoId: 'vid-9', watchedAt: new Date().getTime() - 691200000, progress: 85 },
];
