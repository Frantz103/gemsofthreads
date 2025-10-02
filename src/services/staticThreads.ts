/**
 * Service for consuming static JSON files generated at build time
 * This provides fast, CDN-cached access to thread data
 */

import { Thread } from '@/types/threads';

interface DataManifest {
  generatedAt: string;
  totalThreads: number;
  byType: {
    text: number;
    image: number;
  };
  sources: string[];
  nextUpdate: string;
}

export class StaticThreadsService {
  private static readonly BASE_URL = '/data';

  /**
   * Fetch data manifest with generation info
   */
  static async getManifest(): Promise<DataManifest | null> {
    try {
      const response = await fetch(`${this.BASE_URL}/manifest.json`);
      if (!response.ok) return null;

      return await response.json();
    } catch (error) {
      console.warn('Could not fetch data manifest:', error);
      return null;
    }
  }

  /**
   * Get all threads from static JSON
   */
  static async getAllThreads(): Promise<Thread[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/threads-all.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch threads: ${response.status}`);
      }

      const threads = await response.json();
      return threads || [];
    } catch (error) {
      console.error('Error fetching all threads:', error);
      return [];
    }
  }

  /**
   * Get text-only threads
   */
  static async getTextThreads(): Promise<Thread[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/threads-text.json`);
      if (!response.ok) return [];

      const threads = await response.json();
      return threads || [];
    } catch (error) {
      console.error('Error fetching text threads:', error);
      return [];
    }
  }

  /**
   * Get image threads
   */
  static async getImageThreads(): Promise<Thread[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/threads-images.json`);
      if (!response.ok) return [];

      const threads = await response.json();
      return threads || [];
    } catch (error) {
      console.error('Error fetching image threads:', error);
      return [];
    }
  }

  /**
   * Get recent threads (for homepage)
   */
  static async getRecentThreads(): Promise<Thread[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/threads-recent.json`);
      if (!response.ok) return [];

      const threads = await response.json();
      return threads || [];
    } catch (error) {
      console.error('Error fetching recent threads:', error);
      return [];
    }
  }

  /**
   * Get threads by type with fallback
   */
  static async getThreadsByType(type: 'all' | 'text' | 'images'): Promise<Thread[]> {
    switch (type) {
      case 'text':
        return await this.getTextThreads();
      case 'images':
        return await this.getImageThreads();
      default:
        return await this.getAllThreads();
    }
  }

  /**
   * Check if static data is fresh
   */
  static async isDataFresh(): Promise<boolean> {
    const manifest = await this.getManifest();
    if (!manifest) return false;

    const nextUpdate = new Date(manifest.nextUpdate);
    return new Date() < nextUpdate;
  }

  /**
   * Get data age in hours
   */
  static async getDataAge(): Promise<number | null> {
    const manifest = await this.getManifest();
    if (!manifest) return null;

    const generatedAt = new Date(manifest.generatedAt);
    const now = new Date();
    return (now.getTime() - generatedAt.getTime()) / (1000 * 60 * 60);
  }

  /**
   * Get detailed statistics about the static data
   */
  static async getStatistics() {
    const manifest = await this.getManifest();
    if (!manifest) return null;

    const dataAge = await this.getDataAge();

    return {
      manifest,
      dataAge,
      isFresh: await this.isDataFresh(),
      performance: {
        loadTime: 'Sub-100ms via CDN',
        cacheHit: 'Static file delivery',
        apiCalls: 0
      }
    };
  }
}