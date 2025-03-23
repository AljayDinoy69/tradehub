
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Camera, Pencil, UserCircle, Upload } from 'lucide-react';

const avatarOptions = [
  { color: '0EA5E9', label: 'Blue' },
  { color: '22C55E', label: 'Green' },
  { color: 'EF4444', label: 'Red' },
  { color: 'F59E0B', label: 'Orange' },
  { color: '8B5CF6', label: 'Purple' },
  { color: 'EC4899', label: 'Pink' },
];

const SettingsPage = () => {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update user profile
    updateProfile(name, avatar);
    
    toast({
      title: "Settings updated",
      description: "Your profile settings have been updated successfully.",
    });
  };

  const generateAvatar = (name: string, color: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff`;
  };

  const handleAvatarChange = (color: string) => {
    const newAvatar = generateAvatar(name.replace(' ', '+'), color);
    setAvatar(newAvatar);
    setShowAvatarOptions(false);
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
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={avatar} alt={name} />
                      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => setShowAvatarOptions(!showAvatarOptions)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2"
                      onClick={() => setShowAvatarOptions(!showAvatarOptions)}
                    >
                      <UserCircle className="h-4 w-4" />
                      Change Avatar
                    </Button>
                    <p className="text-xs text-gray-500">
                      Choose from our predefined avatars
                    </p>
                  </div>
                </div>
                
                {showAvatarOptions && (
                  <div className="p-4 bg-gray-50 rounded-md">
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {avatarOptions.map((option) => (
                        <button
                          key={option.color}
                          type="button"
                          className="p-1 rounded-md hover:bg-gray-200 transition-colors"
                          onClick={() => handleAvatarChange(option.color)}
                        >
                          <div className="flex flex-col items-center">
                            <Avatar className="h-12 w-12 mb-1">
                              <AvatarImage 
                                src={generateAvatar(name.replace(' ', '+'), option.color)} 
                                alt={option.label} 
                              />
                              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs">{option.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      className="w-full bg-gray-50"
                      disabled
                    />
                    <p className="text-xs text-gray-500">
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
