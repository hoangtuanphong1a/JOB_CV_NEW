// components/ProfileForm.tsx
import { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../index';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Camera, Save, X, Mail, Globe, Twitter, Facebook, Linkedin, Github, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileFormProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onCancel: () => void;
  onUploadAvatar?: (file: File) => void;
  isLoading?: boolean;
}

export function ProfileForm({ profile, onSave, onCancel, onUploadAvatar, isLoading = false }: ProfileFormProps) {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar_url);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socialFields: Array<{
    icon: typeof Twitter;
    key: keyof UserProfile;
    placeholder: string;
  }> = [
    { icon: Twitter, key: 'twitter_url', placeholder: 'https://twitter.com/...' },
    { icon: Facebook, key: 'facebook_url', placeholder: 'https://facebook.com/...' },
    { icon: Linkedin, key: 'linkedin_url', placeholder: 'https://linkedin.com/in/...' },
    { icon: Github, key: 'github_url', placeholder: 'https://github.com/...' },
  ];

  // Update form data when profile changes
  useEffect(() => {
    setFormData(profile);
    setAvatarPreview(profile.avatar_url);
  }, [profile]);

  const handleChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước file không được vượt quá 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Chỉ chấp nhận file ảnh');
        return;
      }

      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
      };
      reader.readAsDataURL(file);

      // Upload avatar immediately
      if (onUploadAvatar) {
        onUploadAvatar(file);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleCancel = () => {
    setFormData(profile);
    setAvatarPreview(profile.avatar_url);
    onCancel();
  };


  return (
    <Card className="border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Chỉnh sửa hồ sơ</CardTitle>
        <CardDescription>Cập nhật thông tin cá nhân và liên kết mạng xã hội</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Avatar className="size-24 ring-4 ring-purple-100">
                <AvatarImage src={avatarPreview} />
                
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Camera className="size-5" />
                )}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Ảnh đại diện</h3>
              <p className="text-sm text-gray-500">JPG, PNG. Tối đa 5MB</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Họ và tên</Label>
              <Input value={formData.full_name} onChange={e => handleChange('full_name', e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Giới thiệu bản thân</Label>
            <Textarea
              value={formData.bio || ''}
              onChange={e => handleChange('bio', e.target.value)}
              rows={4}
              placeholder="Viết một chút về bạn..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Mail className="size-4" /> Email công khai</Label>
              <Input type="email" value={formData.show_email || ''} onChange={e => handleChange('show_email', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Globe className="size-4" /> Website</Label>
              <Input type="url" value={formData.website || ''} onChange={e => handleChange('website', e.target.value)} />
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t">
            <h3 className="font-semibold text-lg">Mạng xã hội</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {socialFields.map(({ icon: Icon, key, placeholder }) => (
                <div key={key} className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm">
                    <Icon className="size-4" /> {key.replace('_url', '').charAt(0).toUpperCase() + key.replace('_url', '').slice(1)}
                  </Label>
                  <Input
                    type="url"
                    value={formData[key] || ''}
                    onChange={e => handleChange(key, e.target.value)}
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
              <X className="size-4 mr-2" /> Hủy
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" /> Đang lưu...
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" /> Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}