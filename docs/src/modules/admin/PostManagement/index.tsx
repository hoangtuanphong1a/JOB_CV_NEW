'use client';

import { useEffect } from 'react';
import { useGetBlogInfiniteQuery } from '@/apis/client/blog/queries';
import { useQueryClient } from '@tanstack/react-query';

import Backpage from '@/components/ui/back-page';
import { LoadingScreen } from '@/components/ui/loading';
import { DataTable } from '@/components/ui/data-table';

import { columns } from './config/columns';
import { buildTreeFromPosts } from './libs/utils';
import { KEYS } from '@/apis/client/blog/keys';

function PostManagement() {
  const queryClient = useQueryClient();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetBlogInfiniteQuery(
    undefined,
    { limit: 100 } // Maximum allowed by backend
  );

  // Fetch all pages automatically
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

  // Flatten all posts from all pages
  const allPosts = data?.pages.flatMap((page) => page.data) ?? [];
  const treeData = buildTreeFromPosts(allPosts);


  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex gap-2 items-center">
          <Backpage />
          <h1 className="text-2xl font-bold">Quản lý bài viết</h1>
        </div>

        {isLoading || (isFetchingNextPage && hasNextPage) ? (
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

export default PostManagement;
