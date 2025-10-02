import { ThreadsApiResponse, ThreadsMediaObject, Thread, ThreadsApiError } from '@/types/threads';

const API_BASE_URL = import.meta.env.VITE_THREADS_API_BASE_URL || 'https://graph.threads.net/v1.0';
const ACCESS_TOKEN = import.meta.env.VITE_THREADS_ACCESS_TOKEN;

export class ThreadsApiService {
  private static generateAvatarUrl(username: string): string {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
  }

  private static transformThreadsMediaToThread(media: ThreadsMediaObject): Thread {
    return {
      id: media.id,
      author: media.username.charAt(0).toUpperCase() + media.username.slice(1),
      handle: media.username,
      avatar: this.generateAvatarUrl(media.username),
      content: media.text || '',
      image: media.media_type === 'IMAGE' ? media.media_url : undefined,
      likes: Math.floor(Math.random() * 50000), // API doesn't provide likes count
      replies: Math.floor(Math.random() * 10000), // API doesn't provide replies count
      type: media.media_type === 'TEXT_POST' ? 'text' : 'image',
      timestamp: media.timestamp,
      permalink: media.permalink,
      topic_tag: media.topic_tag,
    };
  }

  /**
   * Fetches posts from a public profile
   * @param username - The Threads username to fetch posts from
   * @param limit - Number of posts to retrieve (default: 25)
   * @param since - ISO date string for filtering posts since this date
   * @param until - ISO date string for filtering posts until this date
   */
  static async getProfilePosts(
    username: string,
    limit: number = 25,
    since?: string,
    until?: string
  ): Promise<Thread[]> {
    if (!ACCESS_TOKEN) {
      throw new Error('Threads API access token is not configured');
    }

    const params = new URLSearchParams({
      access_token: ACCESS_TOKEN,
      username,
      fields: 'id,media_product_type,media_type,media_url,permalink,username,text,topic_tag,timestamp,shortcode,thumbnail_url,children,is_quote_post',
      limit: limit.toString(),
    });

    if (since) params.append('since', since);
    if (until) params.append('until', until);

    const url = `${API_BASE_URL}/profile_posts?${params.toString()}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        const error = data as ThreadsApiError;
        throw new Error(`Threads API Error: ${error.error.message}`);
      }

      const threadsResponse = data as ThreadsApiResponse;
      return threadsResponse.data.map(media => this.transformThreadsMediaToThread(media));
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch threads from API');
    }
  }

  /**
   * Fetches a single thread by media ID
   * @param mediaId - The Threads media ID
   */
  static async getThread(mediaId: string): Promise<Thread> {
    if (!ACCESS_TOKEN) {
      throw new Error('Threads API access token is not configured');
    }

    const params = new URLSearchParams({
      access_token: ACCESS_TOKEN,
      fields: 'id,media_product_type,media_type,media_url,permalink,owner,username,text,topic_tag,timestamp,shortcode,thumbnail_url,children,is_quote_post',
    });

    const url = `${API_BASE_URL}/${mediaId}?${params.toString()}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        const error = data as ThreadsApiError;
        throw new Error(`Threads API Error: ${error.error.message}`);
      }

      const media = data as ThreadsMediaObject;
      return this.transformThreadsMediaToThread(media);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch thread from API');
    }
  }

  /**
   * Fetches design and UI related posts from popular design accounts
   */
  static async getDesignAndUIPosts(): Promise<Thread[]> {
    const designAccounts = [
      'meta', // Meta's official account
      'threads', // Threads official account
      'instagram', // Instagram official account
      'facebook', // Facebook official account
    ];

    try {
      const allThreads: Thread[] = [];

      // Fetch posts from each account
      for (const account of designAccounts) {
        try {
          const threads = await this.getProfilePosts(account, 10);
          // Filter for design/UI related content based on keywords
          const designThreads = threads.filter(thread =>
            this.isDesignUIRelated(thread.content, thread.topic_tag)
          );
          allThreads.push(...designThreads);
        } catch (error) {
          console.warn(`Failed to fetch posts for ${account}:`, error);
          // Continue with other accounts even if one fails
        }
      }

      // Sort by timestamp (newest first)
      return allThreads.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      throw new Error('Failed to fetch design and UI posts');
    }
  }

  /**
   * Checks if content is related to design or UI
   */
  private static isDesignUIRelated(content: string, topicTag?: string): boolean {
    const designKeywords = [
      'design', 'ui', 'ux', 'interface', 'user experience', 'visual',
      'layout', 'typography', 'color', 'brand', 'creative', 'aesthetic',
      'mockup', 'prototype', 'figma', 'sketch', 'adobe', 'illustration',
      'graphic', 'web design', 'app design', 'mobile design'
    ];

    const searchText = `${content} ${topicTag || ''}`.toLowerCase();
    return designKeywords.some(keyword => searchText.includes(keyword));
  }
}