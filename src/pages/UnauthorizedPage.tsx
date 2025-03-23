
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Home } from 'lucide-react';
import Navbar from '../components/Navbar';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container flex flex-col items-center justify-center px-4 py-16 mx-auto text-center max-w-md">
        <ShieldAlert className="w-16 h-16 mb-6 text-red-500" />
        
        <h1 className="mb-4 text-3xl font-bold">Access Denied</h1>
        
        <p className="mb-8 text-gray-600">
          You don't have permission to access this page. This area is restricted to administrators only.
        </p>
        
        <Button asChild>
          <Link to="/">
            <Home className="w-4 h-4 mr-2" />
            Go to Homepage
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
