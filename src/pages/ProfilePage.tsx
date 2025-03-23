import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useQuery } from '@tanstack/react-query';
import { fetchUserProducts } from '@/services/productService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Package, Settings } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const { data: userProducts, isLoading } = useQuery({
    queryKey: ['userProducts', user?.id],
    queryFn: () => fetchUserProducts(user?.id || ''),
    enabled: !!user?.id,
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container py-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile sidebar */}
          <div className="md:col-span-1">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <h1 className="text-xl font-bold">{user.name}</h1>
                  <p className="text-gray-500 mb-2">{user.email}</p>
                  <Badge variant="outline" className="capitalize mb-4">{user.role}</Badge>
                  
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>New York, USA</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Joined April 2023</span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center"
                    onClick={() => navigate('/settings')}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Seller Stats
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Products Listed</span>
                    <span className="font-semibold">{isLoading ? '...' : userProducts?.length || 0}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Sales</span>
                    <span className="font-semibold">12</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Rating</span>
                    <span className="font-semibold">4.8/5</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Response Rate</span>
                    <span className="font-semibold">95%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">My Products</h2>
              <Button onClick={() => navigate('/add-product')}>Add New Product</Button>
            </div>
            
            {isLoading ? (
              <p>Loading products...</p>
            ) : userProducts?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No Products Listed</h3>
                  <p className="text-gray-500 mb-6">You haven't listed any products for sale yet.</p>
                  <Button onClick={() => navigate('/add-product')}>Create Your First Listing</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
