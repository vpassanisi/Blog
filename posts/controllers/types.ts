export interface Post {
  id: string;
  slug: string;
  markdown: string;
  created: number;
  updated?: number;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  markdown: string;
  banner: string;
  created: number;
  update?: number;
}

export interface Request {
  slug?: string;
  md?: string;
}

export interface Data {
  title: string;
  slug: string;
  banner: string;
}
