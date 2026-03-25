"use client";

import React from "react";
import Link from "next/link";
import { Bell, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationsQuery,
  useUnreadCountQuery,
  NotificationItem,
} from "@/apis/client/notice";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe } from "@/hooks/useMe";
import { cn } from "@/lib/utils";

type ButtonVariant = React.ComponentProps<typeof Button>["variant"];
type ButtonSize = React.ComponentProps<typeof Button>["size"];

interface NoticeBellProps {
  limit?: number;
  buttonVariant?: ButtonVariant;
  buttonSize?: ButtonSize;
  buttonClassName?: string;
  badgeClassName?: string;
  contentClassName?: string;
  align?: React.ComponentProps<typeof PopoverContent>["align"];
  sideOffset?: number;
  resolveLink?: (notification: NotificationItem) => string | undefined;
  onNotificationClick?: (notification: NotificationItem) => void;
}

const formatTimeAgo = (dateValue: string) => {
  try {
    return formatDistanceToNow(new Date(dateValue), {
      addSuffix: true,
      locale: vi,
    });
  } catch {
    return "";
  }
};

export const NoticeBell: React.FC<NoticeBellProps> = ({
  limit = 10,
  buttonVariant = "ghost",
  buttonSize = "icon",
  buttonClassName,
  badgeClassName,
  contentClassName,
  align = "end",
  sideOffset = 8,
  resolveLink,
  onNotificationClick,
}) => {
  const { user, isAuthenticated } = useMe();
  const [open, setOpen] = React.useState(false);
  const userId = user?.id;
  const notificationsEnabled = isAuthenticated && !!userId;

  const listParams = React.useMemo(
    () => ({
      limit,
      page: 1,
    }),
    [limit]
  );

  const { data, isLoading, error } = useNotificationsQuery(listParams, userId, {
    enabled: notificationsEnabled,
  });

  const { data: unreadData } = useUnreadCountQuery(userId, {
    enabled: notificationsEnabled,
  });

  const notifications = data?.data ?? [];
  const unreadCount = unreadData?.unread_count ?? 0;
  

  const markReadMutation = useMarkNotificationReadMutation();
  const markAllMutation = useMarkAllNotificationsReadMutation();

  const handleItemClick = (notification: NotificationItem) => {
    if (!notification.is_read) {
      markReadMutation.mutate(notification.id);
    }

    onNotificationClick?.(notification);
  };

  const handleMarkAllRead = () => {
    if (unreadCount === 0 || markAllMutation.isPending) {
      return;
    }
    markAllMutation.mutate();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Button
            variant={buttonVariant}
            size={buttonSize}
            className={cn("rounded-full cursor-pointer", buttonClassName)}
          >
            <Bell className="h-5 w-5" />
          </Button>
          {unreadCount > 0 && (
            <span
              className={cn(
                "absolute top-0 right-0 min-w-5 h-5 translate-x-1/3 -translate-y-1/2 rounded-full bg-destructive px-1 text-center text-xs font-medium text-white",
                badgeClassName
              )}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "w-80 p-0 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800",
          contentClassName
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Thông báo
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {unreadCount} chưa đọc
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-purple-600 hover:text-purple-700"
            disabled={unreadCount === 0 || markAllMutation.isPending}
            onClick={handleMarkAllRead}
          >
            {markAllMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              "Đọc hết"
            )}
          </Button>
        </div>

        <div className="max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <p className="p-4 text-center text-sm text-red-500">
              Không thể tải thông báo.
            </p>
          ) : notifications.length === 0 ? (
            <p className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Không có thông báo nào.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((notification) => {
                const href = resolveLink?.(notification);

                const renderInner = () => (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {notification.message}
                      </h4>
                      {!notification.is_read && (
                        <span className="text-[10px] font-semibold uppercase text-purple-600">
                          Mới
                        </span>
                      )}
                    </div>
                    <p className="text-xs capitalize text-gray-500 dark:text-gray-400">
                      {notification.type}
                    </p>
                    <span className="text-xs text-gray-400">
                      {formatTimeAgo(notification.created_at)}
                    </span>
                  </div>
                );

                const handleClick = () => {
                  handleItemClick(notification);
                  setOpen(false);
                };

                return (
                  <li
                    key={notification.id}
                    className={cn(
                      "p-4 transition-colors duration-200",
                      notification.is_read
                        ? "bg-white dark:bg-gray-800"
                        : "bg-purple-50/60 dark:bg-gray-900"
                    )}
                  >
                    {href ? (
                      <Link href={href} className="block" onClick={handleClick}>
                        {renderInner()}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="block w-full text-left"
                        onClick={handleClick}
                      >
                        {renderInner()}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NoticeBell;
