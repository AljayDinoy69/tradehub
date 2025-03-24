
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { createProduct } from '../services/productService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AddProductForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create a preview URL for the selected image
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      setFormData(prev => ({ ...prev, image: fileUrl }));
    }
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
      const newProduct = await createProduct({
        title: formData.title,
        description: formData.description,
        price,
        category: formData.category,
        image: formData.image,
        sellerId: user.id,
        sellerName: user.name,
        sellerAvatar: user.avatar
      });

      // Save product to localStorage
      const savedProducts = JSON.parse(localStorage.getItem(`tradehub-user-products-${user.id}`) || '[]');
      savedProducts.push(newProduct);
      localStorage.setItem(`tradehub-user-products-${user.id}`, JSON.stringify(savedProducts));
      
      // Show different toast message based on user role
      if (user.role === 'admin') {
        toast({
          title: "Product created",
          description: "Your product has been created and is now live in the marketplace.",
        });
      } else {
        toast({
          title: "Product submitted for review",
          description: "Your product has been submitted and is pending admin approval.",
        });
      }
      
      // Redirect to products page
      navigate('/dashboard');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Only show the approval notice to non-admin users */}
      {user?.role !== 'admin' && (
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="w-4 h-4 text-blue-500" />
          <AlertDescription className="text-blue-700">
            All new products require admin approval before being listed in the marketplace.
          </AlertDescription>
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
          Product Image
        </label>
        <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-md border-gray-300 bg-gray-50">
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {previewUrl ? (
            <div className="mb-3 w-full max-w-xs">
              <img
                src={previewUrl}
                alt="Preview"
                className="object-cover w-full h-40 rounded-md"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl('');
                  setFormData(prev => ({ ...prev, image: '' }));
                }}
              >
                Remove Image
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full text-center">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          )}
          
          <Button
            type="button"
            variant="outline"
            className="mt-2"
            onClick={() => document.getElementById('image')?.click()}
          >
            {previewUrl ? 'Change Image' : 'Select Image'}
          </Button>
        </div>
      </div>
      
      <div className="pt-3">
        <Button 
          type="submit" 
          className="w-full md:w-auto" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Product for Review'}
        </Button>
      </div>
    </form>
  );
};

export default AddProductForm;
