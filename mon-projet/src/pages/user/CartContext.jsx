// context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  clearCart as apiClearCart
} from "../../api/cartApi.jsx"; // Ensure this path is correct

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0); // total des quantités
  const [error, setError] = useState(null);

  // Helper function to calculate total items from a cart object
  const calculateTotalItems = (cartData) => {
    if (!cartData || !cartData.items) {
      return 0;
    }
    return cartData.items.reduce((acc, item) => acc + item.quantity, 0);
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await getCart();
      setCart(data);
      // Update cartCount immediately after fetching cart data
      setCartCount(calculateTotalItems(data));
    } catch (err) {
      setError(err.message);
      if (err.message.includes('Panier vide') || err.response?.status === 404) { // Add check for 404 if API returns it for empty cart
        setCart({ items: [], totalPrice: 0 });
        setCartCount(0); // Set count to 0 for empty cart
      } else {
        // Handle other errors, maybe set cart to null or provide a default empty structure
        setCart(null);
        setCartCount(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const addItemToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await apiAddToCart(productId, quantity);
      setCart(data);
      setCartCount(calculateTotalItems(data)); // Update cartCount
      return { success: true };
    } catch (error) {
      console.error("Error adding item to cart:", error);
      return { success: false, message: error.message || "Failed to add item to cart" };
    }
  };

  const updateItemQuantity = async (productId, quantity) => {
    try {
      const { data } = await apiUpdateCartItem(productId, quantity);
      setCart(data);
      setCartCount(calculateTotalItems(data)); // Update cartCount
      return { success: true };
    } catch (error) {
      console.error("Error updating item quantity:", error);
      return { success: false, message: error.message || "Failed to update item quantity" };
    }
  };

  const removeItemFromCart = async (productId) => {
    try {
      const { data } = await apiRemoveCartItem(productId);
      setCart(data);
      setCartCount(calculateTotalItems(data)); // Update cartCount
      return { success: true };
    } catch (error) {
      console.error("Error removing item from cart:", error);
      return { success: false, message: error.message || "Failed to remove item from cart" };
    }
  };

  const clearUserCart = async () => {
    try {
      await apiClearCart();
      setCart({ items: [], totalPrice: 0 }); // Set cart to empty state
      setCartCount(0); // Set cartCount to 0
      return { success: true };
    } catch (error) {
      console.error("Error clearing cart:", error);
      return { success: false, message: error.message || "Failed to clear cart" };
    }
  };

  // Initial fetch of the cart when the component mounts
  useEffect(() => {
    fetchCart();
  }, []);

  // Use a separate useEffect to update cartCount whenever the 'cart' state changes.
  // This is a robust way to ensure cartCount is always in sync,
  // especially if 'cart' might be updated by other means or initial fetch.
  useEffect(() => {
    setCartCount(calculateTotalItems(cart));
  }, [cart]); // Dependency array: run this effect whenever 'cart' changes

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        cartCount, // This is now correctly updated
        addItemToCart,
        updateItemQuantity,
        removeItemFromCart,
        clearUserCart,
        refreshCart: fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};