
import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../types';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface MessengerProps {
  otherUser: User;
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
}

const Messenger: React.FC<MessengerProps> = ({ 
  otherUser, 
  messages, 
  onSendMessage 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || !user) return;
    
    setIsSending(true);
    
    try {
      await onSendMessage(messageText);
      setMessageText('');
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again."
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-[500px] max-h-[calc(100vh-200px)] border rounded-lg bg-white overflow-hidden">
      <div className="flex items-center p-3 border-b">
        <img 
          src={otherUser.avatar} 
          alt={otherUser.name} 
          className="w-8 h-8 mr-3 rounded-full"
        />
        <div>
          <h3 className="font-medium">{otherUser.name}</h3>
          <p className="text-xs text-gray-500">{otherUser.role}</p>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => {
              const isOwn = message.senderId === user.id;
              
              return (
                <div 
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                      isOwn 
                        ? 'bg-tradehub-primary text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p>{message.content}</p>
                    <span className="block mt-1 text-xs opacity-70">
                      {new Date(message.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="flex items-center p-3 border-t bg-gray-50">
        <Input 
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border rounded-l-md focus:outline-none focus:ring-1 focus:ring-tradehub-primary"
          placeholder="Type a message..."
          disabled={isSending}
        />
        <Button 
          type="submit" 
          className="rounded-l-none" 
          disabled={!messageText.trim() || isSending}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default Messenger;
