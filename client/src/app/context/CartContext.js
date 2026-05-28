"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { ProductApi } from "../lib/ProductApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);

  // Load guest cart from localStorage
  const loadGuestCart = () => {
    try {
      const local = JSON.parse(localStorage.getItem("guest_cart")) || [];
      return Array.isArray(local) ? local : [];
    } catch {
      return [];
    }
  };

  const saveGuestCart = (cart) => {
    localStorage.setItem("guest_cart", JSON.stringify(cart));
  };

  // Fetch cart (guest or user)
  const fetchCart = async () => {
    if (!user) {
      setCartItems(loadGuestCart());
      return;
    }
    try {
      const res = await ProductApi.getCart();
      setCartItems(res?.cart?.items || []);
      const guestCart = loadGuestCart();
      if (guestCart.length > 0) {
        for (let g of guestCart) {
          await ProductApi.addToCart(g.productId, g.quantity, g.variant);
        }
        localStorage.removeItem("guest_cart");
        fetchCart();
      }
    } catch (err) {
      console.error("Cart fetch error:", err);
      setCartItems([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // ADD TO CART (with variant support)
 const addToCart = async (productId, quantity = 1, variant = null) => {
  try {
    if (!user) {
      // GUEST CART: replace existing variant or add new
      let cart = loadGuestCart();
      const existingIndex = cart.findIndex(item => item.productId === productId);
      
      if (existingIndex !== -1) {
        const existing = cart[existingIndex];
        const sameVariant = JSON.stringify(existing.variant) === JSON.stringify(variant);
        if (sameVariant) {
          // Same variant → update quantity
          cart[existingIndex].quantity = quantity;
        } else {
          // Different variant → replace the whole item
          cart[existingIndex] = { productId, quantity, variant };
        }
      } else {
        cart.push({ productId, quantity, variant });
      }
      
      saveGuestCart(cart);
      setCartItems(cart);
      setIsCartOpen(true);
      return toast.success("Cart updated!");
    }

    // LOGGED-IN USER: call backend with replacement logic
    const res = await ProductApi.addToCartWithReplace(productId, quantity, variant);
    setCartItems(res?.cart?.items || []);
    setIsCartOpen(true);
    toast.success("Cart updated!");
  } catch (err) {
    toast.error(err?.message || "Failed to update cart");
  }
};
  // Update quantity (supports variant – we need to identify item by both productId and variant)
  // Update quantity using item ID
const updateQuantity = async (itemId, quantity) => {
  if (quantity <= 0) return removeFromCart(itemId);
  
  try {
    if (!user) {
      let cart = loadGuestCart();
      const item = cart.find(i => i._id === itemId);
      if (item) {
        item.quantity = quantity;
        saveGuestCart(cart);
        setCartItems(cart);
      }
      return;
    }
    
    const res = await ProductApi.updateCartItem(itemId, quantity);
    setCartItems(res?.cart?.items || []);
  } catch (err) {
    toast.error(err?.message || "Failed to update");
  }
};

// Remove using item ID
const removeFromCart = async (itemId) => {
  try {
    if (!user) {
      let cart = loadGuestCart().filter(item => item._id !== itemId);
      saveGuestCart(cart);
      setCartItems(cart);
      toast.success("Item removed");
      return;
    }
    
    const res = await ProductApi.removeFromCart(itemId);
    setCartItems(res?.cart?.items || []);
    toast.success("Removed item");
  } catch (err) {
    toast.error(err?.message || "Failed to remove");
  }
};

  

  const clearCart = async () => {
    try {
      if (!user) {
        localStorage.removeItem("guest_cart");
        setCartItems([]);
        return;
      }
      await ProductApi.clearCart();
      setCartItems([]);
    } catch (err) {
      console.error("Failed to clear cart", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        fetchCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);