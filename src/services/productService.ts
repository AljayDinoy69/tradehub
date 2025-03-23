
import { Product, Comment } from '../types';

// Mock products data
let mockProducts: Product[] = [
  {
    id: '1',
    title: 'Vintage Camera',
    description: 'A beautiful vintage camera in perfect working condition. Great for collectors or photography enthusiasts.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
    category: 'Electronics',
    sellerId: '2',
    sellerName: 'Regular User',
    sellerAvatar: 'https://ui-avatars.com/api/?name=Regular+User&background=0EA5E9&color=fff',
    createdAt: '2023-11-15T10:30:00Z',
    likes: 12,
    comments: [
      {
        id: 'c1',
        userId: '1',
        userName: 'Admin User',
        userAvatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
        content: 'Is this still available?',
        createdAt: '2023-11-16T14:20:00Z'
      }
    ]
  },
  {
    id: '2',
    title: 'Leather Messenger Bag',
    description: 'Handcrafted genuine leather messenger bag with plenty of compartments and an adjustable strap.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1622560480605-d83c661consumables?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGVhdGhlciUyMGJhZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    category: 'Fashion',
    sellerId: '1',
    sellerName: 'Admin User',
    sellerAvatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
    createdAt: '2023-11-12T09:45:00Z',
    likes: 8,
    comments: []
  },
  {
    id: '3',
    title: 'Mountain Bike',
    description: 'High-performance mountain bike with 27-speed Shimano gears and hydraulic disc brakes. Perfect for trails!',
    price: 799.99,
    image: 'https://images.unsplash.com/photo-1505158498176-0150297fbd7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bW91bnRhaW4lMjBiaWtlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    category: 'Sports',
    sellerId: '2',
    sellerName: 'Regular User',
    sellerAvatar: 'https://ui-avatars.com/api/?name=Regular+User&background=0EA5E9&color=fff',
    createdAt: '2023-11-10T16:20:00Z',
    likes: 15,
    comments: [
      {
        id: 'c2',
        userId: '1',
        userName: 'Admin User',
        userAvatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
        content: 'Would you ship this internationally?',
        createdAt: '2023-11-11T11:35:00Z'
      },
      {
        id: 'c3',
        userId: '2',
        userName: 'Regular User',
        userAvatar: 'https://ui-avatars.com/api/?name=Regular+User&background=0EA5E9&color=fff',
        content: 'Yes, shipping available worldwide for an additional fee.',
        createdAt: '2023-11-11T15:40:00Z'
      }
    ]
  }
];

// Get all products
export const getAllProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockProducts]);
    }, 500);
  });
};

// Get product by ID
export const getProductById = (id: string): Promise<Product | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = mockProducts.find(p => p.id === id) || null;
      resolve(product ? {...product} : null);
    }, 500);
  });
};

// Create a new product
export const createProduct = (product: Omit<Product, 'id' | 'createdAt' | 'likes' | 'comments'>): Promise<Product> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProduct: Product = {
        ...product,
        id: `${mockProducts.length + 1}`,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: []
      };
      
      mockProducts = [...mockProducts, newProduct];
      resolve({...newProduct});
    }, 500);
  });
};

// Update a product
export const updateProduct = (id: string, updates: Partial<Product>): Promise<Product | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockProducts.findIndex(p => p.id === id);
      
      if (index !== -1) {
        const updatedProduct = {
          ...mockProducts[index],
          ...updates,
        };
        
        mockProducts = [
          ...mockProducts.slice(0, index),
          updatedProduct,
          ...mockProducts.slice(index + 1)
        ];
        
        resolve({...updatedProduct});
      } else {
        resolve(null);
      }
    }, 500);
  });
};

// Delete a product
export const deleteProduct = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const initialLength = mockProducts.length;
      mockProducts = mockProducts.filter(p => p.id !== id);
      resolve(mockProducts.length < initialLength);
    }, 500);
  });
};

// Add a comment to a product
export const addComment = (productId: string, comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockProducts.findIndex(p => p.id === productId);
      
      if (index !== -1) {
        const newComment: Comment = {
          ...comment,
          id: `c${Date.now()}`,
          createdAt: new Date().toISOString()
        };
        
        mockProducts[index].comments = [...mockProducts[index].comments, newComment];
        resolve({...newComment});
      } else {
        resolve(null);
      }
    }, 500);
  });
};

// Toggle like on a product
export const toggleLike = (productId: string): Promise<Product | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockProducts.findIndex(p => p.id === productId);
      
      if (index !== -1) {
        const product = mockProducts[index];
        const updatedProduct = {
          ...product,
          likes: product.likes + 1
        };
        
        mockProducts = [
          ...mockProducts.slice(0, index),
          updatedProduct,
          ...mockProducts.slice(index + 1)
        ];
        
        resolve({...updatedProduct});
      } else {
        resolve(null);
      }
    }, 500);
  });
};
