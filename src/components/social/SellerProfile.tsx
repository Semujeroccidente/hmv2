'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FollowButton } from './FollowButton';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ReviewList } from '@/components/products/ReviewList';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Star, 
  Calendar, 
  Package, 
  MessageCircle,
  TrendingUp,
  Users
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface SellerProfileProps {
  userId: string;
}

interface ProfileData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  rating: number;
  salesCount: number;
  createdAt: string;
  address?: {
    city: string;
    state: string;
    country: string;
  };
  stats: {
    totalProducts: number;
    totalReviews: number;
    followersCount: number;
    followingCount: number;
    averageRating: number;
    ratingDistribution: number[];
  };
  recentProducts: any[];
  recentReviews: any[];
}

export function SellerProfile({ userId }: SellerProfileProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/social/profile?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-muted rounded-lg mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-muted rounded-lg"></div>
            <div className="h-96 bg-muted rounded-lg"></div>
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-muted rounded-lg"></div>
            <div className="h-64 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Perfil no encontrado</p>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getRatingPercentage = (stars: number) => {
    const total = profile.stats.ratingDistribution.reduce((a, b) => a + b, 0);
    if (total === 0) return 0;
    return (profile.stats.ratingDistribution[stars - 1] / total) * 100;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24 md:h-32 md:w-32">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback className="text-2xl md:text-3xl">
                {profile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{profile.name}</h1>
                  <p className="text-muted-foreground mb-4">
                    Miembro desde {formatDistanceToNow(new Date(profile.createdAt), { 
                      addSuffix: true, 
                      locale: es 
                    })}
                  </p>
                  
                  {profile.bio && (
                    <p className="text-sm mb-4 max-w-2xl">{profile.bio}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {profile.address?.city}, {profile.address?.state}
                      </span>
                    </div>
                    
                    {profile.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>{profile.email}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <FollowButton 
                    userId={profile.id} 
                    userName={profile.name} 
                    userAvatar={profile.avatar}
                  />
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Enviar mensaje
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-5 h-5 text-yellow-400 mr-1" />
              <span className="text-2xl font-bold">{profile.rating.toFixed(1)}</span>
            </div>
            <p className="text-sm text-muted-foreground">Rating</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="w-5 h-5 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{profile.stats.totalProducts}</div>
            <p className="text-sm text-muted-foreground">Productos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-5 h-5 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{profile.stats.followersCount}</div>
            <p className="text-sm text-muted-foreground">Seguidores</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{profile.salesCount}</div>
            <p className="text-sm text-muted-foreground">Ventas</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products">Productos</TabsTrigger>
              <TabsTrigger value="reviews">Reseñas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products" className="mt-6">
              {profile.recentProducts.length > 0 ? (
                <ProductGrid products={profile.recentProducts} />
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground">No hay productos activos</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              {profile.recentReviews.length > 0 ? (
                <ReviewList reviews={profile.recentReviews} />
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground">No hay reseñas aún</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Rating Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Distribución de Rating</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm">{stars}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${getRatingPercentage(stars)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground w-8 text-right">
                    {profile.stats.ratingDistribution[stars - 1]}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Reseñas</span>
                <span className="font-medium">{profile.stats.totalReviews}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Siguiendo</span>
                <span className="font-medium">{profile.stats.followingCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ventas Totales</span>
                <span className="font-medium">{profile.salesCount}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}