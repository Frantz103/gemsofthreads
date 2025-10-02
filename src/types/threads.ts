// Threads API Types based on Meta's API response structure

export interface ThreadsMediaObject {
  id: string;
  media_product_type: "THREADS";
  media_type: "TEXT_POST" | "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  permalink: string;
  owner?: {
    id: string;
  };
  username: string;
  text?: string;
  topic_tag?: string;
  timestamp: string;
  shortcode: string;
  thumbnail_url?: string;
  children?: {
    data: ThreadsMediaObject[];
  };
  is_quote_post: boolean;
}

export interface ThreadsApiResponse {
  data: ThreadsMediaObject[];
  paging?: {
    cursors: {
      before?: string;
      after?: string;
    };
  };
}

// Simplified Thread interface for our app
export interface Thread {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  replies: number;
  type: "text" | "image";
  timestamp: string;
  permalink: string;
  topic_tag?: string;
}

export interface ThreadsApiError {
  error: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id: string;
  };
}