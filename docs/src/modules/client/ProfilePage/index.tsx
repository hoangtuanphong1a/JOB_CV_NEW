"use client";

import { useEffect, useState } from 'react';
import { ProfileForm } from './components/ProfileForm';
import { InfoProfile } from './components/InfoProfile';
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useUploadAvatarMutation,
  PrivateProfileResponse,
} from '@/apis/client/user';
import { useUserStore } from '@/stores';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export interface UserProfile {
  username: string;
  full_name: string;
  bio: string;
  show_email: string ;
  website: string;
  twitter_url: string;
  facebook_url: string;
  linkedin_url: string;
  github_url: string;
  avatar_url: string;
}



export default function ProfilePage() {
  const { user, setUser } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Fetch profile data
  const { data: profileData, isLoading, refetch } = useGetMyProfileQuery();

  // Update profile mutation
  const updateProfileMutation = useUpdateMyProfileMutation({
    onSuccess: (data) => {
      if (data.avatar_url && user) {
        setUser({
          ...user,
          avatar_url: data.avatar_url,
        });
      }
      setProfile(convertToUserProfile(data));
      setIsEditing(false);
      refetch();
      toast.success('Cập nhật hồ sơ thành công!');
    },
    onError: (error: Error & { response?: { data?: { detail?: string } } }) => {
      toast.error(error?.response?.data?.detail || 'Có lỗi xảy ra khi cập nhật hồ sơ');
    },
  });

  // Upload avatar mutation
  const uploadAvatarMutation = useUploadAvatarMutation({
    onSuccess: (data) => {
      // Update userStore with new avatar
      if (data.avatar_url && user) {
        setUser({
          ...user,
          avatar_url: data.avatar_url,
        });
      }
      refetch();
      toast.success('Cập nhật avatar thành công!');
    },
    onError: (error: Error & { response?: { data?: { detail?: string } } }) => {
      toast.error(error?.response?.data?.detail || 'Có lỗi xảy ra khi upload avatar');
    },
  });

  // Convert PrivateProfileResponse to UserProfile
  const convertToUserProfile = (data: PrivateProfileResponse): UserProfile => {
    return {
      username: data.username || '',
      full_name: data.full_name || '',
      bio: data.bio || '',
      show_email: data.show_email ? data.email : '',
      website: data.website || '',
      twitter_url: data.twitter_url || '',
      facebook_url: data.facebook_url || '',
      linkedin_url: data.linkedin_url || '',
      github_url: data.github_url || '',
      avatar_url: data.avatar_url ||   "https://github.com/shadcn.png"
    };
  };

  // Update profile when data is fetched
  useEffect(() => {
    if (profileData) {
      setProfile(convertToUserProfile(profileData));
    }
  }, [profileData]);

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    updateProfileMutation.mutate({
      username: updatedProfile.username,
      full_name: updatedProfile.full_name,
      bio: updatedProfile.bio || undefined,
      show_email:  updatedProfile.show_email,
      website: updatedProfile.website || undefined,
      twitter_url: updatedProfile.twitter_url || undefined,
      facebook_url: updatedProfile.facebook_url || undefined,
      linkedin_url: updatedProfile.linkedin_url || undefined,
      github_url: updatedProfile.github_url || undefined,
    });
  };  

  const handleUploadAvatar = (file: File) => {
    uploadAvatarMutation.mutate(file);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Không thể tải thông tin hồ sơ</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <InfoProfile 
              profile={profile}
              onEditClick={() => setIsEditing(!isEditing)}
              isEditing={isEditing}
            />
          </div>

          {/* Right Content - Profile Form */}
          <div className="lg:col-span-2">
            <ProfileForm
              profile={profile}
              onSave={handleSaveProfile}
              onCancel={() => setIsEditing(false)}
              onUploadAvatar={handleUploadAvatar}
              isLoading={updateProfileMutation.isPending || uploadAvatarMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
