
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Home, 
  Package, 
  PlusCircle, 
  User, 
  LogOut, 
  LogIn, 
  Settings, 
  UserCircle,
  LayoutDashboard,
  MessageSquare
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-tradehub-primary">
          <Package className="w-6 h-6" />
          TradeHub
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center gap-1 text-gray-700 hover:text-tradehub-primary">
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          
          <Link to="/products" className="flex items-center gap-1 text-gray-700 hover:text-tradehub-primary">
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">Products</span>
          </Link>
          
          {isAuthenticated && (
            <>
              <Link to="/add-product" className="flex items-center gap-1 text-gray-700 hover:text-tradehub-primary">
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Add Product</span>
              </Link>
              
              {isAdmin && (
                <Link to="/admin" className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              )}
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative flex items-center gap-2 p-1 rounded-full h-10 w-10">
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name}</p>
                    <p className="w-[200px] truncate text-sm text-gray-500">{user?.email}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center cursor-pointer">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center cursor-pointer">
                    <UserCircle className="w-4 h-4 mr-2" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/messages" className="flex items-center cursor-pointer">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    <span>Messages</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">
                  <LogIn className="w-4 h-4 mr-2" />
                  <span>Login</span>
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
