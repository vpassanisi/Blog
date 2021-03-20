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

export interface Request {
  slug?: string;
  md?: string;
  title?: string;
  banner?: string;
  excerpt?: string;
  live?: boolean;
}
