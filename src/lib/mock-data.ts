
export const MOCK_USERS = [
    {
        id: 'user-id-demo',
        name: 'Usuario Demo',
        email: 'demo@hondumarket.com',
        role: 'USER',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        rating: 4.8,
        salesCount: 15,
        createdAt: new Date().toISOString()
    }
];

export const MOCK_CATEGORIES = [
    { id: '1', name: 'Electrónica', icon: '📱' },
    { id: '2', name: 'Ropa y Accesorios', icon: '👕' },
    { id: '3', name: 'Hogar y Jardín', icon: '🏠' },
    { id: '4', name: 'Vehículos', icon: '🚗' },
    { id: '5', name: 'Propiedades', icon: '🏢' },
    { id: '6', name: 'Servicios', icon: '💼' }
];

export const MOCK_PRODUCTS = [
    {
        id: '1',
        title: 'iPhone 13 Pro Max - Excelente Estado',
        description: 'iPhone 13 Pro Max en excelentes condiciones, batería al 90%. Incluye caja y accesorios originales.',
        price: 25000,
        originalPrice: 30000,
        condition: 'USED',
        stock: 1,
        categoryId: '1',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        images: JSON.stringify(['/placeholder-product.svg']),
        tags: JSON.stringify(['iphone', 'apple', 'celular']),
        slug: 'iphone-13-pro-max',
        sellerId: 'user-id-demo',
        seller: {
            id: 'seller-1',
            name: 'TechStore HN',
            rating: 4.8
        },
        category: {
            id: '1',
            name: 'Electrónica'
        },
        _count: {
            reviews: 5,
            favorites: 12
        },
        views: 125,
        favoritesCount: 12
    },
    {
        id: '2',
        title: 'Laptop Dell Inspiron 15',
        description: 'Laptop potente para trabajo y estudio. Procesador Intel Core i5, 8GB RAM, 256GB SSD.',
        price: 18000,
        condition: 'NEW',
        stock: 5,
        categoryId: '1',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        images: JSON.stringify(['/placeholder-product.svg']),
        tags: JSON.stringify(['laptop', 'dell', 'computadora']),
        slug: 'laptop-dell-inspiron-15',
        sellerId: 'seller-2',
        seller: {
            id: 'seller-2',
            name: 'Computadoras de Honduras',
            rating: 4.9
        },
        category: {
            id: '1',
            name: 'Electrónica'
        },
        _count: {
            reviews: 2,
            favorites: 8
        },
        views: 45,
        favoritesCount: 8
    },
    {
        id: '3',
        title: 'Camiseta Selección de Honduras',
        description: 'Camiseta oficial de la selección, talla M. Nueva con etiquetas.',
        price: 1200,
        condition: 'NEW',
        stock: 20,
        categoryId: '2',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        images: JSON.stringify(['/placeholder-product.svg']),
        tags: JSON.stringify(['ropa', 'deportes', 'futbol']),
        slug: 'camiseta-seleccion-honduras',
        sellerId: 'seller-3',
        seller: {
            id: 'seller-3',
            name: 'Deportes HN',
            rating: 4.7
        },
        category: {
            id: '2',
            name: 'Ropa y Accesorios'
        },
        _count: {
            reviews: 10,
            favorites: 25
        },
        views: 320,
        favoritesCount: 25
    },
    {
        id: '4',
        title: 'Sofá de 3 Plazas - Cuero Genuino',
        description: 'Sofá cómodo y elegante para tu sala. Poco uso.',
        price: 12000,
        condition: 'REFURBISHED',
        stock: 1,
        categoryId: '3',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        images: JSON.stringify(['/placeholder-product.svg']),
        tags: JSON.stringify(['hogar', 'muebles', 'sala']),
        slug: 'sofa-3-plazas',
        sellerId: 'seller-4',
        seller: {
            id: 'seller-4',
            name: 'Muebles y Más',
            rating: 4.5
        },
        category: {
            id: '3',
            name: 'Hogar y Jardín'
        },
        _count: {
            reviews: 1,
            favorites: 5
        },
        views: 15,
        favoritesCount: 5
    }
];

// Simple in-memory storage for cart and session (resets on server restart)
// Mock Social Data
export const MOCK_CONVERSATIONS = [
    {
        id: 'conv-1',
        user: {
            id: 'user-1',
            name: 'María González',
            email: 'maria@example.com',
            avatar: '/avatars/maria.jpg'
        },
        lastMessage: {
            id: 'msg-1',
            content: 'Hola, ¿sigue disponible el iPhone?',
            senderId: 'user-1',
            receiverId: 'current-user',
            read: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
            sender: { id: 'user-1', name: 'María González', email: 'maria@example.com' },
            receiver: { id: 'current-user', name: 'Tú', email: 'demo@hondumarket.com' }
        },
        unreadCount: 1
    },
    {
        id: 'conv-2',
        user: {
            id: 'user-2',
            name: 'Carlos Rodríguez',
            email: 'carlos@example.com',
            avatar: '/avatars/carlos.jpg'
        },
        lastMessage: {
            id: 'msg-2',
            content: 'Te ofrezco 20,000 por la laptop',
            senderId: 'current-user',
            receiverId: 'user-2',
            read: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            sender: { id: 'current-user', name: 'Tú', email: 'demo@hondumarket.com' },
            receiver: { id: 'user-2', name: 'Carlos Rodríguez', email: 'carlos@example.com' }
        },
        unreadCount: 0
    }
];

export const MOCK_MESSAGES = [
    {
        id: 'msg-1',
        content: 'Hola, ¿sigue disponible el iPhone?',
        senderId: 'user-1',
        receiverId: 'current-user',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        sender: { id: 'user-1', name: 'María González', email: 'maria@example.com' },
        receiver: { id: 'current-user', name: 'Tú', email: 'demo@hondumarket.com' }
    },
    {
        id: 'msg-2',
        content: 'Te ofrezco 20,000 por la laptop',
        senderId: 'current-user',
        receiverId: 'user-2',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        sender: { id: 'current-user', name: 'Tú', email: 'demo@hondumarket.com' },
        receiver: { id: 'user-2', name: 'Carlos Rodríguez', email: 'carlos@example.com' }
    }
];

// Simple in-memory storage for cart and session (resets on server restart)
export const globalStore: any = {
    cart: {
        userId: 'user-id-demo',
        status: 'ACTIVE',
        items: [],
        total: 0,
        subtotal: 0,
        tax: 0,
        shipping: 0
    },
    conversations: [...MOCK_CONVERSATIONS],
    messages: [...MOCK_MESSAGES]
};
