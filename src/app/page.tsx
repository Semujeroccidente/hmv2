import { Header } from '@/components/marketplace/header'
import { ProductCard } from '@/components/marketplace/product-card'
import { AuctionCard, Auction } from '@/components/marketplace/auction-card'
import { CategoryGrid } from '@/components/marketplace/category-menu'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Star,
  TrendingUp,
  Users,
  ShoppingBag,
  ArrowRight,
  Zap,
  Shield,
  Gavel
} from 'lucide-react'
import { prisma } from '@/lib/prisma'

// Mock Data for Auctions (since it wasn't in mock-data.ts)
const SAMPLE_AUCTIONS: Auction[] = [
  {
    id: '1',
    title: 'MacBook Pro M1 2020',
    startingPrice: 15000,
    currentPrice: 18500,
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
    status: 'ACTIVE',
    bidCount: 12,
    seller: {
      name: 'TechStore HN',
      rating: 4.9
    },
    product: {
      id: '1',
      title: 'MacBook Pro M1 2020',
      condition: 'USED',
      thumbnail: '/placeholder-product.svg'
    }
  },
  {
    id: '2',
    title: 'PlayStation 5 + 2 Controles',
    startingPrice: 8000,
    currentPrice: 9200,
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
    status: 'ACTIVE',
    bidCount: 8,
    seller: {
      name: 'GamerZone',
      rating: 4.8
    },
    product: {
      id: '2',
      title: 'PlayStation 5 + 2 Controles',
      condition: 'NEW',
      thumbnail: '/placeholder-product.svg'
    }
  }
]

export default async function Home() {
  // Server Component Logic - Data Fetching
  const [productsData, categoriesList] = await Promise.all([
    prisma.product.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: {
        seller: {
          select: {
            name: true,
            rating: true
          }
        },
        category: {
          select: {
            name: true
          }
        }
      }
    }),
    prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          take: 5,
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: { products: true }
        }
      },
      take: 8
    })
  ])

  // Map Prisma products to ProductCard interface if needed
  const products = productsData.map(p => ({
    ...p,
    originalPrice: p.originalPrice || undefined,
    images: p.images || undefined,
    thumbnail: p.thumbnail || undefined,
    createdAt: p.createdAt.toISOString(),
    category: p.category.name // ProductCard expects string or {name: string}, keeping simple
  }))

  const auctions = SAMPLE_AUCTIONS

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-700 text-white py-24 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl mix-blend-overlay"></div>
            <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-purple-400 blur-3xl mix-blend-overlay"></div>
            <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-blue-400 blur-3xl mix-blend-overlay"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in zoom-in duration-700 slide-in-from-bottom-4">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-sm">
                  Bienvenido a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">HonduMarket</span>
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
                  El marketplace más grande de Honduras. Compra, vende y participa en subastas de forma segura y rápida.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 justify-center pt-4">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 font-bold">
                  <ShoppingBag className="mr-2 h-6 w-6" />
                  Comprar ahora
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white/80 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full hover:border-white transition-all font-semibold backdrop-blur-sm">
                  <Gavel className="mr-2 h-6 w-6" />
                  Ver subastas
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Estadísticas */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">10,000+</div>
                <div className="text-gray-600">Usuarios activos</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <ShoppingBag className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">5,000+</div>
                <div className="text-gray-600">Productos</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Gavel className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-gray-600">Subastas activas</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900">4.8</div>
                <div className="text-gray-600">Calificación promedio</div>
              </div>
            </div>
          </div>
        </section>

        {/* Categorías */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Explorar categorías</h2>
            <CategoryGrid categories={categoriesList} />
          </div>
        </section>

        {/* Productos y Subastas */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="products">Productos destacados</TabsTrigger>
                <TabsTrigger value="auctions">Subastas activas</TabsTrigger>
              </TabsList>

              <TabsContent value="products">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="auctions">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {auctions.map((auction) => (
                    <AuctionCard key={auction.id} auction={auction} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">¿Por qué elegir HonduMarket?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Shield className="h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle>Compras seguras</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Protección en todas tus transacciones con nuestro sistema de escrow y verificación de usuarios.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Zap className="h-12 w-12 text-green-600 mb-4" />
                  <CardTitle>Subastas emocionantes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Participa en subastas en tiempo real y consigue los mejores precios del mercado.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUp className="h-12 w-12 text-purple-600 mb-4" />
                  <CardTitle>Crece tu negocio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Llega a miles de clientes en todo Honduras y expande tu mercado.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para empezar a comprar y vender?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Únete a miles de hondureños que ya confían en HonduMarket
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Registrarse gratis
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <ArrowRight className="mr-2 h-5 w-5" />
                Explorar productos
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div >
  )
}