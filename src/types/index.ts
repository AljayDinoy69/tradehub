
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

// Sample users for the system (will be generated at initialization)
export const SAMPLE_USERS: User[] = [
  {
    id: "admin1",
    name: "Admin User",
    email: "admin@tradehub.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    role: "admin"
  },
  {
    id: "user1",
    name: "Regular User",
    email: "user@tradehub.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
    role: "user"
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    role: "user"
  },
  {
    id: "user3",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    role: "user"
  },
  {
    id: "user4",
    name: "Alice Johnson",
    email: "alice@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
    role: "user"
  }
];
