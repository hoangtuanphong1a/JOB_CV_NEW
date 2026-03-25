// components/ProfileHeader.tsx
import { UserProfile } from '../index';
import { Avatar,  AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Globe, Mail, Twitter, Facebook, Linkedin, Github } from 'lucide-react';

interface InfoProfileProps {
  profile: UserProfile;
  onEditClick?: () => void;
  isEditing?: boolean;
}

export function InfoProfile({ profile}: InfoProfileProps) {

  return (
    <Card className="overflow-hidden shadow-xl bg-white/95 backdrop-blur sticky top-20">
      {/* Gradient Header */}
      <div className="h-10  relative">
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
          <div className="relative">
            <Avatar className="size-20 ring-4 ring-white shadow-2xl">
              <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
        
            </Avatar>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-12 pb-6 px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-gray-900">{profile.full_name}</h2>
        </div>

        {profile.bio && (
          <p className="mt-4 text-gray-600 leading-relaxed italic">
            {profile.bio}
          </p>
        )}

        {/* Contact Info */}
        <div className="mt-6 space-y-3 text-left">
          {profile.show_email && (
            <a
              href={`mailto:${profile.show_email}`}
              className="flex items-center gap-3 text-gray-700 hover:text-purple-600 transition-colors"
            >
              <Mail className="size-4 text-purple-500" />
              <span className="text-sm font-medium truncate">{profile.show_email}</span>
            </a>
          )}

          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-700 hover:text-purple-600 transition-colors"
            >
              <Globe className="size-4 text-purple-500" />
              <span className="text-sm font-medium truncate">
                {profile.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </span>
            </a>
          )}
        </div>

        {/* Social Icons */}
        {(profile.twitter_url || profile.facebook_url || profile.linkedin_url || profile.github_url) && (
          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="flex justify-center gap-5">
              {profile.twitter_url && (
                <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#1DA1F2] transition">
                  <Twitter className="size-5" />
                </a>
              )}
              {profile.facebook_url && (
                <a href={profile.facebook_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#1877F2] transition">
                  <Facebook className="size-5" />
                </a>
              )}
              {profile.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#0A66C2] transition">
                  <Linkedin className="size-5" />
                </a>
              )}
              {profile.github_url && (
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition">
                  <Github className="size-5" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}