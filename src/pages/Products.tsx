
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Product } from '../types';
import { getApprovedProducts } from '../services/productService';
import { Button } from '@/components/ui/button';
import ProductCard from '../components/ProductCard';
import { PlusCircle, Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';

// Get unique categories from products
const getCategories = (products: Product[]) => {
  const categories = products.map(product => product.category);
  return ['All', ...Array.from(new Set(categories))];
};

const Products: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Only load approved products
        const approvedProducts = await getApprovedProducts();
        setProducts(approvedProducts);
        setFilteredProducts(approvedProducts);
        setCategories(getCategories(approvedProducts));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  useEffect(() => {
    let result = [...products];
    
    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.title.toLowerCase().includes(term) || 
        product.description.toLowerCase().includes(term)
      );
    }
    
    // Sort products
    switch (sortOption) {
      case 'priceAsc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      default:
        break;
    }
    
    setFilteredProducts(result);
    
  }, [products, selectedCategory, searchTerm, sortOption]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };
  
  const handleSortSelect = (option: string) => {
    setSortOption(option);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="mt-2 text-gray-600">Browse all items available for purchase</p>
          </div>
          
          {isAuthenticated && (
            <Button className="mt-4 sm:mt-0" asChild>
              <Link to="/add-product">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Product
              </Link>
            </Button>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Categories</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {categories.map((category) => (
                    <DropdownMenuItem 
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                    >
                      <span className={selectedCategory === category ? "font-bold" : ""}>
                        {category}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => handleSortSelect('newest')}>
                    <span className={sortOption === 'newest' ? "font-bold" : ""}>
                      Newest
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortSelect('oldest')}>
                    <span className={sortOption === 'oldest' ? "font-bold" : ""}>
                      Oldest
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortSelect('priceAsc')}>
                    <span className={sortOption === 'priceAsc' ? "font-bold" : ""}>
                      Price: Low to High
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortSelect('priceDesc')}>
                    <span className={sortOption === 'priceDesc' ? "font-bold" : ""}>
                      Price: High to Low
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center bg-white border rounded-lg shadow-sm">
            <p className="text-gray-600 mb-4">No products found matching your criteria</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
            >
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
