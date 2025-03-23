
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProductById, addComment, toggleLike, deleteProduct } from '../services/productService';
import { getConversation, sendMessage } from '../services/messageService';
import { Product, Message, User } from '../types';
import Navbar from '../components/Navbar';
import CommentSection from '../components/CommentSection';
import Messenger from '../components/Messenger';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Heart, Share, MessageCircle, ArrowLeft, Trash, Edit, AlertCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const ViewProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMessenger, setShowMessenger] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sellerUser, setSellerUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        const productData = await getProductById(id);
        setProduct(productData);
        
        if (productData) {
          // Create a mock seller user from the product data
          setSellerUser({
            id: productData.sellerId,
            name: productData.sellerName,
            email: `seller${productData.sellerId}@example.com`, // mock email
            avatar: productData.sellerAvatar,
            role: productData.sellerId === '1' ? 'admin' : 'user'
          });
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    // Load messages between current user and seller if both exist
    const loadMessages = async () => {
      if (!user || !product) return;
      
      try {
        const conversation = await getConversation(user.id, product.sellerId);
        setMessages(conversation);
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    if (isAuthenticated && product) {
      loadMessages();
    }
  }, [isAuthenticated, user, product]);

  const handleAddComment = async (productId: string, content: string) => {
    if (!user) return;
    
    try {
      await addComment(productId, {
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        content
      });
      
      // Refresh product data to show the new comment
      const updatedProduct = await getProductById(productId);
      setProduct(updatedProduct);
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully."
      });
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to post your comment. Please try again."
      });
    }
  };

  const handleLike = async () => {
    if (!product) return;
    
    try {
      const updatedProduct = await toggleLike(product.id);
      setProduct(updatedProduct);
      
      toast({
        title: "Liked!",
        description: "You liked this product."
      });
    } catch (error) {
      console.error('Failed to like product:', error);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    
    try {
      const success = await deleteProduct(product.id);
      
      if (success) {
        toast({
          title: "Product deleted",
          description: "The product has been successfully removed."
        });
        navigate('/products');
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the product. Please try again."
      });
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!user || !product || !sellerUser) return;
    
    try {
      const newMessage = await sendMessage({
        senderId: user.id,
        receiverId: product.sellerId,
        content
      });
      
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again."
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container flex items-center justify-center h-screen px-4 mx-auto max-w-6xl">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
            <p className="text-xl text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container flex flex-col items-center justify-center h-screen px-4 mx-auto max-w-6xl">
          <AlertCircle className="w-16 h-16 mb-4 text-red-500" />
          <h1 className="mb-2 text-2xl font-bold">Product Not Found</h1>
          <p className="mb-6 text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === product.sellerId;
  const canEdit = isOwner || isAdmin;
  const canContactSeller = isAuthenticated && !isOwner;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container px-4 py-8 mx-auto max-w-6xl">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </Button>
          
          <div className="grid gap-8 md:grid-cols-2">
            {/* Product Image */}
            <div className="overflow-hidden bg-white border rounded-lg">
              <AspectRatio ratio={4/3} className="bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="object-cover w-full h-full" 
                />
              </AspectRatio>
              
              <div className="flex p-4 border-t">
                <Button variant="ghost" className="flex-1" onClick={handleLike}>
                  <Heart className="w-4 h-4 mr-2" />
                  Like ({product.likes})
                </Button>
                {canContactSeller && (
                  <Button 
                    variant="ghost" 
                    className="flex-1" 
                    onClick={() => setShowMessenger(!showMessenger)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {showMessenger ? 'Hide Chat' : 'Contact Seller'}
                  </Button>
                )}
                <Button variant="ghost" className="flex-1">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
            
            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{product.category}</Badge>
                  {canEdit && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/edit-product/${product.id}`}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the
                              product and remove it from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
                
                <h1 className="mb-2 text-3xl font-bold">{product.title}</h1>
                <div className="mb-4 text-2xl font-bold text-green-600">${product.price.toFixed(2)}</div>
                <p className="mb-6 text-gray-700">{product.description}</p>
              </div>
              
              <div className="p-4 bg-gray-100 rounded-lg">
                <h3 className="mb-3 text-lg font-semibold">Seller Information</h3>
                <div className="flex items-center">
                  <img 
                    src={product.sellerAvatar} 
                    alt={product.sellerName} 
                    className="w-10 h-10 mr-3 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{product.sellerName}</p>
                    <p className="text-sm text-gray-600">
                      Posted on {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Mini Messenger */}
              {showMessenger && isAuthenticated && !isOwner && sellerUser && (
                <div className="mt-6">
                  <h3 className="mb-4 text-lg font-semibold">Contact Seller</h3>
                  <Messenger 
                    otherUser={sellerUser}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Comments Section */}
        <div className="mt-8">
          <CommentSection 
            comments={product.comments} 
            productId={product.id}
            onAddComment={handleAddComment}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
