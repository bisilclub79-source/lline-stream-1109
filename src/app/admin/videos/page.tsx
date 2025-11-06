import { getVideos } from "@/lib/api";
import PageHeader from "../components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";

export default async function AdminVideosPage() {
    const videos = await getVideos();

    return (
        <div>
            <div className="flex items-center justify-between">
                <PageHeader title="Videos" description="Manage all videos on the platform." />
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Video
                </Button>
            </div>

            <div className="rounded-lg border shadow-sm">
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Access Level</TableHead>
                            <TableHead>Duration (m)</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {videos.map((video) => (
                            <TableRow key={video.id}>
                                <TableCell className="font-medium">{video.title}</TableCell>
                                <TableCell>
                                    <Badge variant={video.accessLevel === 'free' ? 'secondary' : 'default'}>
                                        {video.accessLevel}
                                    </Badge>
                                </TableCell>
                                <TableCell>{Math.round(video.duration / 60)}</TableCell>
                                <TableCell className="flex gap-1 max-w-xs flex-wrap">
                                    {video.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                                </TableCell>
                                <TableCell>
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            <DropdownMenuItem>Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

        </div>
    )
}
