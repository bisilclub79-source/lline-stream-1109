import { users, categories, videos, pricingPlans, videoLogs } from './data';
import { User, Category, Video, PricingPlan, VideoLog } from './types';

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

// A function to recursively build the category tree
function buildCategoryTree(list: Category[], parentId: string | null = null): Category[] {
  return list
    .filter(item => item.parentId === parentId)
    .map(item => ({
      ...item,
      children: buildCategoryTree(list, item.id),
    }));
}

export async function getUsers(): Promise<User[]> {
  await simulateDelay(100);
  return users;
}

export async function getUserById(id: string): Promise<User | undefined> {
  await simulateDelay(50);
  return users.find(user => user.id === id);
}

export async function getCategories(options?: { level?: number, parentId?: string | null }): Promise<Category[]> {
  await simulateDelay(100);
  if (options?.level === 1) {
    return categories.filter(c => c.parentId === null);
  }
  const tree = buildCategoryTree(categories, options?.parentId);
  return tree;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
    await simulateDelay(50);
    return categories.find(c => c.slug === slug);
}

export async function getVideos(options?: { limit?: number, categoryId?: string }): Promise<Video[]> {
  await simulateDelay(200);
  let result = videos;
  if (options?.categoryId) {
    result = result.filter(v => v.categoryId === options.categoryId || categories.find(c => c.id === v.categoryId)?.parentId === options.categoryId);
  }
  if (options?.limit) {
    return result.slice(0, options.limit);
  }
  return result;
}

export async function getVideoById(id: string): Promise<Video | undefined> {
  await simulateDelay(100);
  return videos.find(video => video.id === id);
}

export async function getPricingPlans(): Promise<PricingPlan[]> {
  await simulateDelay(50);
  return pricingPlans;
}

export async function getVideoLogsByUserId(userId: string): Promise<VideoLog[]> {
    await simulateDelay(150);
    return videoLogs.filter(log => log.userId === userId);
}
