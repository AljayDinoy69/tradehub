
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMessages, getConversation, sendMessage, markAsRead } from '../services/messageService';
import { Message, User } from '../types';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<{ [key: string]: { user: User, messages: Message[] } }>({});
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  
  useEffect(() => {
    if (!user) return;
    
    // Load all user messages
    const userMessages = getMessages(user.id);
    setMessages(userMessages);
    
    // Group messages by conversation
    const convMap: { [key: string]: { user: User, messages: Message[] } } = {};
    
    userMessages.forEach((msg) => {
      const otherUserId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
      
      if (!convMap[otherUserId]) {
        // Create placeholder user info (in a real app, you'd fetch user details)
        const otherUser: User = {
          id: otherUserId,
          name: `User ${otherUserId.substring(0, 4)}`,
          email: `user${otherUserId.substring(0, 4)}@example.com`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUserId}`,
          role: 'user'
        };
        
        convMap[otherUserId] = {
          user: otherUser,
          messages: []
        };
      }
      
      convMap[otherUserId].messages.push(msg);
    });
    
    // Sort messages by date in each conversation
    Object.keys(convMap).forEach(userId => {
      convMap[userId].messages.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });
    
    setConversations(convMap);
  }, [user]);
  
  const handleSendMessage = () => {
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
  
  if (!user) {
    return <div>Please login to view your messages</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container grid h-[calc(100vh-80px)] grid-cols-1 gap-4 p-4 mx-auto md:grid-cols-4 max-w-6xl">
        {/* Conversation List */}
        <Card className="md:col-span-1 overflow-hidden">
          <CardHeader className="p-4">
            <CardTitle className="text-xl">Conversations</CardTitle>
          </CardHeader>
          <ScrollArea className="h-[calc(100vh-180px)]">
            <CardContent className="p-2">
              {Object.keys(conversations).length > 0 ? (
                Object.entries(conversations).map(([userId, conv]) => (
                  <div
                    key={userId}
                    className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg transition-colors ${
                      activeConversation === userId 
                        ? 'bg-blue-100' 
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveConversation(userId)}
                  >
                    <Avatar>
                      <AvatarImage src={conv.user.avatar} />
                      <AvatarFallback>{conv.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{conv.user.name}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {conv.messages.length > 0 ? conv.messages[conv.messages.length - 1].content : 'No messages yet'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <p>No conversations yet</p>
                </div>
              )}
            </CardContent>
          </ScrollArea>
        </Card>
        
        {/* Message Area */}
        <Card className="md:col-span-3 overflow-hidden">
          {activeConversation ? (
            <>
              <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={conversations[activeConversation].user.avatar} />
                    <AvatarFallback>
                      {conversations[activeConversation].user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">{conversations[activeConversation].user.name}</CardTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setActiveConversation(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>
              
              <div className="flex flex-col h-[calc(100vh-240px)]">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {conversations[activeConversation].messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            msg.senderId === user.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.senderId === user.id ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="flex gap-2 p-4 border-t">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-180px)]">
              <p className="text-lg text-gray-500">Select a conversation to start messaging</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MessagesPage;
