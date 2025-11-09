import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { getCategories, getVideos } from '@/lib/api';
import VideoCard from '@/components/video-card';
import { Card, CardContent } from '@/components/ui/card';
import { placeholderImages } from '@/lib/placeholder-images';
import { Clapperboard } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const popularVideos = await getVideos();
  const recentlyWatchedVideos = await getVideos({ limit: 5 }); // Mocked for demonstration
  const categories = await getCategories({ level: 1 });
  const heroImage = placeholderImages.find(p => p.id === 'hero-1');

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full">
        {heroImage && (
             <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                priority
                data-ai-hint={heroImage.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-extrabold tracking-tight font-headline text-white sm:text-5xl md:text-6xl lg:text-7xl">
              CineStream
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-foreground/80 sm:text-xl md:text-2xl">
              Unlock Your Potential, One Lesson at a Time.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg" className="font-bold">
                <Link href="/signup">Start Learning</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="font-bold">
                <Link href="/pricing">See Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        <h2 className="text-2xl font-bold tracking-tight font-headline sm:text-3xl">
          Explore Categories
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {categories.map((category) => {
            const image = placeholderImages.find(p => p.id === category.thumbnailId);
            return (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <Card className="group relative overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-primary/20 hover:shadow-lg">
                  <CardContent className="p-0 aspect-square">
                    {image ? (
                        <Image
                          src={image.imageUrl}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          data-ai-hint={image.imageHint}
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
            )
          })}
            <Link href="/category/all">
              <Card className="group relative overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-primary/20 hover:shadow-lg bg-muted border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-6 aspect-square">
                    <Clapperboard className="h-12 w-12 text-primary/80 group-hover:text-accent transition-colors" />
                    <p className="mt-4 text-center font-semibold text-primary/80">View All</p>
                </CardContent>
              </Card>
            </Link>
        </div>
      </section>

      {/* Popular Videos Carousel */}
      <section className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <h2 className="text-2xl font-bold tracking-tight font-headline sm:text-3xl">
          Popular Videos
        </h2>
        <Carousel
          opts={{ align: 'start', loop: true }}
          className="mt-8 w-full"
        >
          <CarouselContent>
            {popularVideos.map((video, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-1">
                  <VideoCard video={video} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </section>

       {/* Recently Watched - This would be conditionally rendered based on auth state */}
       <section className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <h2 className="text-2xl font-bold tracking-tight font-headline sm:text-3xl">
          Recently Watched
        </h2>
        <Carousel
          opts={{ align: 'start' }}
          className="mt-8 w-full"
        >
          <CarouselContent>
            {recentlyWatchedVideos.map((video, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-1">
                  <VideoCard video={video} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </section>
    </div>
  );
}
