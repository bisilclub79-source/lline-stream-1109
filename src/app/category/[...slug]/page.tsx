import { getCategories, getCategoryBySlug, getVideos } from '@/lib/api';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import VideoCard from '@/components/video-card';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Clapperboard } from 'lucide-react';
import { categories as allCategories } from '@/lib/data';
import React from 'react';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';

export default async function CategoryPage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug || [];
  const isRoot = slug.length === 0 || slug[0] === 'all';
  
  let pageTitle = "All Categories";
  let breadcrumbLinks = [{ name: 'Categories', href: '/category/all' }];
  let content;

  const renderCategoryCard = (category: (typeof allCategories)[0]) => {
    const image = placeholderImages.find(p => p.id === category.thumbnailId);
    return (
        <Link key={category.id} href={`/category/${category.slug}`}>
            <Card className="group relative overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-primary/20 hover:shadow-lg">
                <CardContent className="p-0 aspect-video">
                {image ? (
                    <Image
                        src={image.imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        data-ai-hint={image.imageHint}
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                ): (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                        <Clapperboard className="h-12 w-12 text-muted-foreground" />
                    </div>
                )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4">
                        <p className="font-bold text-white text-lg">{category.name}</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
  }

  if (isRoot) {
    const categories = await getCategories({level: 1});
    content = (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {categories.map(renderCategoryCard)}
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
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {subCategories.map((category) => {
            const image = placeholderImages.find(p => p.id === category.thumbnailId);
            const categoryLink = `/category/${fullPathSlugs.join('/')}/${category.slug}`;
             return (
                <Link key={category.id} href={categoryLink}>
                    <Card className="group relative overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-primary/20 hover:shadow-lg">
                        <CardContent className="p-0 aspect-video">
                        {image ? (
                            <Image
                                src={image.imageUrl}
                                alt={category.name}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                data-ai-hint={image.imageHint}
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            />
                        ): (
                            <div className="flex h-full w-full items-center justify-center bg-muted">
                                <Clapperboard className="h-10 w-10 text-muted-foreground" />
                            </div>
                        )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-4">
                                <p className="font-semibold text-white">{category.name}</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            )
          })}
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
