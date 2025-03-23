
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Send } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getMessages, sendMessage } from '@/services/messageService';
import { Message, User } from '@/types';

const MessagesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = React.useState<User | null>(null);
  const [messageText, setMessageText] = React.useState('');
  
  // Mock contacts data - in a real app would come from API
  const contacts = [
    {
      id: '3',
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=4F46E5&color=fff',
      role: 'user' as const
    },
    {
      id: '4',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=10B981&color=fff',
      role: 'user' as const
    }
  ];

  // Get messages for the selected contact
  const { data: messages, refetch } = useQuery({
    queryKey: ['messages', user?.id, selectedContact?.id],
    queryFn: () => getMessages(user?.id || '', selectedContact?.id || ''),
    enabled: !!user?.id && !!selectedContact?.id,
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Scroll to bottom of messages when messages change
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !user || !selectedContact) return;
    
    await sendMessage({
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: selectedContact.id,
      text: messageText,
      timestamp: new Date().toISOString(),
      read: false
    });
    
    setMessageText('');
    refetch();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
          {/* Contacts sidebar */}
          <Card className="md:col-span-1 overflow-hidden">
            <CardContent className="p-0">
              <div className="p-3 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input 
                    placeholder="Search contacts..." 
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="divide-y max-h-[calc(100vh-280px)] overflow-y-auto">
                {contacts.map((contact) => (
                  <div 
                    key={contact.id} 
                    className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${
                      selectedContact?.id === contact.id ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium truncate">{contact.name}</h3>
                        <span className="text-xs text-gray-500">12:34 PM</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        Latest message preview...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Chat area */}
          <Card className="md:col-span-2 flex flex-col h-full">
            {selectedContact ? (
              <>
                <div className="p-3 border-b flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                    <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedContact.name}</h3>
                    <p className="text-xs text-gray-500">Online</p>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-350px)]">
                  {messages && messages.length > 0 ? (
                    messages.map((message: Message) => {
                      const isCurrentUser = message.senderId === user.id;
                      return (
                        <div 
                          key={message.id} 
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[70%] rounded-lg p-3 ${
                              isCurrentUser 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-800'
                            }`}
                          >
                            <p>{message.text}</p>
                            <p className={`text-xs mt-1 ${
                              isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-gray-500">No messages yet. Start the conversation!</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="p-3 border-t mt-auto">
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="Type a message..." 
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500 mb-2">Select a contact to start messaging</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MessagesPage;
