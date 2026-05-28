import Cart from '../Models/Carts.js';
import {Product} from '../Models/Product.js';
import mongoose from 'mongoose';

const resolveProductId = async (identifier) => {
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    return identifier;
  }
  const product = await Product.findOne({ slug: identifier }).select('_id');
  if (!product) throw new Error(`Product not found for slug: ${identifier}`);
  return product._id;
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let { productId, quantity, variant } = req.body; // 👈 accept variant
     
    // Resolve product identifier (slug or ObjectId)
    const resolvedProductId = await resolveProductId(productId);

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Find existing item with same product and same variant
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === resolvedProductId.toString() &&
        JSON.stringify(item.variant) === JSON.stringify(variant)
    );

    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: resolvedProductId,
        quantity,
        variant: variant || null,
      });
    }

    // Recalculate totalAmount (pre-save hook will run)
    await cart.save();

    const populatedCart = await Cart.findOne({ userId }).populate("items.product");
    res.json({ message: "Item added", cart: populatedCart });
  } catch (err) {
    console.error("addToCart error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;           // ✅ Changed from productId
    const { quantity } = req.body;           // No need for variant

    if (!itemId) return res.status(400).json({ message: "Missing itemId" });
    const q = Number(quantity);
    if (isNaN(q)) return res.status(400).json({ message: "Invalid quantity" });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (q <= 0) {
      // Remove item if quantity is 0 or negative
      item.deleteOne();
    } else {
      item.quantity = q;
    }

    await cart.save();
    await cart.populate("items.product");
    res.json({ cart });
  } catch (error) {
    console.error("updateCartItem error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add this new route before the existing addToCart
export const addToCartWithReplace = async (req, res) => {
  try {
    const userId = req.user.id;
    let { productId, quantity, variant } = req.body;
    const resolvedProductId = await resolveProductId(productId);
    
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });
    
    // Find existing item with same product (any variant)
    const existingIndex = cart.items.findIndex(
      item => item.product.toString() === resolvedProductId.toString()
    );
    
    if (existingIndex !== -1) {
      const existingVariant = cart.items[existingIndex].variant;
      const sameVariant = JSON.stringify(existingVariant) === JSON.stringify(variant);
      
      if (sameVariant) {
        // Same variant → update quantity
        cart.items[existingIndex].quantity = quantity;
      } else {
        // Different variant → replace
        cart.items[existingIndex] = {
          product: resolvedProductId,
          quantity,
          variant: variant || null,
        };
      }
    } else {
      cart.items.push({
        product: resolvedProductId,
        quantity,
        variant: variant || null,
      });
    }
    
    await cart.save();
    const populated = await Cart.findOne({ userId }).populate("items.product");
    res.json({ cart: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;           // ✅ Changed from productId

    if (!itemId) return res.status(400).json({ message: "Missing itemId" });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.deleteOne();
    await cart.save();
    await cart.populate("items.product");
    res.json({ cart });
  } catch (error) {
    console.error("removeFromCart error:", error);
    res.status(500).json({ message: error.message });
  }
};

// clearCart and getCart remain unchanged (but getCart already populates product)
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = [];
    await cart.save();
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ userId }).populate("items.product");
    if (cart) {
      cart.items = cart.items.filter(item => item.product !== null);
      await cart.save();
    }
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};