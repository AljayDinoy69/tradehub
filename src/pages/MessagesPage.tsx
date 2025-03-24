import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMessages, getConversation, sendMessage, markAsRead, getAllUsers } from '../services/messageService';
import { Message, User } from '../types';
import Navbar from '../components/Navbar';
import NewConversation from '../components/NewConversation';
import Messenger from '../components/Messenger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, X, MessageCircle, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<{ [key: string]: { user: User, messages: Message[], unreadCount: number } }>({});
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Function to load messages and conversations
  const loadMessages = () => {
    if (!user) return;
    
    setLoading(true);
    
    // Load all user messages
    const userMessages = getMessages(user.id);
    setMessages(userMessages);
    
    // Get all users for conversations
    const allUsers = getAllUsers();
    
    // Group messages by conversation
    const convMap: { [key: string]: { user: User, messages: Message[], unreadCount: number } } = {};
    
    userMessages.forEach((msg) => {
      const otherUserId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
      
      if (!convMap[otherUserId]) {
        // Find the other user from all users
        const otherUser = allUsers.find(u => u.id === otherUserId);
        
        if (otherUser) {
          convMap[otherUserId] = {
            user: otherUser,
            messages: [],
            unreadCount: 0
          };
        } else {
          // Create placeholder user info if not found
          convMap[otherUserId] = {
            user: {
              id: otherUserId,
              name: `User ${otherUserId.substring(0, 4)}`,
              email: `user${otherUserId.substring(0, 4)}@example.com`,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUserId}`,
              role: 'user'
            },
            messages: [],
            unreadCount: 0
          };
        }
      }
      
      convMap[otherUserId].messages.push(msg);
      
      // Count unread messages
      if (msg.receiverId === user.id && !msg.read) {
        convMap[otherUserId].unreadCount += 1;
      }
    });
    
    // Sort messages by date in each conversation
    Object.keys(convMap).forEach(userId => {
      convMap[userId].messages.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });
    
    setConversations(convMap);
    setLoading(false);
  };
  
  useEffect(() => {
    loadMessages();
  }, [user]);
  
  const handleSendMessage = async () => {
    if (!user || !activeConversation || !newMessage.trim()) return;
    
    try {
      const sentMessage = sendMessage({
        senderId: user.id,
        receiverId: activeConversation,
        content: newMessage
      });
      
      // Update local state
      setMessages(prev => [...prev, sentMessage]);
      setConversations(prev => ({
        ...prev,
        [activeConversation]: {
          ...prev[activeConversation],
          messages: [...prev[activeConversation].messages, sentMessage]
        }
      }));
      
      setNewMessage('');
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully"
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again."
      });
    }
  };
  
  const handleOpenConversation = (userId: string) => {
    if (!user) return;
    
    setActiveConversation(userId);
    
    // Mark messages as read when opening conversation
    if (conversations[userId]?.unreadCount > 0) {
      const unreadMessages = conversations[userId].messages
        .filter(msg => msg.receiverId === user.id && !msg.read)
        .map(msg => msg.id);
      
      if (unreadMessages.length > 0) {
        markAsRead(unreadMessages);
        
        // Update local state
        setConversations(prev => ({
          ...prev,
          [userId]: {
            ...prev[userId],
            unreadCount: 0,
            messages: prev[userId].messages.map(msg => 
              msg.receiverId === user.id ? { ...msg, read: true } : msg
            )
          }
        }));
      }
    }
  };
  
  const handleNewConversation = (selectedUser: User) => {
    // Add the user to conversations if not already there
    if (!conversations[selectedUser.id]) {
      setConversations(prev => ({
        ...prev,
        [selectedUser.id]: {
          user: selectedUser,
          messages: [],
          unreadCount: 0
        }
      }));
    }
    
    // Set as active conversation
    setActiveConversation(selectedUser.id);
  };

  // Filter conversations based on search term
  const filteredConversations = Object.entries(conversations).filter(([_, conv]) => {
    if (!searchTerm) return true;
    
    return (
      conv.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  if (!user) {
    return <div>Please login to view your messages</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container grid h-[calc(100vh-80px)] grid-cols-1 gap-4 p-4 mx-auto md:grid-cols-4 max-w-6xl">
        {/* Conversation List */}
        <Card className="md:col-span-1 overflow-hidden">
          <CardHeader className="p-4 space-y-3">
            <CardTitle className="text-xl">Messages</CardTitle>
            
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Search conversations..." 
                  className="pl-9" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <NewConversation onSelectUser={handleNewConversation} />
            </div>
          </CardHeader>
          
          <ScrollArea className="h-[calc(100vh-210px)]">
            <CardContent className="p-2">
              {loading ? (
                <div className="py-8 text-center">
                  <p className="text-gray-500">Loading conversations...</p>
                </div>
              ) : filteredConversations.length > 0 ? (
                filteredConversations
                  .sort(([_, a], [__, b]) => {
                    const aLastMsg = a.messages[a.messages.length - 1];
                    const bLastMsg = b.messages[b.messages.length - 1];
                    
                    // Sort by unread count first, then by latest message
                    if (a.unreadCount !== b.unreadCount) {
                      return b.unreadCount - a.unreadCount;
                    }
                    
                    if (!aLastMsg && !bLastMsg) return 0;
                    if (!aLastMsg) return 1;
                    if (!bLastMsg) return -1;
                    
                    return new Date(bLastMsg.createdAt).getTime() - 
                           new Date(aLastMsg.createdAt).getTime();
                  })
                  .map(([userId, conv]) => (
                    <div
                      key={userId}
                      className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg transition-colors mb-1 ${
                        activeConversation === userId 
                          ? 'bg-blue-100' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleOpenConversation(userId)}
                    >
                      <Avatar className="border border-gray-200">
                        <AvatarImage src={conv.user.avatar} />
                        <AvatarFallback>{conv.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-medium truncate">{conv.user.name}</p>
                          {conv.unreadCount > 0 && (
                            <Badge variant="destructive" className="ml-2">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {conv.messages.length > 0 
                            ? conv.messages[conv.messages.length - 1].content 
                            : 'Start a conversation'
                          }
                        </p>
                        <p className="text-xs text-gray-400 capitalize">{conv.user.role}</p>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="py-12 text-center flex flex-col items-center text-gray-500">
                  <MessageCircle className="w-12 h-12 mb-2 text-gray-300" />
                  <p>No conversations found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {searchTerm ? 'Try a different search term' : 'Start a new conversation using the button above'}
                  </p>
                </div>
              )}
            </CardContent>
          </ScrollArea>
        </Card>
        
        {/* Message Area */}
        <Card className="md:col-span-3 overflow-hidden">
          {activeConversation && conversations[activeConversation] ? (
            <Messenger
              otherUser={conversations[activeConversation].user}
              messages={conversations[activeConversation].messages}
              onSendMessage={async (content) => {
                setNewMessage(content);
                await handleSendMessage();
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-180px)]">
              <MessageCircle className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-lg text-gray-500">Select a conversation to start messaging</p>
              <p className="text-sm text-gray-400 mt-1">
                Or start a new conversation with the "New Message" button
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MessagesPage;
