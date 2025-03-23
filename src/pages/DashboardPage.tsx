
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { fetchUserProducts } from '@/services/productService';
import { Package, MessageSquare, Settings, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const DashboardPage = () => {
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
        <div className="flex items-center mb-8 space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.name}'s Dashboard</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Overview</CardTitle>
                <CardDescription>View and manage your account details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name:</span>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Role:</span>
                    <span className="font-medium capitalize">{user.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Products:</span>
                    <span className="font-medium">{isLoading ? '...' : userProducts?.length || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isLoading ? '...' : userProducts?.length || 0}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Recent Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">New Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Products</CardTitle>
                <CardDescription>Manage the products you've listed</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p>Loading your products...</p>
                ) : userProducts?.length ? (
                  <div className="space-y-4">
                    {userProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-12 h-12 bg-cover bg-center rounded" 
                            style={{ backgroundImage: `url(${product.image})` }}
                          />
                          <div>
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-gray-500">${product.price}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => navigate(`/edit-product/${product.id}`)}
                            className="px-3 py-1 text-xs text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => navigate(`/products/${product.id}`)}
                            className="px-3 py-1 text-xs text-gray-600 border border-gray-600 rounded hover:bg-gray-50"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">You haven't listed any products yet</p>
                    <button 
                      onClick={() => navigate('/add-product')} 
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add Your First Product
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Your conversations with other users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <p className="text-gray-500">Your message inbox will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Profile Information</h3>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input 
                          type="text" 
                          defaultValue={user.name}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                          type="email" 
                          defaultValue={user.email}
                          className="w-full p-2 border rounded-md"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Notification Preferences</h3>
                    <Separator className="my-2" />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-700">Email notifications</label>
                        <input type="checkbox" defaultChecked className="h-4 w-4" />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-700">New message alerts</label>
                        <input type="checkbox" defaultChecked className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Save Changes
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DashboardPage;
