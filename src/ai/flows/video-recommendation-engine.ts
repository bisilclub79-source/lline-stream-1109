'use server';
/**
 * @fileOverview This file implements the video recommendation engine flow.
 *
 * It recommends relevant videos to users based on their viewing history.
 * It uses a tool to extract topics from video metadata and other users' viewing history.
 *
 * @exports {
 *   recommendVideos,
 *   RecommendVideosInput,
 *   RecommendVideosOutput,
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendVideosInputSchema = z.object({
  userId: z.string().describe('The ID of the user to recommend videos for.'),
  viewingHistory: z
    .array(z.string())
    .describe('The IDs of the videos the user has watched.'),
  videoMetadata: z
    .array(z.object({id: z.string(), title: z.string(), description: z.string()}))
    .describe('Metadata for all videos in the system.'),
  otherUsersViewingHistory: z
    .array(z.object({userId: z.string(), videoId: z.string()}))
    .describe('Viewing history of other users in the system.'),
});

export type RecommendVideosInput = z.infer<typeof RecommendVideosInputSchema>;

const RecommendVideosOutputSchema = z.object({
  recommendedVideoIds: z
    .array(z.string())
    .describe('The IDs of the videos recommended to the user.'),
});

export type RecommendVideosOutput = z.infer<typeof RecommendVideosOutputSchema>;

export async function recommendVideos(input: RecommendVideosInput): Promise<RecommendVideosOutput> {
  return recommendVideosFlow(input);
}

const extractTopicsTool = ai.defineTool({
  name: 'extractTopics',
  description: 'Extracts topics from a given text.',
  inputSchema: z.object({
    text: z.string().describe('The text to extract topics from.'),
  }),
  outputSchema: z.array(z.string()).describe('The extracted topics.'),
},
async input => {
  // This is a placeholder implementation.
  // In a real application, this would call an NLP service or model to extract topics.
  return ['topic1', 'topic2'];
});

const recommendVideosPrompt = ai.definePrompt({
  name: 'recommendVideosPrompt',
  input: {schema: RecommendVideosInputSchema},
  output: {schema: RecommendVideosOutputSchema},
  tools: [extractTopicsTool],
  prompt: `You are a video recommendation engine.

  Recommend videos to the user based on their viewing history and the viewing history of other users.
  Use the extractTopics tool to extract topics from video titles and descriptions.
  Consider the viewing history of other users who have watched similar videos.

  User ID: {{{userId}}}
  Viewing History: {{viewingHistory}}
  Video Metadata: {{videoMetadata}}
  Other Users Viewing History: {{otherUsersViewingHistory}}

  Output should be a list of video IDs that the user might enjoy.
`,
});

const recommendVideosFlow = ai.defineFlow(
  {
    name: 'recommendVideosFlow',
    inputSchema: RecommendVideosInputSchema,
    outputSchema: RecommendVideosOutputSchema,
  },
  async input => {
    const {output} = await recommendVideosPrompt(input);
    return output!;
  }
);
