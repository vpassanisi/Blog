export interface Post {
  id: string;
  slug: string;
  title: string;
  banner: string;
  tiny: string;
  excerpt: string;
  markdown: string;
  created: number;
  updated?: number;
  live: boolean;
}

export interface UpdatePostRequest {
  id: string;
  live: boolean;
}

export interface NewPostRequest {
  md: string;
  slug: string;
  title: string;
  banner: string;
  excerpt: string;
  live: boolean;
}
