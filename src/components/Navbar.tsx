
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Home, Package, PlusCircle, User, LogOut, LogIn } from 'lucide-react';

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
            <div className="flex items-center gap-3">
              <div className="hidden md:flex md:flex-col md:items-end">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-gray-500">{user?.role}</span>
              </div>
              <img 
                src={user?.avatar} 
                alt={user?.name} 
                className="w-8 h-8 rounded-full border border-gray-200"
              />
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
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
