// Function to add a new product
export const addProduct = (product: any) => {
  // Get existing products from localStorage
  const storedProducts = localStorage.getItem('tradehub-products');
  const products = storedProducts ? JSON.parse(storedProducts) : [];

  // Add the new product
  products.push(product);

  // Save the updated products array back to localStorage
  localStorage.setItem('tradehub-products', JSON.stringify(products));
};

// Function to retrieve all products
export const getAllProducts = () => {
  const storedProducts = localStorage.getItem('tradehub-products');
  return storedProducts ? JSON.parse(storedProducts) : [];
};

// Function to retrieve a single product by ID
export const getProductById = (id: string) => {
  const storedProducts = localStorage.getItem('tradehub-products');
  const products = storedProducts ? JSON.parse(storedProducts) : [];
  return products.find((product: any) => product.id === id);
};

// Function to update an existing product
export const updateProduct = (id: string, updatedProduct: any) => {
  const storedProducts = localStorage.getItem('tradehub-products');
  let products = storedProducts ? JSON.parse(storedProducts) : [];

  // Find the index of the product to update
  const index = products.findIndex((product: any) => product.id === id);

  if (index !== -1) {
    // Update the product
    products[index] = { ...products[index], ...updatedProduct };

    // Save the updated products array back to localStorage
    localStorage.setItem('tradehub-products', JSON.stringify(products));
    return true; // Indicate success
  } else {
    return false; // Indicate failure (product not found)
  }
};

// Function to delete a product by ID
export const deleteProduct = (id: string) => {
  const storedProducts = localStorage.getItem('tradehub-products');
  let products = storedProducts ? JSON.parse(storedProducts) : [];

  // Filter out the product to delete
  products = products.filter((product: any) => product.id !== id);

  // Save the updated products array back to localStorage
  localStorage.setItem('tradehub-products', JSON.stringify(products));
};

// Add this function to fetch products by user ID
export const fetchUserProducts = (userId: string) => {
  // Get products from localStorage
  const storedProducts = localStorage.getItem('tradehub-products');
  const products = storedProducts ? JSON.parse(storedProducts) : [];
  
  // Filter products by user ID
  return products.filter((product: any) => product.userId === userId);
};
