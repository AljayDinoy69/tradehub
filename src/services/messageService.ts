
import { Message } from '../types';

// Mock messages
let mockMessages: Message[] = [
  {
    id: 'm1',
    senderId: '1',
    receiverId: '2',
    content: 'Hey, I\'m interested in your Vintage Camera. Is it still available?',
    createdAt: '2023-11-16T14:30:00Z',
    read: true
  },
  {
    id: 'm2',
    senderId: '2',
    receiverId: '1',
    content: 'Yes, it\'s still available! Do you have any questions about it?',
    createdAt: '2023-11-16T14:45:00Z',
    read: true
  },
  {
    id: 'm3',
    senderId: '1',
    receiverId: '2',
    content: 'Great! What\'s the condition of the lens?',
    createdAt: '2023-11-16T15:00:00Z',
    read: false
  }
];

// Get conversation between two users
export const getConversation = (userId1: string, userId2: string): Promise<Message[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const conversation = mockMessages.filter(
        m => (m.senderId === userId1 && m.receiverId === userId2) ||
             (m.senderId === userId2 && m.receiverId === userId1)
      ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      
      resolve([...conversation]);
    }, 500);
  });
};

// Send a message
export const sendMessage = (message: Omit<Message, 'id' | 'createdAt' | 'read'>): Promise<Message> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMessage: Message = {
        ...message,
        id: `m${mockMessages.length + 1}`,
        createdAt: new Date().toISOString(),
        read: false
      };
      
      mockMessages = [...mockMessages, newMessage];
      resolve({...newMessage});
    }, 500);
  });
};

// Mark messages as read
export const markAsRead = (senderId: string, receiverId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockMessages = mockMessages.map(m => {
        if (m.senderId === senderId && m.receiverId === receiverId && !m.read) {
          return { ...m, read: true };
        }
        return m;
      });
      
      resolve(true);
    }, 500);
  });
};

// Get unread message count for a user
export const getUnreadCount = (userId: string): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const count = mockMessages.filter(m => m.receiverId === userId && !m.read).length;
      resolve(count);
    }, 500);
  });
};
