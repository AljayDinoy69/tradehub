
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import { getAllProducts, deleteProduct } from '../services/productService';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle, Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Products: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        product => 
          product.title.toLowerCase().includes(term) || 
          product.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, products]);

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

  // Extract unique categories for the filter
  const categories = ['all', ...new Set(products.map(product => product.category))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container px-4 py-8 mx-auto max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
          <h1 className="text-3xl font-bold">All Products</h1>
          
          {isAuthenticated && (
            <Button asChild>
              <Link to="/add-product">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Product
              </Link>
            </Button>
          )}
        </div>
        
        <div className="sticky top-16 z-30 py-4 bg-gray-50">
          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-tradehub-primary focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-tradehub-primary focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="mb-4 text-xl text-gray-600">No products found matching your criteria.</p>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
