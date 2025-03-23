
import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import { getAllProducts, deleteProduct } from '../services/productService';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Shield, Trash, Edit, Eye, User, Package, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const AdminPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const success = await deleteProduct(id);
      
      if (success) {
        // Update local state to remove the deleted product
        setProducts(prev => prev.filter(product => product.id !== id));
        toast({
          title: "Product deleted",
          description: "The product has been successfully removed."
        });
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

  // Group products by seller
  const productsBySeller: Record<string, Product[]> = {};
  products.forEach(product => {
    if (!productsBySeller[product.sellerId]) {
      productsBySeller[product.sellerId] = [];
    }
    productsBySeller[product.sellerId].push(product);
  });

  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container px-4 py-8 mx-auto max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Total Products</h2>
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold">{products.length}</p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Total Sellers</h2>
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold">{Object.keys(productsBySeller).length}</p>
          </div>
        </div>
        
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Manage Products</h2>
            <Button asChild>
              <Link to="/products">
                View All Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-4 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-lg">
              <p className="text-gray-600">No products available.</p>
            </div>
          ) : (
            <div className="overflow-hidden bg-white border rounded-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left">Product</th>
                      <th className="px-4 py-3 text-left">Price</th>
                      <th className="px-4 py-3 text-left">Category</th>
                      <th className="px-4 py-3 text-left">Seller</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <img 
                              src={product.image} 
                              alt={product.title} 
                              className="w-10 h-10 mr-3 rounded object-cover"
                            />
                            <span className="font-medium">{product.title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-green-600">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          {product.category}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <img 
                              src={product.sellerAvatar} 
                              alt={product.sellerName} 
                              className="w-6 h-6 mr-2 rounded-full"
                            />
                            {product.sellerName}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/products/${product.id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/edit-product/${product.id}`}>
                                <Edit className="w-4 h-4" />
                              </Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                  <Trash className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the
                                    product "{product.title}" and remove it from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(product.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
