'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { X, Hash } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { CoverImageUpload } from '@/components/common/CoverImageUpload';
import { MarkdownEditor } from '@/components/common/MarkdownEditor';
import { useUpdatePostMutation } from '@/apis/client/blog/queries';
import { IPost, IPostUpdateRequest } from '@/apis/client/blog/types';
import { PostFormData, updatePostSchema } from '@/lib/validations/post';

interface UpdatePostDialogProps {
  post: IPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function UpdatePostDialog({ post, open, onOpenChange, onSuccess }: UpdatePostDialogProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const updateMutation = useUpdatePostMutation({
    onSuccess: () => {
      toast.success('Cập nhật bài viết thành công!');
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật');
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      body: '',
      tags: [],
      published: false,
      image: null,
    },
  });

  const currentTags = watch('tags') || [];
  const coverImage = watch('image');
  const body = watch('body') || '';

  useEffect(() => {
    if (post && open) {
      reset({
        title: post.title,
        excerpt: post.excerpt,
        body: post.content_md || '',
        tags: post.tags || [],
        published: post.status === 'published',
        image: null,
      });
      setTags(post.tags || []);
    }
  }, [post, open, reset]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = tagInput.trim();
      if (value && !currentTags.includes(value) && currentTags.length < 5) {
        const newTags = [...currentTags, value];
        setValue('tags', newTags);
        setTags(newTags);
        setTagInput('');
      }
    }
  };

  const removeTag = (index: number) => {
    const newTags = currentTags.filter((_, i) => i !== index);
    setValue('tags', newTags);
    setTags(newTags);
  };

  const onSubmit = async (data: PostFormData) => {
    if (!post) return;

    const updateData: IPostUpdateRequest = {
      Id: post.id,
      title: data.title,
      body: data.body,
      excerpt: data.excerpt,
      published: data.published,
      tags: data.tags,
      image: data.image ?? new File([], ''), 
      Image: post.image_url || '',
      IImage: data.image ?? undefined,
    };

    updateMutation.mutate(updateData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật bài viết</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">Tiêu đề *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Nhập tiêu đề bài viết"
              className="mt-1"
            />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
          </div>

          {/* Excerpt */}
          <div>
            <Label htmlFor="excerpt">Tóm tắt *</Label>
            <Textarea
              id="excerpt"
              {...register('excerpt')}
              placeholder="Nhập tóm tắt bài viết"
              className="mt-1"
              rows={3}
            />
            {errors.excerpt && <p className="text-sm text-red-600 mt-1">{errors.excerpt.message}</p>}
          </div>

          {/* Body */}
          <div>
            <Label htmlFor="body">Nội dung *</Label>
            <div className="mt-1 min-h-[300px] border rounded-lg">
              <MarkdownEditor
                value={body}
                onChange={(value) => setValue('body', value)}
                placeholder="Viết nội dung bài viết..."
              />
            </div>
            {errors.body && <p className="text-sm text-red-600 mt-1">{errors.body.message}</p>}
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags (tối đa 5)</Label>
            <div className="mt-1">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Nhập tag và nhấn Enter"
                className="mb-2"
              />
              <div className="flex flex-wrap gap-2">
                {currentTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            {errors.tags && <p className="text-sm text-red-600 mt-1">{errors.tags.message}</p>}
          </div>

          {/* Image */}
          <div>
            <Label>Ảnh bìa</Label>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <div className="mt-1 w-full">
                  {post && post.image_url && !coverImage && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Ảnh hiện tại:</p>
                      <img
                        src={post.image_url}
                        alt="Current cover"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                  <CoverImageUpload
                    value={coverImage || null}
                    onChange={(file) => field.onChange(file || null)}
                    disabled={isSubmitting || updateMutation.isPending}
                  />
                </div>
              )}
            />
            {errors.image && <p className="text-sm text-red-600 mt-1">{errors.image.message}</p>}
          </div>

          {/* Published */}
          <div className="flex items-center gap-2">
            <Controller
              name="published"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <Label htmlFor="published">Xuất bản ngay</Label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting || updateMutation.isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting || updateMutation.isPending}>
              {updateMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

