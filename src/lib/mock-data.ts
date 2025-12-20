
export const MOCK_USERS = [];

export const MOCK_CATEGORIES = [];

export const MOCK_PRODUCTS = [];

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
    conversations: [],
    messages: []
};

