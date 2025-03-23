
import { Product, Comment } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Function to add a new product
export const addProduct = (product: any) => {
  // Get existing products from localStorage
  const storedProducts = localStorage.getItem('tradehub-products');
  const products = storedProducts ? JSON.parse(storedProducts) : [];

  // Add the new product
  products.push(product);

  // Save the updated products array back to localStorage
  localStorage.setItem('tradehub-products', JSON.stringify(products));
};

// Function to create a new product with proper ID and timestamps
export const createProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'likes' | 'comments'>) => {
  const newProduct: Product = {
    ...productData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: []
  };

  // Get existing products
  const storedProducts = localStorage.getItem('tradehub-products');
  const products = storedProducts ? JSON.parse(storedProducts) : [];

  // Add the new product
  products.push(newProduct);

  // Save back to localStorage
  localStorage.setItem('tradehub-products', JSON.stringify(products));
  
  return newProduct;
};

// Function to retrieve all products
export const getAllProducts = () => {
  const storedProducts = localStorage.getItem('tradehub-products');
  return storedProducts ? JSON.parse(storedProducts) : [];
};

// Function to retrieve a single product by ID
export const getProductById = (id: string) => {
  const storedProducts = localStorage.getItem('tradehub-products');
  const products = storedProducts ? JSON.parse(storedProducts) : [];
  return products.find((product: any) => product.id === id);
};

// Function to update an existing product
export const updateProduct = (id: string, updatedProduct: any) => {
  const storedProducts = localStorage.getItem('tradehub-products');
  let products = storedProducts ? JSON.parse(storedProducts) : [];

  // Find the index of the product to update
  const index = products.findIndex((product: any) => product.id === id);

  if (index !== -1) {
    // Update the product
    products[index] = { ...products[index], ...updatedProduct };

    // Save the updated products array back to localStorage
    localStorage.setItem('tradehub-products', JSON.stringify(products));
    return products[index]; // Return updated product
  } else {
    return null; // Product not found
  }
};

// Function to delete a product by ID
export const deleteProduct = (id: string) => {
  const storedProducts = localStorage.getItem('tradehub-products');
  let products = storedProducts ? JSON.parse(storedProducts) : [];

  // Filter out the product to delete
  products = products.filter((product: any) => product.id !== id);

  // Save the updated products array back to localStorage
  localStorage.setItem('tradehub-products', JSON.stringify(products));
  
  return true; // Return success
};

// Add this function to fetch products by user ID
export const fetchUserProducts = (userId: string) => {
  // Get products from localStorage
  const storedProducts = localStorage.getItem('tradehub-products');
  const products = storedProducts ? JSON.parse(storedProducts) : [];
  
  // Filter products by user ID
  return products.filter((product: any) => product.userId === userId);
};

// Add a comment to a product
export const addComment = (productId: string, commentData: Omit<Comment, 'id' | 'createdAt'>) => {
  const storedProducts = localStorage.getItem('tradehub-products');
  let products = storedProducts ? JSON.parse(storedProducts) : [];

  // Find the product
  const index = products.findIndex((product: Product) => product.id === productId);
  
  if (index !== -1) {
    // Create new comment with ID and timestamp
    const newComment: Comment = {
      ...commentData,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    
    // Add comment to product
    if (!products[index].comments) {
      products[index].comments = [];
    }
    
    products[index].comments.push(newComment);
    
    // Save back to localStorage
    localStorage.setItem('tradehub-products', JSON.stringify(products));
    
    return products[index]; // Return updated product
  }
  
  return null; // Product not found
};

// Toggle like on a product
export const toggleLike = (productId: string) => {
  const storedProducts = localStorage.getItem('tradehub-products');
  let products = storedProducts ? JSON.parse(storedProducts) : [];

  // Find the product
  const index = products.findIndex((product: Product) => product.id === productId);
  
  if (index !== -1) {
    // Increment likes
    if (!products[index].likes) {
      products[index].likes = 0;
    }
    
    products[index].likes += 1;
    
    // Save back to localStorage
    localStorage.setItem('tradehub-products', JSON.stringify(products));
    
    return products[index]; // Return updated product
  }
  
  return null; // Product not found
};
