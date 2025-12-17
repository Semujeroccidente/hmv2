'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Messaging } from '@/components/social/Messaging';
import { SellerProfile } from '@/components/social/SellerProfile';
import { FollowButton, FollowersList, UserCard } from '@/components/social/FollowButton';
import { SocialShare } from '@/components/social/SocialShare';
import {
  Users,
  MessageCircle,
  Share2,
  Search,
  TrendingUp,
  Star,
  Package,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function SocialPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('demo-user-id');

  // Demo data for illustration
  const demoUsers = [
    {
      id: 'user-1',
      name: 'María González',
      email: 'maria@example.com',
      avatar: '/avatars/maria.jpg',
      rating: 4.8,
      salesCount: 156,
      createdAt: '2023-01-15'
    },
    {
      id: 'user-2',
      name: 'Carlos Rodríguez',
      email: 'carlos@example.com',
      avatar: '/avatars/carlos.jpg',
      rating: 4.9,
      salesCount: 234,
      createdAt: '2022-11-20'
    },
    {
      id: 'user-3',
      name: 'Ana Martínez',
      email: 'ana@example.com',
      avatar: '/avatars/ana.jpg',
      rating: 4.7,
      salesCount: 89,
      createdAt: '2023-03-10'
    }
  ];

  const demoProduct = {
    id: 'product-1',
    title: 'iPhone 13 Pro Max - Excelente Estado',
    description: 'Vendo iPhone 13 Pro Max de 256GB, color grafito, en excelente estado. Sin rayas, funciona perfectamente.',
    price: 25000,
    slug: 'iphone-13-pro-max'
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al inicio
      </Link>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Funciones Sociales</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Conecta con otros vendedores y compradores, comparte productos y construye tu reputación en HonduMarket
        </p>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <h3 className="font-semibold mb-2">Sistema de Seguidores</h3>
            <p className="text-sm text-muted-foreground">
              Sigue a tus vendedores favoritos y mantente al día con sus nuevos productos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Share2 className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <h3 className="font-semibold mb-2">Compartir en Redes</h3>
            <p className="text-sm text-muted-foreground">
              Comparte productos fácilmente en Facebook, Twitter, WhatsApp y más
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-purple-500" />
            <h3 className="font-semibold mb-2">Mensajes Internos</h3>
            <p className="text-sm text-muted-foreground">
              Comunícate directamente con vendedores y compradores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Star className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
            <h3 className="font-semibold mb-2">Perfiles Públicos</h3>
            <p className="text-sm text-muted-foreground">
              Perfiles de vendedores con estadísticas y reseñas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Demo */}
      <Tabs defaultValue="followers" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="followers">Seguidores</TabsTrigger>
          <TabsTrigger value="profile">Perfil Vendedor</TabsTrigger>
          <TabsTrigger value="messaging">Mensajes</TabsTrigger>
          <TabsTrigger value="sharing">Compartir</TabsTrigger>
        </TabsList>

        <TabsContent value="followers" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Sistema de Seguidores</h2>
              <p className="text-muted-foreground mb-6">
                Conecta con otros usuarios y mantente actualizado con sus actividades.
              </p>

              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar usuarios..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="space-y-3">
                  {demoUsers
                    .filter(user =>
                      user.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((user) => (
                      <UserCard
                        key={user.id}
                        user={user}
                        showFollowButton={true}
                        compact={true}
                      />
                    ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Estadísticas de Seguimiento</h3>
              <FollowersList userId={selectedUserId} type="followers" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="mt-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Perfil Público de Vendedor</h2>
            <p className="text-muted-foreground mb-6">
              Los perfiles públicos muestran la información completa del vendedor incluyendo sus productos, reseñas y estadísticas.
            </p>

            <SellerProfile userId={selectedUserId} />
          </div>
        </TabsContent>

        <TabsContent value="messaging" className="mt-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Sistema de Mensajes</h2>
            <p className="text-muted-foreground mb-6">
              Chatea directamente con vendedores y compradores para resolver dudas, negociar precios y coordinar entregas.
            </p>

            <Messaging />
          </div>
        </TabsContent>

        <TabsContent value="sharing" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Compartir Productos</h2>
              <p className="text-muted-foreground mb-6">
                Comparte productos en tus redes sociales para ayudar a los vendedores a llegar a más clientes.
              </p>

              <Card>
                <CardContent className="p-6">
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <Package className="w-16 h-16 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">{demoProduct.title}</h3>
                  <p className="text-2xl font-bold text-primary mb-4">
                    L {demoProduct.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    {demoProduct.description}
                  </p>

                  <SocialShare product={demoProduct} />
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Opciones de Compartido</h3>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">📘 Facebook</h4>
                    <p className="text-sm text-muted-foreground">
                      Comparte directamente en tu muro de Facebook para que tus amigos vean el producto.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">🐦 Twitter</h4>
                    <p className="text-sm text-muted-foreground">
                      Publica en Twitter con un mensaje predefinido que incluye el producto y precio.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">💬 WhatsApp</h4>
                    <p className="text-sm text-muted-foreground">
                      Envía el producto directamente a contactos o grupos de WhatsApp.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">📧 Email</h4>
                    <p className="text-sm text-muted-foreground">
                      Envía el producto por correo electrónico a amigos o familiares.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Únete a la Comunidad HonduMarket</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Conecta con miles de compradores y vendedores en Honduras. Construye tu reputación,
            comparte productos y crece tu negocio con nuestras herramientas sociales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Users className="w-4 h-4 mr-2" />
              Crear Cuenta
            </Button>
            <Button size="lg" variant="outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contactar Soporte
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}