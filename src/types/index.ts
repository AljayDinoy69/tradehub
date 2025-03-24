
export type UserRole = 'user' | 'admin';
export type ProductStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
  status: ProductStatus;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'product_approval' | 'product_approved' | 'product_rejected' | 'general';
  read: boolean;
  createdAt: string;
  productId?: string;
}
