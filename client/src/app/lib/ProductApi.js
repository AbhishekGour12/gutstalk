import api from "./api";

export const ProductApi = {
  // ============== PRODUCT CRUD ==============
  getProducts: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '' && filters[key] !== null) {
          queryParams.append(key, filters[key]);
        }
      });
      const response = await api.get(`product/products?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`product/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
  },

  createProduct: async (formData) => {
    try {
      const response = await api.post('product/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create product');
    }
  },

  updateProduct: async (id, formData) => {
    try {
      const response = await api.put(`product/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update product');
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`product/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete product');
    }
  },

  deleteMultipleProducts: async (productIds) => {
    try {
      const response = await api.delete('product/bulk-delete', {
        data: { productIds }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete products');
    }
  },

  // ============== BULK UPLOAD (manual) ==============
  bulkAddProducts: async (formData) => {
    try {
      const response = await api.post('product/products/bulk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to bulk add products');
    }
  },

  // ============== PUBLIC ROUTES ==============
  getProductBySlug: async (slug) => {
    try {
      const response = await api.get(`product/products/slug/${slug}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
  },

  // ============== COMMENTS ==============
  getProductComments: async (productId) => {
    try {
      const response = await api.get(`product/comments/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch comments');
    }
  },

  addComment: async (productId, data) => {
    try {
      const response = await api.post(`product/comments/${productId}`, data, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add comment');
    }
  },

  likeComment: async (commentId) => {
    try {
      const response = await api.post(`product/comments/${commentId}/like`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to like comment');
    }
  },

  deleteComment: async (commentId) => {
    try {
      const response = await api.delete(`product/comments/${commentId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete comment');
    }
  },

  // ============== SIMPLE CATEGORIES (optional) ==============
  getCategories: async () => {
    try {
      const response = await api.get('product/categories');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  },

  addCategory: async (data) => {
    try {
      const response = await api.post('product/categories', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add category');
    }
  },

  updateCategory: async (id, data) => {
    try {
      const response = await api.put(`product/categories/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update category');
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`product/categories/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
  },
  // Cart method
  getCart: async () => {
  const response = await api.get('/cart');
  return response.data;
},

 addToCart: async (productId, quantity) => {
  const response = await api.post('/cart', {productId: productId, quantity:  quantity});
  return response.data;
},

updateCartItem: async (itemId, quantity) => {
  const response = await api.put(`/cart/${itemId}`, {quantity});
  return response.data;
},

 removeFromCart: async (itemId) => {
  const response = await api.delete(`/cart/${itemId}`);
  return response.data;
},
  clearCart: async () => {
  const response = await api.delete('/cart');
  return response.data;
},
// User Interest methods
 addUserInterest: async (productId) => {
  const response = await api.post('/user-interests', {productId: productId},{
  
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    
  });
  return response.data;
},

 removeUserInterest: async (productId) => {
  const response = await api.delete(`/user-interests/${productId}`, {
    
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
},

checkUserInterest: async (productId) => {
  const response = await api.get(`/user-interests/${productId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
},

getProductLikesCount: async (slug) => {
  const response = await api.get(`/user-interests/likeCount/${slug}`);
  return response.data;
},

// Rating methods
submitRating: async(data) => {
  
  const response = await api.post(`/ratings/product/${data.productId}`, data, {
    
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
   
  });
  return response.data;
},

 getProductRatings: async (productId) => {
  const response = await api.get(`/ratings/product/${productId}`);
  return response.data.reviews;
},
getShippingCharges: async (data) =>{
  const response = await api.post("/shipping/charge", data);
  return response.data;
},
 getDashboardStats: async () => {
    const res = await api.get('/admin/dashboard/stats');
    return res.data;
  },

};

export default ProductApi;