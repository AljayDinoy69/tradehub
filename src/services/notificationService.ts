
import { v4 as uuidv4 } from 'uuid';
import { Notification } from '../types';

// Get all notifications for a user
export const getNotifications = (userId: string): Notification[] => {
  const storedNotifications = localStorage.getItem('tradehub-notifications');
  const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];
  return notifications.filter((notification: Notification) => notification.userId === userId);
};

// Get all unread notifications for a user
export const getUnreadNotifications = (userId: string): Notification[] => {
  const notifications = getNotifications(userId);
  return notifications.filter((notification: Notification) => !notification.read);
};

// Create a notification
export const createNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Notification => {
  const storedNotifications = localStorage.getItem('tradehub-notifications');
  const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];
  
  const newNotification: Notification = {
    ...notification,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    read: false
  };
  
  notifications.push(newNotification);
  localStorage.setItem('tradehub-notifications', JSON.stringify(notifications));
  
  return newNotification;
};

// Mark a notification as read
export const markNotificationAsRead = (notificationId: string): boolean => {
  const storedNotifications = localStorage.getItem('tradehub-notifications');
  if (!storedNotifications) return false;
  
  const notifications = JSON.parse(storedNotifications);
  const index = notifications.findIndex((notification: Notification) => notification.id === notificationId);
  
  if (index !== -1) {
    notifications[index].read = true;
    localStorage.setItem('tradehub-notifications', JSON.stringify(notifications));
    return true;
  }
  
  return false;
};

// Mark all notifications as read for a user
export const markAllNotificationsAsRead = (userId: string): boolean => {
  const storedNotifications = localStorage.getItem('tradehub-notifications');
  if (!storedNotifications) return false;
  
  const notifications = JSON.parse(storedNotifications);
  let updated = false;
  
  notifications.forEach((notification: Notification) => {
    if (notification.userId === userId && !notification.read) {
      notification.read = true;
      updated = true;
    }
  });
  
  if (updated) {
    localStorage.setItem('tradehub-notifications', JSON.stringify(notifications));
  }
  
  return updated;
};

// Delete a notification
export const deleteNotification = (notificationId: string): boolean => {
  const storedNotifications = localStorage.getItem('tradehub-notifications');
  if (!storedNotifications) return false;
  
  const notifications = JSON.parse(storedNotifications);
  const updatedNotifications = notifications.filter(
    (notification: Notification) => notification.id !== notificationId
  );
  
  if (updatedNotifications.length !== notifications.length) {
    localStorage.setItem('tradehub-notifications', JSON.stringify(updatedNotifications));
    return true;
  }
  
  return false;
};
