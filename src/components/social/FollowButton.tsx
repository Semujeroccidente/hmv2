'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, UserMinus, Users, MapPin, Star } from 'lucide-react';
import { toast } from 'sonner';

interface FollowButtonProps {
  userId: string;
  userName: string;
  userAvatar?: string;
  className?: string;
}

export function FollowButton({ userId, userName, userAvatar, className }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    fetchFollowStatus();
  }, [userId]);

  const fetchFollowStatus = async () => {
    try {
      const response = await fetch(`/api/social/follow?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);
        setFollowersCount(data.followersCount);
      }
    } catch (error) {
      console.error('Error fetching follow status:', error);
    }
  };

  const handleFollow = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/social/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: userId })
      });

      const data = await response.json();

      if (response.ok) {
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
        toast.success(`Ahora sigues a ${userName}`);
      } else {
        toast.error(data.error || 'Error al seguir usuario');
      }
    } catch (error) {
      toast.error('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/social/follow?followingId=${userId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        setIsFollowing(false);
        setFollowersCount(prev => prev - 1);
        toast.success(`Dejaste de seguir a ${userName}`);
      } else {
        toast.error(data.error || 'Error al dejar de seguir');
      }
    } catch (error) {
      toast.error('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        onClick={isFollowing ? handleUnfollow : handleFollow}
        disabled={isLoading}
        variant={isFollowing ? "outline" : "default"}
        size="sm"
      >
        {isLoading ? (
          "Procesando..."
        ) : isFollowing ? (
          <>
            <UserMinus className="w-4 h-4 mr-2" />
            Siguiendo
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4 mr-2" />
            Seguir
          </>
        )}
      </Button>

      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Users className="w-4 h-4" />
        <span>{followersCount}</span>
      </div>
    </div>
  );
}

interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    rating: number;
    salesCount: number;
    createdAt: string;
  };
  showFollowButton?: boolean;
  compact?: boolean;
}

export function UserCard({ user, showFollowButton = true, compact = false }: UserCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-HN', {
      month: 'short',
      year: 'numeric'
    });
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{user.name}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{user.rating.toFixed(1)}</span>
              </div>
              <span>•</span>
              <span>{user.salesCount} ventas</span>
            </div>
          </div>
        </div>
        {showFollowButton && (
          <FollowButton
            userId={user.id}
            userName={user.name}
            userAvatar={user.avatar}
          />
        )}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-lg">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              {showFollowButton && (
                <FollowButton
                  userId={user.id}
                  userName={user.name}
                  userAvatar={user.avatar}
                />
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{user.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">rating</span>
              </div>

              <div className="flex items-center gap-1">
                <span className="font-medium">{user.salesCount}</span>
                <span className="text-muted-foreground">ventas</span>
              </div>

              <div className="flex items-center gap-1 text-muted-foreground">
                <span>Miembro desde {formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface FollowersListProps {
  userId: string;
  type: 'followers' | 'following';
}

export function FollowersList({ userId, type }: FollowersListProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [userId, type]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/social/follow?userId=${userId}&type=${type}`);
      if (response.ok) {
        const data = await response.json();
        const usersList = type === 'followers' ? data.followers : data.following;
        setUsers(Array.isArray(usersList) ? usersList : []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="h-10 w-10 bg-muted rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>
            {type === 'followers'
              ? 'Este usuario no tiene seguidores aún'
              : 'Este usuario no sigue a nadie aún'
            }
          </p>
        </div>
      ) : (
        users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            compact={true}
            showFollowButton={type === 'followers'}
          />
        ))
      )}
    </div>
  );
}