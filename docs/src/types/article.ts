export interface Author {
  name: string;
  avatar: string;
  date: string;
}

export interface Article {
    id?: string;
    slug: string;
    coverImage?: string;
    author: {
      name: string;
      avatar: string;
      date: string;
    };
    title: string;
    tags: string[];
    reactions: number;
    comments: number;
    content: string;
    featured?: boolean;
  }

