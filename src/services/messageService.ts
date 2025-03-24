
import { Message, User } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Get all messages for a user
export const getMessages = (userId: string) => {
  const storedMessages = localStorage.getItem('tradehub-messages');
  const messages = storedMessages ? JSON.parse(storedMessages) : [];
  
  // Return messages where the user is either the sender or receiver
  return messages.filter((message: Message) => 
    message.senderId === userId || message.receiverId === userId
  );
};

// Get conversation between two users
export const getConversation = (userId1: string, userId2: string) => {
  const storedMessages = localStorage.getItem('tradehub-messages');
  const messages = storedMessages ? JSON.parse(storedMessages) : [];
  
  // Filter messages that are between these two users
  return messages.filter((message: Message) => 
    (message.senderId === userId1 && message.receiverId === userId2) ||
    (message.senderId === userId2 && message.receiverId === userId1)
  );
};

// Send a new message
export const sendMessage = (messageData: Omit<Message, 'id' | 'createdAt' | 'read'>) => {
  const newMessage: Message = {
    ...messageData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    read: false
  };
  
  // Get existing messages
  const storedMessages = localStorage.getItem('tradehub-messages');
  const messages = storedMessages ? JSON.parse(storedMessages) : [];
  
  // Add new message
  messages.push(newMessage);
  
  // Save back to localStorage
  localStorage.setItem('tradehub-messages', JSON.stringify(messages));
  
  return newMessage;
};

// Mark messages as read
export const markAsRead = (messageIds: string[]) => {
  const storedMessages = localStorage.getItem('tradehub-messages');
  let messages = storedMessages ? JSON.parse(storedMessages) : [];
  
  // Update read status for specified messages
  messages = messages.map((message: Message) => {
    if (messageIds.includes(message.id)) {
      return { ...message, read: true };
    }
    return message;
  });
  
  // Save back to localStorage
  localStorage.setItem('tradehub-messages', JSON.stringify(messages));
  
  return messages.filter((message: Message) => messageIds.includes(message.id));
};

// Get all users with whom the current user has conversations
export const getConversationUsers = (currentUserId: string): string[] => {
  const userMessages = getMessages(currentUserId);
  
  // Get unique user IDs the current user has interacted with
  const userIds = new Set<string>();
  
  userMessages.forEach((message: Message) => {
    if (message.senderId === currentUserId) {
      userIds.add(message.receiverId);
    } else {
      userIds.add(message.senderId);
    }
  });
  
  return Array.from(userIds);
};

// Get unread message count from a specific user
export const getUnreadMessageCount = (currentUserId: string, fromUserId: string): number => {
  const messages = getConversation(currentUserId, fromUserId);
  
  return messages.filter((message: Message) => 
    message.receiverId === currentUserId && !message.read
  ).length;
};

// Get all users in the system (for starting new conversations)
export const getAllUsers = (): User[] => {
  const storedUsers = localStorage.getItem('tradehub-users');
  return storedUsers ? JSON.parse(storedUsers) : [];
};

