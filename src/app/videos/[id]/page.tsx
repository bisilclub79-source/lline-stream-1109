import { getVideos, getVideoById, getUserById } from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { recommendVideos, RecommendVideosInput } from '@/ai/flows/video-recommendation-engine';
import VideoCard from '@/components/video-card';
import { placeholderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

// Mock function to get current user. In a real app this would come from a session.
async function getCurrentUser() {
    return getUserById('user-subscribed-pro');
}


export default async function VideoPage({ params }: { params: { id: string } }) {
  const video = await getVideoById(params.id);
  const user = await getCurrentUser();

  if (!video) {
    notFound();
  }

  const image = placeholderImages.find(p => p.id === video.thumbnailId);

  // Recommendation Engine
  const allVideos = await getVideos();
  const recommendationInput: RecommendVideosInput = {
    userId: user?.id || 'guest',
    viewingHistory: ['vid-1', 'vid-4'], // Mocked
    videoMetadata: allVideos.map(v => ({ id: v.id, title: v.title, description: v.description })),
    otherUsersViewingHistory: [ // Mocked
        { userId: 'other-1', videoId: 'vid-1' },
        { userId: 'other-1', videoId: 'vid-2' },
        { userId: 'other-2', videoId: 'vid-5' },
    ]
  };
  const recommendations = await recommendVideos(recommendationInput);
  const recommendedVideos = allVideos.filter(v => recommendations.recommendedVideoIds.includes(v.id));

  // Access Control Logic
  let hasAccess = false;
  if (video.accessLevel === 'free') {
    hasAccess = true;
  } else if (user) {
    if (video.accessLevel === 'subscription' && user.subscription?.status === 'active') {
        hasAccess = true;
    } else if (video.accessLevel === 'token' && user.tokens.balance >= (video.tokenCost || 0)) {
        hasAccess = true;
    }
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black">
            {hasAccess ? (
                 <video
                    controls
                    className="w-full h-full"
                    poster={image?.imageUrl}
                    src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" // Placeholder video
                >
                    Your browser does not support the video tag.
                </video>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                    {image && <Image src={image.imageUrl} alt={video.title} fill className="object-cover opacity-20" />}
                    <div className="z-10">
                        <Lock className="h-16 w-16 text-primary mx-auto" />
                        <h2 className="mt-4 text-2xl font-bold">Content Locked</h2>
                        {video.accessLevel === 'subscription' && (
                            <>
                            <p className="mt-2 text-muted-foreground">This video is available for subscribers only.</p>
                            <Button className="mt-6 font-bold" asChild><a href="/pricing">Subscribe Now</a></Button>
                            </>
                        )}
                         {video.accessLevel === 'token' && (
                            <>
                            <p className="mt-2 text-muted-foreground">Unlock this video for {video.tokenCost} tokens.</p>
                             <Button className="mt-6 font-bold">Unlock with Tokens</Button>
                            </>
                        )}
                    </div>
                </div>
            )}
          </div>
          <Card className="mt-4">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl font-headline">{video.title}</CardTitle>
                    <Badge variant="secondary" className="capitalize">{video.accessLevel}</Badge>
                </div>
                <div className="flex gap-2 pt-2">
                    {video.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{video.description}</p>
            </CardContent>
          </Card>
        </div>
        <aside>
          <h2 className="text-xl font-bold font-headline mb-4">Recommended for You</h2>
          <div className="space-y-4">
            {recommendedVideos.slice(0, 5).map(recVideo => (
                <Link href={`/videos/${recVideo.id}`} key={recVideo.id} className="flex items-start gap-4 group">
                    <div className="relative w-32 h-20 rounded-md overflow-hidden shrink-0">
                        <Image src={placeholderImages.find(p => p.id === recVideo.thumbnailId)?.imageUrl || ''} alt={recVideo.title} fill className="object-cover" />
                    </div>
                    <div>
                        <h3 className="font-semibold leading-tight group-hover:text-primary transition-colors">{recVideo.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{Math.round(recVideo.duration / 60)} min</p>
                    </div>
                </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
