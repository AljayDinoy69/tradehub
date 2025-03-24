import { Product, Comment, ProductStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { createNotification } from './notificationService';

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
export const createProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'likes' | 'comments' | 'status'>) => {
  // Get all users to determine if the creator is an admin
  const storedUsers = localStorage.getItem('tradehub-users');
  const users = storedUsers ? JSON.parse(storedUsers) : [];
  
  // Find the seller in the users array
  const seller = users.find((user: any) => user.id === productData.sellerId);
  
  // Set product status based on user role - approved for admin, pending for regular users
  const productStatus: ProductStatus = seller?.role === 'admin' ? 'approved' : 'pending';

  const newProduct: Product = {
    ...productData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: [],
    status: productStatus // Automatically approve if admin created
  };

  // Get existing products
  const storedProducts = localStorage.getItem('tradehub-products');
  const products = storedProducts ? JSON.parse(storedProducts) : [];

  // Add the new product
  products.push(newProduct);

  // Save back to localStorage
  localStorage.setItem('tradehub-products', JSON.stringify(products));
  
  // Only create notifications if the product is pending (not created by admin)
  if (productStatus === 'pending') {
    // Notify all admins about the new product
    if (storedUsers) {
      const admins = users.filter((user: any) => user.role === 'admin');
      
      admins.forEach((admin: any) => {
        createNotification({
          userId: admin.id,
          title: 'New Product Pending Approval',
          message: `${productData.sellerName} has added a new product "${productData.title}" that requires your approval.`,
          type: 'product_approval',
          productId: newProduct.id
        });
      });
    }
  }
  
  return newProduct;
};

// Function to retrieve all products
export const getAllProducts = () => {
  const storedProducts = localStorage.getItem('tradehub-products');
  return storedProducts ? JSON.parse(storedProducts) : [];
};

// Function to retrieve all approved products
export const getApprovedProducts = () => {
  const products = getAllProducts();
  return products.filter((product: Product) => product.status === 'approved');
};

// Function to retrieve all pending products
export const getPendingProducts = () => {
  const products = getAllProducts();
  return products.filter((product: Product) => product.status === 'pending');
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
    // Get the old product status
    const oldStatus = products[index].status;
    
    // Update the product
    products[index] = { ...products[index], ...updatedProduct };
    
    // Save the updated products array back to localStorage
    localStorage.setItem('tradehub-products', JSON.stringify(products));
    
    // If status changed, create notifications
    if (updatedProduct.status && oldStatus !== updatedProduct.status) {
      // Notify the seller about the status change
      createNotification({
        userId: products[index].sellerId,
        title: updatedProduct.status === 'approved' ? 'Product Approved' : 'Product Rejected',
        message: updatedProduct.status === 'approved' 
          ? `Your product "${products[index].title}" has been approved and is now listed.`
          : `Your product "${products[index].title}" has been rejected. Please contact support for more information.`,
        type: updatedProduct.status === 'approved' ? 'product_approved' : 'product_rejected',
        productId: id
      });
    }
    
    return products[index]; // Return updated product
  } else {
    return null; // Product not found
  }
};

// Function to approve a product
export const approveProduct = (id: string) => {
  return updateProduct(id, { status: 'approved' });
};

// Function to reject a product
export const rejectProduct = (id: string) => {
  return updateProduct(id, { status: 'rejected' });
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
  return products.filter((product: any) => product.sellerId === userId);
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
