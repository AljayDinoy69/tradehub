
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProductById, updateProduct } from '../services/productService';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        const product = await getProductById(id);
        
        if (!product) {
          setError('Product not found');
          return;
        }
        
        // Check if user is authorized to edit
        if (user?.id !== product.sellerId && !isAdmin) {
          setError('You are not authorized to edit this product');
          return;
        }
        
        setFormData({
          title: product.title,
          description: product.description,
          price: product.price.toString(),
          category: product.category,
          image: product.image
        });
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setError('Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, user, isAdmin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate form data
      if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.image) {
        throw new Error('Please fill out all fields');
      }
      
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        throw new Error('Please enter a valid price');
      }
      
      // Update the product
      const updatedProduct = await updateProduct(id, {
        title: formData.title,
        description: formData.description,
        price,
        category: formData.category,
        image: formData.image
      });
      
      if (!updatedProduct) {
        throw new Error('Failed to update product');
      }
      
      toast({
        title: "Product updated",
        description: "Your changes have been saved successfully."
      });
      
      // Redirect to product page
      navigate(`/products/${id}`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container flex items-center justify-center h-screen px-4 mx-auto max-w-3xl">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
            <p className="text-xl text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container px-4 py-8 mx-auto max-w-3xl">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          
          <Button asChild>
            <Link to="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container px-4 py-8 mx-auto max-w-3xl">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to={`/products/${id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Product
            </Link>
          </Button>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="mt-2 text-gray-600">
            Update your product details below.
          </p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Product Title
              </label>
              <input 
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-tradehub-primary focus:border-transparent"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea 
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-tradehub-primary focus:border-transparent"
                rows={4}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price ($)
                </label>
                <input 
                  type="number"
                  id="price"
                  name="price"
                  min="0.01"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-tradehub-primary focus:border-transparent"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-tradehub-primary focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home">Home & Garden</option>
                  <option value="Sports">Sports & Outdoors</option>
                  <option value="Toys">Toys & Games</option>
                  <option value="Books">Books & Media</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input 
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-tradehub-primary focus:border-transparent"
                placeholder="https://example.com/image.jpg"
                required
              />
              <div className="mt-2">
                <p className="mb-2 text-sm text-gray-600">Current image:</p>
                <img 
                  src={formData.image} 
                  alt="Product preview" 
                  className="object-cover w-full h-40 border rounded-md"
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-3">
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
              </Button>
              
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate(`/products/${id}`)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
