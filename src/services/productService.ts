import { Product, Comment } from '../types';

// Mock product data (replace with actual data fetching later)
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Vintage Record Player',
    description: 'A classic record player in excellent condition. Perfect for vinyl enthusiasts.',
    price: 199.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1517156479542-24b085333911?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHZpbnRhZ2UlMjByZWNvcmQlMjBwbGF5ZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    sellerId: '1',
    sellerName: 'Admin User',
    sellerAvatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
    createdAt: '2023-08-01T10:00:00.000Z',
    likes: 5,
    comments: [
      {
        id: '1',
        userId: '2',
        userName: 'Regular User',
        userAvatar: 'https://ui-avatars.com/api/?name=Regular+User&background=0EA5E9&color=fff',
        content: 'I love this record player! It brings back so many memories.',
        createdAt: '2023-08-01T11:00:00.000Z'
      }
    ]
  },
  {
    id: '2',
    title: 'Handmade Leather Wallet',
    description: 'A beautifully crafted leather wallet, perfect for everyday use.',
    price: 49.99,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1542751371-adc38f48795e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bGVhdGhlciUyMHdhbGxldHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    sellerId: '2',
    sellerName: 'Regular User',
    sellerAvatar: 'https://ui-avatars.com/api/?name=Regular+User&background=0EA5E9&color=fff',
    createdAt: '2023-08-05T14:30:00.000Z',
    likes: 10,
    comments: []
  },
  {
    id: '3',
    title: 'Cozy Knitted Blanket',
    description: 'Stay warm and snug with this soft, hand-knitted blanket.',
    price: 79.99,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1532466968737-9298e5590c7c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG5pdHRlZCUyMGJsYW5rZXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    sellerId: '1',
    sellerName: 'Admin User',
    sellerAvatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
    createdAt: '2023-08-10T09:15:00.000Z',
    likes: 3,
    comments: []
  },
  {
    id: '4',
    title: 'Mountain Bike',
    description: 'Durable mountain bike for off-road adventures.',
    price: 349.00,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1544727769-981549c824b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bW91bnRhaW4lMjBiaWtlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    sellerId: '2',
    sellerName: 'Regular User',
    sellerAvatar: 'https://ui-avatars.com/api/?name=Regular+User&background=0EA5E9&color=fff',
    createdAt: '2023-08-15T16:45:00.000Z',
    likes: 7,
    comments: []
  },
  {
    id: '5',
    title: 'Educational Toy Set',
    description: 'A set of educational toys to stimulate your child\'s mind.',
    price: 29.99,
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1585439495414-3393b5519491?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGVkdWNhdGlvbmFsJTIwdG95fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    sellerId: '1',
    sellerName: 'Admin User',
    sellerAvatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
    createdAt: '2023-08-20T11:30:00.000Z',
    likes: 2,
    comments: []
  }
];

// Helper function to save products to localStorage
const saveProductsToLocalStorage = (products) => {
  localStorage.setItem('tradehub-products', JSON.stringify(products));
};

// Helper function to get products from localStorage
const getProductsFromLocalStorage = () => {
  const storedProducts = localStorage.getItem('tradehub-products');
  return storedProducts ? JSON.parse(storedProducts) : [];
};

// Initialize with some mock products if none exist
export const initializeProducts = () => {
  const products = getProductsFromLocalStorage();
  if (products.length === 0) {
    // Use the original mock products data
    saveProductsToLocalStorage(mockProducts);
  }
};

// Call this when the app starts (handled in the original code)
initializeProducts();

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = getProductsFromLocalStorage();
      resolve(products);
    }, 500);
  });
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = getProductsFromLocalStorage();
      const product = products.find((p) => p.id === id);
      resolve(product || null);
    }, 500);
  });
};

// Create a new product
export const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'likes' | 'comments'>): Promise<Product> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = getProductsFromLocalStorage();
      
      const newProduct: Product = {
        id: String(products.length + 1),
        ...productData,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: []
      };
      
      products.push(newProduct);
      saveProductsToLocalStorage(products);
      
      // Also save to the user's personal product list
      if (productData.sellerId) {
        const userProducts = JSON.parse(localStorage.getItem(`tradehub-user-products-${productData.sellerId}`) || '[]');
        userProducts.push(newProduct);
        localStorage.setItem(`tradehub-user-products-${productData.sellerId}`, JSON.stringify(userProducts));
      }
      
      resolve(newProduct);
    }, 500);
  });
};

// Update a product
export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const products = getProductsFromLocalStorage();
      const productIndex = products.findIndex((p) => p.id === id);
      
      if (productIndex === -1) {
        reject(new Error('Product not found'));
        return;
      }
      
      const updatedProduct = {
        ...products[productIndex],
        ...productData,
      };
      
      products[productIndex] = updatedProduct;
      saveProductsToLocalStorage(products);
      
      // Update in user's product list
      if (updatedProduct.sellerId) {
        const userProductsKey = `tradehub-user-products-${updatedProduct.sellerId}`;
        const userProducts = JSON.parse(localStorage.getItem(userProductsKey) || '[]');
        const userProductIndex = userProducts.findIndex(p => p.id === id);
        
        if (userProductIndex !== -1) {
          userProducts[userProductIndex] = updatedProduct;
          localStorage.setItem(userProductsKey, JSON.stringify(userProducts));
        }
      }
      
      resolve(updatedProduct);
    }, 500);
  });
};

// Delete a product
export const deleteProduct = async (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = getProductsFromLocalStorage();
      const productToDelete = products.find(p => p.id === id);
      
      if (!productToDelete) {
        resolve(false);
        return;
      }
      
      const filteredProducts = products.filter((p) => p.id !== id);
      saveProductsToLocalStorage(filteredProducts);
      
      // Remove from user's product list
      if (productToDelete.sellerId) {
        const userProductsKey = `tradehub-user-products-${productToDelete.sellerId}`;
        const userProducts = JSON.parse(localStorage.getItem(userProductsKey) || '[]');
        const updatedUserProducts = userProducts.filter(p => p.id !== id);
        localStorage.setItem(userProductsKey, JSON.stringify(updatedUserProducts));
      }
      
      resolve(true);
    }, 500);
  });
};

// Add a comment to a product
export const addComment = async (productId: string, comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const products = getProductsFromLocalStorage();
        const productIndex = products.findIndex((p) => p.id === productId);
        
        if (productIndex === -1) {
          reject(new Error('Product not found'));
          return;
        }
        
        const newComment: Comment = {
          id: String(products[productIndex].comments.length + 1),
          ...comment,
          createdAt: new Date().toISOString()
        };
        
        products[productIndex].comments.push(newComment);
        saveProductsToLocalStorage(products);
        
        // Update in user's product list if applicable
        const sellerIdOfProduct = products[productIndex].sellerId;
        if (sellerIdOfProduct) {
          const userProductsKey = `tradehub-user-products-${sellerIdOfProduct}`;
          const userProducts = JSON.parse(localStorage.getItem(userProductsKey) || '[]');
          const userProductIndex = userProducts.findIndex(p => p.id === productId);
          
          if (userProductIndex !== -1) {
            userProducts[userProductIndex].comments.push(newComment);
            localStorage.setItem(userProductsKey, JSON.stringify(userProducts));
          }
        }
        
        resolve(newComment);
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};

// Toggle like on a product
export const toggleLike = async (productId: string): Promise<Product> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const products = getProductsFromLocalStorage();
        const productIndex = products.findIndex((p) => p.id === productId);
        
        if (productIndex === -1) {
          reject(new Error('Product not found'));
          return;
        }
        
        // Increment likes
        products[productIndex].likes += 1;
        saveProductsToLocalStorage(products);
        
        // Update in user's product list if applicable
        const sellerIdOfProduct = products[productIndex].sellerId;
        if (sellerIdOfProduct) {
          const userProductsKey = `tradehub-user-products-${sellerIdOfProduct}`;
          const userProducts = JSON.parse(localStorage.getItem(userProductsKey) || '[]');
          const userProductIndex = userProducts.findIndex(p => p.id === productId);
          
          if (userProductIndex !== -1) {
            userProducts[userProductIndex].likes += 1;
            localStorage.setItem(userProductsKey, JSON.stringify(userProducts));
          }
        }
        
        resolve(products[productIndex]);
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};
