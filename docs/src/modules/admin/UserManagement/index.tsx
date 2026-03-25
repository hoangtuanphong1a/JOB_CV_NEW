'use client';

import { useQueryClient } from '@tanstack/react-query';

import Backpage from '@/components/ui/back-page';
import { LoadingScreen } from '@/components/ui/loading';
import { DataTable } from '@/components/ui/data-table';

import { columns } from './config/columns';
import { buildTreeFromUsers } from './libs/utils';
import { useGetAllUsersQuery } from '@/apis/client/user/queries';
import { KEYS } from '@/apis/client/user/keys';

function UserManagement() {
  const queryClient = useQueryClient();
  
  const { data: users, isLoading } = useGetAllUsersQuery();

  const treeData = buildTreeFromUsers(users || []);


  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex gap-2 items-center">
          <Backpage />
          <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
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

export default UserManagement;

