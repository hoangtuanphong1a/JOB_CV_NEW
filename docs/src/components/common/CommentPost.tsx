'use client';

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { cn, onMutateError } from "@/lib/utils";
import { useCreateCommentMutation, useGetCommentsQuery, CommentEntity } from "@/apis/client/comment";
import { useUserStore } from "@/stores";

export interface CommentItem {
  id: string;
  content: string;
  countLike: number;
  status: string;
  userId: string;
  author: string;
  avatar: string;
  createdAt: string;
  blogPostId: string;
  parentId?: string;
  replies?: CommentItem[];
  depth?: number;
  liked?: boolean;
}

interface CommentPostProps {
  initialComments?: CommentItem[];
  initialCount?: number;
  className?: string;
  showForm?: boolean;
  showTitle?: boolean;
  blogPostId?: string;
  onCommentSubmit?: (comment: CommentItem) => void;
  highlightCommentId?: string;
}

const mapCommentFromEntity = (comment: CommentEntity): CommentItem => {
  const displayName =
    comment.author?.full_name ||
    comment.author?.username ||
    "Ẩn danh";

  return {
    id: comment.id,
    content: comment.content,
    countLike: 0,
    status: comment.status,
    userId: comment.user_id,
    author: displayName,
    avatar: comment.author?.avatar_url || "",
    createdAt: comment.created_at,
    blogPostId: comment.post_id,
    parentId: comment.parent_id || undefined,
    replies: comment.replies?.map(mapCommentFromEntity) || [],
    depth: comment.depth,
    liked: false,
  };
};

const mapComments = (comments: CommentEntity[] = []): CommentItem[] =>
  comments.map(mapCommentFromEntity);

export const CommentPost = ({
  initialComments,
  initialCount = 0,
  className,
  showForm = true,
  showTitle = true,
  blogPostId,
  onCommentSubmit,
  highlightCommentId,
}: CommentPostProps) => {
  const user = useUserStore.useUser();
  const [comments, setComments] = useState<CommentItem[]>(() => initialComments ?? []);
  const [commentText, setCommentText] = useState("");
  const [commentCount, setCommentCount] = useState(() =>
    initialCount || initialComments?.length || 0
  );
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const canSubmit = Boolean(user && blogPostId && commentText.trim());

  const {
    data: commentsResponse,
    isLoading,
    isFetching,
  } = useGetCommentsQuery(
    blogPostId || "",
    { threaded: true },
    { enabled: Boolean(blogPostId) }
  );

  const { mutateAsync: createComment, isPending: isSubmitting } =
    useCreateCommentMutation();
  const [replySubmittingId, setReplySubmittingId] = useState<string | null>(null);

  useEffect(() => {
    if (commentsResponse?.data) {
      const mapped = mapComments(commentsResponse.data);
      setComments(mapped);
      setCommentCount(
        commentsResponse.meta?.total_items ?? mapped.length ?? initialCount
      );
      return;
    }

    if (initialComments?.length) {
      setComments(initialComments);
      setCommentCount(initialCount || initialComments.length);
    } else {
      setComments([]);
      setCommentCount(initialCount || 0);
    }
  }, [commentsResponse, initialComments, initialCount]);

  // Scroll to and highlight comment when highlightCommentId is provided
  useEffect(() => {
    if (!highlightCommentId) return;

    const scrollToComment = () => {
      const commentElement = document.querySelector(
        `[data-comment-id="${highlightCommentId}"]`
      );
      
      if (commentElement) {
        // Scroll to comment with offset for header
        const elementTop = commentElement.getBoundingClientRect().top;
        const offsetPosition = elementTop + window.pageYOffset - 100;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
        
        // Add highlight effect
        commentElement.classList.add('highlight-comment');
        setTimeout(() => {
          commentElement.classList.remove('highlight-comment');
        }, 2000);
      }
    };

    // Wait for comments to load and DOM to update
    if (comments.length > 0) {
      const timer = setTimeout(scrollToComment, 500);
      return () => clearTimeout(timer);
    } else if (!isLoading && !isFetching) {
      // If comments are loaded but empty, try once more after a delay
      const timer = setTimeout(scrollToComment, 1000);
      return () => clearTimeout(timer);
    }
  }, [highlightCommentId, comments, isLoading, isFetching]);

  const insertReplyIntoTree = (
    nodes: CommentItem[],
    parentId: string,
    reply: CommentItem
  ): CommentItem[] =>
    nodes.map((node) => {
      if (node.id === parentId) {
        return {
          ...node,
          replies: [reply, ...(node.replies ?? [])],
        };
      }
      if (node.replies?.length) {
        return {
          ...node,
          replies: insertReplyIntoTree(node.replies, parentId, reply),
        };
      }
      return node;
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!user) {
      toast.error("Bạn cần đăng nhập để bình luận");
      return;
    }
    if (!blogPostId) {
      toast.error("Không xác định được bài viết để bình luận");
      return;
    }

    try {
      const newComment = await createComment({
        postId: blogPostId,
        payload: {
          content: commentText.trim(),
        },
      });
      const mapped = mapCommentFromEntity(newComment);
      setComments((prev) => [mapped, ...prev]);
      setCommentCount((prev) => prev + 1);
      setCommentText("");
      onCommentSubmit?.(mapped);
      toast.success("Đăng bình luận thành công");
    } catch (error) {
      onMutateError(error);
    }
  };

  const handleReplySubmit = async (parentId: string) => {
    if (!replyText.trim()) return;
    if (!user) {
      toast.error("Bạn cần đăng nhập để phản hồi");
      return;
    }
    if (!blogPostId) {
      toast.error("Không xác định được bài viết để phản hồi");
      return;
    }

    try {
      setReplySubmittingId(parentId);
      const newComment = await createComment({
        postId: blogPostId,
        payload: {
          content: replyText.trim(),
          parent_id: parentId,
        },
      });
      const mapped = mapCommentFromEntity(newComment);
      setComments((prev) => insertReplyIntoTree(prev, parentId, mapped));
      setCommentCount((prev) => prev + 1);
      setReplyText("");
      setActiveReplyId(null);
      toast.success("Đăng phản hồi thành công");
    } catch (error) {
      onMutateError(error);
    } finally {
      setReplySubmittingId(null);
    }
  };

  const handleLike = (id: string) => {
    const toggleLike = (items: CommentItem[]): CommentItem[] =>
      items.map((comment) => {
        if (comment.id === id) {
          const nextLiked = !comment.liked;
          return {
            ...comment,
            liked: nextLiked,
            countLike: nextLiked
              ? comment.countLike + 1
              : Math.max(comment.countLike - 1, 0),
          };
        }

        if (comment.replies?.length) {
          return {
            ...comment,
            replies: toggleLike(comment.replies),
          };
        }

        return comment;
      });

    setComments((prev) => toggleLike(prev));
  };

  const handleReplyClick = (commentId: string) => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để phản hồi");
      return;
    }
    setActiveReplyId((prev) => (prev === commentId ? null : commentId));
    setReplyText("");
  };

  const renderComment = (comment: CommentItem, level = 0) => {
    const isReplyFormVisible = activeReplyId === comment.id;
    const childReplies = comment.replies ?? [];
    const hasReplies = childReplies.length > 0;

    const isHighlighted = highlightCommentId === comment.id;

    return (
      <div
        key={comment.id}
        data-comment-id={comment.id}
        className={cn(
          "border-b border-border pb-6 last:border-0 last:pb-0 transition-all duration-300",
          isHighlighted && "bg-primary/5 rounded-lg p-4 -m-4 mb-2"
        )}
        style={{
          marginLeft: level ? level * 24 : 0,
        }}
      >
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0 overflow-hidden">
            {comment.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={comment.avatar}
                alt={comment.author}
                className="w-full h-full object-cover"
              />
            ) : (
              comment.author?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="font-semibold text-foreground">{comment.author}</p>
              <span className="text-sm text-muted-foreground">
                • {formatTime(comment.createdAt)}
              </span>
            </div>
            <p className="text-foreground mb-3 leading-relaxed">
              {comment.content}
            </p>

            <div className="flex items-center gap-4 mb-3">
              <button
                type="button"
                onClick={() => handleLike(comment.id)}
                className={cn(
                  "flex items-center gap-1 text-sm transition-colors",
                  comment.liked
                    ? "text-red-500"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <Heart
                  className={cn("w-4 h-4", comment.liked && "fill-red-500")}
                />
                <span>
                  {comment.countLike > 0
                    ? `${comment.countLike} Thích`
                    : "Thích"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleReplyClick(comment.id)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isReplyFormVisible ? "Hủy" : "Trả lời"}
              </button>
            </div>

            {isReplyFormVisible && (
              <div className="mb-4">
                <textarea
                  placeholder="Nhập phản hồi của bạn..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full min-h-24 p-3 border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  disabled={replySubmittingId === comment.id}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => {
                      setActiveReplyId(null);
                      setReplyText("");
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    size="sm"
                    type="button"
                    disabled={!replyText.trim() || replySubmittingId === comment.id}
                    onClick={() => handleReplySubmit(comment.id)}
                  >
                    {replySubmittingId === comment.id ? "Đang gửi..." : "Phản hồi"}
                  </Button>
                </div>
              </div>
            )}

            {hasReplies && (
              <div className="mt-4 space-y-4">
                {childReplies.map((reply) => renderComment(reply, level + 1))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: vi,
      });
    } catch {
      return "Vừa xong";
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {showTitle && (
        <h3 className="text-2xl font-bold text-foreground">
          Thảo luận ({commentCount})
        </h3>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 space-y-3">
          <textarea
            placeholder={
              user
                ? "Tham gia thảo luận..."
                : "Đăng nhập để tham gia thảo luận..."
            }
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={!user || !blogPostId || isSubmitting}
            className="w-full min-h-32 p-4 border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:cursor-not-allowed disabled:opacity-70"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" disabled>
              Xem trước
            </Button>
            <Button
              size="sm"
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? "Đang gửi..." : "Gửi"}
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {isLoading || isFetching ? (
          <p className="text-center text-sm text-muted-foreground py-6">
            Đang tải bình luận...
          </p>
        ) : comments.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-6">
            Chưa có bình luận. Hãy là người đầu tiên!
          </p>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </div>
    </div>
  );
};