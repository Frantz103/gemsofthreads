import { useQuery } from '@tanstack/react-query';
import { ThreadsApiService } from '@/services/threadsApi';
import { Thread } from '@/types/threads';

export const useDesignThreads = () => {
  return useQuery<Thread[], Error>({
    queryKey: ['threads', 'design-ui'],
    queryFn: () => ThreadsApiService.getDesignAndUIPosts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useProfileThreads = (username: string, limit: number = 25) => {
  return useQuery<Thread[], Error>({
    queryKey: ['threads', 'profile', username, limit],
    queryFn: () => ThreadsApiService.getProfilePosts(username, limit),
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useThread = (mediaId: string) => {
  return useQuery<Thread, Error>({
    queryKey: ['thread', mediaId],
    queryFn: () => ThreadsApiService.getThread(mediaId),
    enabled: !!mediaId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};