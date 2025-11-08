import { getCategories, getCategoryBySlug, getVideos } from '@/lib/api';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import VideoCard from '@/components/video-card';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Film } from 'lucide-react';
import { categories as allCategories } from '@/lib/data';
import React from 'react';

export default async function CategoryPage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug || [];
  const isRoot = slug.length === 0 || slug[0] === 'all';
  
  let pageTitle = "All Categories";
  let breadcrumbLinks = [{ name: 'Categories', href: '/category/all' }];
  let content;

  if (isRoot) {
    const categories = await getCategories({level: 1});
    content = (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {categories.map((category) => (
          <Link key={category.id} href={`/category/${category.slug}`}>
            <Card className="group relative overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-primary/20 hover:shadow-lg">
              <CardContent className="flex flex-col items-center justify-center p-6 aspect-square">
                <Film className="h-12 w-12 text-primary group-hover:text-accent transition-colors" />
                <p className="mt-4 text-center font-semibold">{category.name}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    );
  } else {
    const currentCategory = await getCategoryBySlug(slug[slug.length - 1]);
    if (!currentCategory) {
      return <div className="container py-12">Category not found.</div>;
    }

    // Build breadcrumbs
    let path = [];
    let current: typeof currentCategory | undefined = currentCategory;
    while(current) {
        path.unshift(current);
        const parent = allCategories.find(c => c.id === current.parentId);
        current = parent;
    }

    const fullPathSlugs = path.map(p => p.slug);
    
    breadcrumbLinks.push(...path.map((p, i) => ({ 
        name: p.name, 
        href: `/category/${fullPathSlugs.slice(0, i + 1).join('/')}` 
    })));


    pageTitle = currentCategory.name;
    const subCategories = await getCategories({ parentId: currentCategory.id });

    if (subCategories.length > 0) {
      // It's a category page with sub-categories
      content = (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {subCategories.map((category) => (
            <Link key={category.id} href={`/category/${fullPathSlugs.join('/')}/${category.slug}`}>
              <Card className="group relative overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-primary/20 hover:shadow-lg">
                <CardContent className="flex flex-col items-center justify-center p-6 aspect-video">
                  <Film className="h-10 w-10 text-primary" />
                  <p className="mt-4 text-center font-semibold">{category.name}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      );
    } else {
      // It's a sub-category page, show videos
      const videos = await getVideos({ categoryId: currentCategory.id });
      content = videos.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {videos.map(video => <VideoCard key={video.id} video={video} />)}
        </div>
      ) : (
        <p className="text-muted-foreground">No videos in this category yet.</p>
      );
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
            <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {breadcrumbLinks.map((link, index) => (
                <React.Fragment key={index}>
                 <BreadcrumbItem>
                    {index === breadcrumbLinks.length - 1 ? (
                        <BreadcrumbPage>{link.name}</BreadcrumbPage>
                    ) : (
                        <BreadcrumbLink asChild>
                            <Link href={link.href}>{link.name}</Link>
                        </BreadcrumbLink>
                    )}
                </BreadcrumbItem>
                {index < breadcrumbLinks.length -1 && <BreadcrumbSeparator />}
                </React.Fragment>
            ))}
        </BreadcrumbList>
      </Breadcrumb>
      
      <h1 className="text-3xl font-bold tracking-tight font-headline mb-8">{pageTitle}</h1>
      {content}
    </div>
  );
}
