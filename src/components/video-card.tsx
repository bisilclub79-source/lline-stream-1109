import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type Video } from '@/lib/types';
import { placeholderImages } from '@/lib/placeholder-images';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
    const image = placeholderImages.find(p => p.id === video.thumbnailId);
  return (
    <Link href={`/videos/${video.id}`} className="block group">
      <Card className="overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="relative aspect-video">
            {image ? (
                <Image
                    src={image.imageUrl}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    data-ai-hint={image.imageHint}
                />
            ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">No image</p>
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        </CardContent>
        <CardHeader className="p-4">
          <CardTitle className="text-base font-semibold leading-tight tracking-normal group-hover:text-primary transition-colors">
            {video.title}
          </CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
}
