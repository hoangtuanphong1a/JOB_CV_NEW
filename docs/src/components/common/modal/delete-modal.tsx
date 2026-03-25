/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { ExternalLink, OctagonAlert, Trash, X } from "lucide-react";

type Props = {
    deleteModalOpen: boolean;
    setDeleteModalOpen: (open: boolean) => void;
    row: any;
    loading: boolean;
    handleDelete: () => void;
}

const DeleteModal: React.FC<Props> = ({ deleteModalOpen, setDeleteModalOpen, row, loading, handleDelete }) => {
    return (
        <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
            <AlertDialogContent className="overflow-hidden">
                <AlertDialogHeader className="pb-4">
                    <AlertDialogTitle>
                        <div className="mx-auto sm:mx-0 mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10">
                            <OctagonAlert className="h-5 w-5 text-destructive" />
                        </div>
                        Xóa dữ liệu
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-[15px]">
                        Bạn có chắc chắn muốn xóa dữ liệu <strong>{row.original.name || row.original.title || row.original.fullName || row.original.post}</strong>? Hành động này không thể hoàn tác.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="border-t -mx-6 -mb-6 px-6 py-5">
                    <Button
                        variant="link"
                        className="-ml-3 mr-auto text-muted-foreground"
                    >
                        Tìm hiểu thêm <ExternalLink />
                    </Button>
                    <AlertDialogCancel
                        onClick={() => setDeleteModalOpen(false)}
                        disabled={loading}
                    >
                        <X /> Hủy
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className={buttonVariants({ variant: "destructive" })}
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        <Trash />
                        {loading ? 'Đang xóa...' : 'Tiếp tục'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteModal;