import { IPost } from '@/apis/client/blog/types';

export interface ITreeNode {
  id: string;
  name: string;
  subRows?: ITreeNode[];
  original?: IPost; // Store original post data for leaf nodes
}

export function buildTreeFromPosts(posts: IPost[]): ITreeNode[] {
  // Group posts by author name
  const postsByUser = posts.reduce((acc, post) => {
    const authorName = post.author?.full_name  || 'Không rõ';
    if (!acc[authorName]) {
      acc[authorName] = [];
    }
    acc[authorName].push(post);
    return acc;
  }, {} as Record<string, IPost[]>);

  // Build tree structure: author name as parent, posts as children
  return Object.entries(postsByUser).map(([authorName, userPosts]) => ({
    id: `user-${authorName}`,
    name: authorName,
    subRows: userPosts.map((post) => ({
      id: post.id,
      name: post.title,
      original: post,
    })),
  }));
}
