
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Eye, Edit, Trash } from 'lucide-react';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ProductCardProps {
  product: Product;
  onDelete?: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  const { user, isAdmin } = useAuth();
  const isOwner = user?.id === product.sellerId;
  const canEdit = isOwner || isAdmin;

  return (
    <div className="overflow-hidden transition-all duration-300 bg-white border rounded-lg shadow-sm hover:shadow-md">
      <Link to={`/products/${product.id}`}>
        <AspectRatio ratio={4/3} className="bg-gray-100">
          <img 
            src={product.image} 
            alt={product.title} 
            className="object-cover w-full h-full" 
          />
        </AspectRatio>
      </Link>
      
      <div className="p-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="mb-2">
            {product.category}
          </Badge>
          <span className="text-lg font-bold text-green-600">
            ${product.price.toFixed(2)}
          </span>
        </div>
        
        <Link to={`/products/${product.id}`}>
          <h3 className="mb-2 text-lg font-semibold leading-tight text-gray-900 hover:text-tradehub-primary">
            {product.title}
          </h3>
        </Link>
        
        <p className="mb-3 text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <img 
              src={product.sellerAvatar} 
              alt={product.sellerName} 
              className="w-6 h-6 rounded-full"
            />
            <span className="text-xs text-gray-600">{product.sellerName}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="flex items-center text-xs text-gray-500">
              <Heart className="w-3.5 h-3.5 mr-1 text-gray-400" />
              {product.likes}
            </span>
            <span className="flex items-center text-xs text-gray-500">
              <MessageCircle className="w-3.5 h-3.5 mr-1 text-gray-400" />
              {product.comments.length}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex border-t border-gray-100">
        <Link 
          to={`/products/${product.id}`}
          className="flex items-center justify-center flex-1 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          <Eye className="w-3.5 h-3.5 mr-1" />
          View
        </Link>
        
        {canEdit && (
          <>
            <Link 
              to={`/edit-product/${product.id}`}
              className="flex items-center justify-center flex-1 py-2 text-xs font-medium text-blue-600 transition-colors border-l border-gray-100 hover:bg-blue-50"
            >
              <Edit className="w-3.5 h-3.5 mr-1" />
              Edit
            </Link>
            
            <button 
              onClick={() => onDelete && onDelete(product.id)}
              className="flex items-center justify-center flex-1 py-2 text-xs font-medium text-red-600 transition-colors border-l border-gray-100 hover:bg-red-50"
            >
              <Trash className="w-3.5 h-3.5 mr-1" />
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
