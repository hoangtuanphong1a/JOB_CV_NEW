'use client';

import { useEffect, useMemo } from 'react';
import { useGetBlogInfiniteQuery } from '@/apis/client/blog/queries';
import { useQueryClient } from '@tanstack/react-query';
import { useQueries } from '@tanstack/react-query';

import Backpage from '@/components/ui/back-page';
import { LoadingScreen } from '@/components/ui/loading';
import { DataTable } from '@/components/ui/data-table';

import { columns } from './config/columns';
import { buildInteractionTree, IInteractionNode } from './libs/utils';
import { KEYS } from '@/apis/client/blog/keys';
import { CommentService } from '@/apis/client/comment/requests';
import { LikeService } from '@/apis/client/like/requests';
import { CommentListResponse } from '@/apis/client/comment/types';
import { LikeListResponse } from '@/apis/client/like/types';

function InteractionManagement() {
  const queryClient = useQueryClient();
  const { data: postsData, isLoading: isLoadingPosts, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetBlogInfiniteQuery(
    undefined,
    { limit: 100 } // Maximum allowed by backend
  );

  // Fetch all pages automatically
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage && !isLoadingPosts) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isLoadingPosts, fetchNextPage]);

  // Flatten all posts from all pages
  const allPosts = useMemo(() => {
    return postsData?.pages.flatMap((page) => page.data) ?? [];
  }, [postsData?.pages]);

  // Fetch comments and likes for all posts
  const interactionQueries = useQueries({
    queries: allPosts.flatMap((post) => [
      {
        queryKey: ['post-comments', post.id],
        queryFn: () => CommentService.getComments(post.id, { limit: 100, threaded: false }),
        enabled: allPosts.length > 0,
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
      {
        queryKey: ['post-likes', post.id],
        queryFn: () => LikeService.getPostLikes(post.id, { limit: 100 }),
        enabled: allPosts.length > 0,
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    ]),
  });

  // Check if interactions are loading
  const isLoadingInteractions = interactionQueries.some((query) => query.isLoading);

  // Build comments and likes maps
  const commentsMap = useMemo(() => {
    const map: Record<string, CommentListResponse['data']> = {};
    interactionQueries.forEach((query, index) => {
      if (index % 2 === 0 && query.data) {
        const postIndex = Math.floor(index / 2);
        const post = allPosts[postIndex];
        if (post) {
          map[post.id] = (query.data as CommentListResponse).data || [];
        }
      }
    });
    return map;
  }, [interactionQueries, allPosts]);

  const likesMap = useMemo(() => {
    const map: Record<string, LikeListResponse['items']> = {};
    interactionQueries.forEach((query, index) => {
      if (index % 2 === 1 && query.data) {
        const postIndex = Math.floor(index / 2);
        const post = allPosts[postIndex];
        if (post) {
          map[post.id] = (query.data as LikeListResponse).items || [];
        }
      }
    });
    return map;
  }, [interactionQueries, allPosts]);

  // Build tree data
  const treeData: IInteractionNode[] = useMemo(() => {
    if (allPosts.length === 0) return [];
    return buildInteractionTree(allPosts, commentsMap, likesMap);
  }, [allPosts, commentsMap, likesMap]);


  const isLoading = isLoadingPosts || isLoadingInteractions || (isFetchingNextPage && hasNextPage);

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex gap-2 items-center">
          <Backpage />
          <h1 className="text-2xl font-bold">Quản lý tương tác</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingScreen />
          </div>
        ) : (
          <DataTable
            data={treeData}
            columns={columns}
            getSubRows={(row) => row.subRows}
            enableTreeView
            onRowClick={(id) => console.log('Clicked:', id)}
          />
        )}
      </div>
    </div>
  );
}

export default InteractionManagement;

