
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const SettingsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [name, setName] = React.useState(user?.name || '');
  const [avatar, setAvatar] = React.useState(user?.avatar || '');
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to the server
    toast({
      title: "Settings updated",
      description: "Your profile settings have been updated successfully.",
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container py-8 mx-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account details and profile picture</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={avatar} alt={name} />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button type="button" variant="outline" size="sm" className="mb-2">
                      Change Avatar
                    </Button>
                    <p className="text-xs text-gray-500">
                      JPG, PNG or GIF. 1MB max size.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={user.email}
                      className="w-full p-2 border rounded-md bg-gray-50"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email address cannot be changed
                    </p>
                  </div>
                </div>
                
                <div>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive emails about your account activity</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Product Updates</h3>
                    <p className="text-sm text-gray-500">Receive updates about products you're following</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">New Message Alerts</h3>
                    <p className="text-sm text-gray-500">Get notified when you receive new messages</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>Irreversible and destructive actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Delete Account</h3>
                    <p className="text-sm text-gray-500">Permanently delete your account and all your data</p>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
