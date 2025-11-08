import PageHeader from "../components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function AdminVideosPage() {
    return (
        <div>
            <PageHeader title="Video Management" description="Upload, edit, and manage all videos on the platform." />
            <Tabs defaultValue="upload">
                <TabsList className="mb-4">
                    <TabsTrigger value="upload">Upload Video</TabsTrigger>
                    <TabsTrigger value="list">Video List</TabsTrigger>
                </TabsList>
                <TabsContent value="upload">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload a New Video</CardTitle>
                            <CardDescription>Choose between uploading a file or registering a link.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <Tabs defaultValue="file-upload" className="w-full">
                                <TabsList>
                                    <TabsTrigger value="file-upload">Upload File</TabsTrigger>
                                    <TabsTrigger value="link-upload">Register via Link</TabsTrigger>
                                </TabsList>
                                <TabsContent value="file-upload" className="mt-4">
                                    <form className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="title">Title</Label>
                                                <Input id="title" placeholder="e.g. Introduction to Next.js" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="instructor">Instructor</Label>
                                                <Input id="instructor" placeholder="e.g. John Doe" />
                                            </div>
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea id="description" placeholder="A brief summary of the video content." />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label>Category</Label>
                                                <Select>
                                                    <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="cat-1-1">Movies / Action</SelectItem>
                                                        <SelectItem value="cat-1-3-1">Movies / Sci-Fi / Space Opera</SelectItem>
                                                        <SelectItem value="cat-2-1">Educational / Science</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                             <div className="space-y-2">
                                                <Label htmlFor="video-file">Video File</Label>
                                                <Input id="video-file" type="file" />
                                            </div>
                                             <div className="space-y-2">
                                                <Label htmlFor="thumbnail-file">Thumbnail (Optional)</Label>
                                                <Input id="thumbnail-file" type="file" />
                                            </div>
                                        </div>
                                        <Button type="submit">Upload Video</Button>
                                    </form>
                                </TabsContent>
                                <TabsContent value="link-upload" className="mt-4">
                                     <form className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="title-link">Title</Label>
                                                <Input id="title-link" placeholder="e.g. Introduction to Next.js" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="instructor-link">Instructor</Label>
                                                <Input id="instructor-link" placeholder="e.g. John Doe" />
                                            </div>
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="description-link">Description</Label>
                                            <Textarea id="description-link" placeholder="A brief summary of the video content." />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Category</Label>
                                                <Select>
                                                    <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="cat-1-1">Movies / Action</SelectItem>
                                                        <SelectItem value="cat-1-3-1">Movies / Sci-Fi / Space Opera</SelectItem>
                                                        <SelectItem value="cat-2-1">Educational / Science</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                             <div className="space-y-2">
                                                <Label htmlFor="video-url">Video URL</Label>
                                                <Input id="video-url" placeholder="https://example.com/video.mp4" />
                                            </div>
                                        </div>
                                        <Button type="submit">Register Video</Button>
                                    </form>
                                </TabsContent>
                           </Tabs>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="list">
                    <Card>
                        <CardHeader>
                            <CardTitle>Video List</CardTitle>
                            <CardDescription>A list of all uploaded videos.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">Thumbnail</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead><span className="sr-only">Actions</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <Image src="https://picsum.photos/seed/1/100/56" alt="Thumbnail" width={100} height={56} className="rounded-md object-cover" />
                                        </TableCell>
                                        <TableCell className="font-medium">Galactic Warriors</TableCell>
                                        <TableCell>Movies / Sci-Fi / Space Opera</TableCell>
                                        <TableCell>2024-08-15</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
