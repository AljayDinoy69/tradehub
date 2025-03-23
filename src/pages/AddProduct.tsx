
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AddProductForm from '../components/AddProductForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const AddProduct: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container px-4 py-8 mx-auto max-w-3xl">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Add a New Product</h1>
          <p className="mt-2 text-gray-600">
            Fill out the form below to list your item for sale.
          </p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <AddProductForm />
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
