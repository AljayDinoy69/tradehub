
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { createProduct } from '../services/productService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const AddProductForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
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
      
      // Create the product
      await createProduct({
        title: formData.title,
        description: formData.description,
        price,
        category: formData.category,
        image: formData.image,
        sellerId: user.id,
        sellerName: user.name,
        sellerAvatar: user.avatar
      });
      
      // Redirect to products page
      navigate('/products');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
        <p className="text-xs text-gray-500">
          Paste a direct link to an image. For demo purposes, you can use images from Unsplash.com.
        </p>
      </div>
      
      <div className="pt-3">
        <Button 
          type="submit" 
          className="w-full md:w-auto" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};

export default AddProductForm;
