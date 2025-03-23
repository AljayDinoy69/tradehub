
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { getAllProducts } from '../services/productService';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getAllProducts();
        // Get 3 featured products (normally you'd have criteria for featuring products)
        setFeaturedProducts(products.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="px-4 py-16 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
                Buy, Sell, Trade with TradeHub
              </h1>
              <p className="text-lg text-blue-100 md:text-xl">
                The ultimate marketplace for finding unique items and connecting with sellers directly.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link to="/products">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Browse Products
                  </Link>
                </Button>
                {!isAuthenticated && (
                  <Button variant="outline" size="lg" asChild className="text-white border-white hover:bg-white/10">
                    <Link to="/register">
                      Sign Up Free
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1586880244406-8b455944dde5?q=80&w=687&auto=format&fit=crop"
                alt="TradeHub Marketplace" 
                className="rounded-lg shadow-xl w-full h-[350px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold md:text-3xl">Featured Products</h2>
            <Link to="/products" className="flex items-center text-tradehub-primary hover:underline">
              View all
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 rounded-lg bg-gray-200 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* How It Works */}
      <section className="px-4 py-16 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-12 text-3xl font-bold text-center">How TradeHub Works</h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white bg-tradehub-primary rounded-full">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Create Your Listing</h3>
              <p className="text-gray-600">
                Add photos, description, and set your price for the items you want to sell.
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white bg-tradehub-primary rounded-full">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Connect with Buyers</h3>
              <p className="text-gray-600">
                Receive messages, answer questions, and negotiate directly in the app.
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white bg-tradehub-primary rounded-full">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Complete the Sale</h3>
              <p className="text-gray-600">
                Meet up safely or ship your items to complete your transaction.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="px-4 py-16 bg-gray-100">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to start trading?</h2>
          <p className="max-w-xl mx-auto mb-8 text-lg text-gray-600">
            Join thousands of users buying and selling on TradeHub every day.
          </p>
          <Button size="lg" asChild>
            <Link to={isAuthenticated ? "/add-product" : "/register"}>
              {isAuthenticated ? "Post Your First Product" : "Sign Up Now"}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
