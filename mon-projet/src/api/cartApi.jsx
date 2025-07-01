import axios from 'axios';

const API_URL = 'http://localhost:7777/panier';

const getAuthHeader = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  return {
    headers: {
      Authorization: `Bearer ${userData?.token}`,
    },
  };
};

export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await axios.post(
      `${API_URL}`,
      { productId, quantity },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getCart = async () => {
  try {
    const response = await axios.get(`${API_URL}`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateCartItem = async (productId, quantity) => {
    try {
      const response = await axios.patch(
        `${API_URL}/${productId}`,
        { quantity },
        getAuthHeader()
      );
      
      if (response.status !== 200) {
        throw new Error(response.data?.message || 'Échec de la mise à jour');
      }
      
      return response.data;
    } catch (error) {
      console.error('Erreur updateCartItem:', {
        productId,
        quantity,
        error: error.response?.data || error.message
      });
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du panier');
    }
  };
  
  export const removeCartItem = async (productId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${productId}`,
        getAuthHeader()
      );
  
      if (response.status === 404) {
        throw new Error('Produit non trouvé dans le panier');
      }
  
      if (response.status !== 200) {
        throw new Error(response.data?.message || 'Échec de la suppression');
      }
  
      return response.data;
  
    } catch (error) {
      console.error('Erreur removeCartItem:', {
        productId,
        error: error.response?.data || error.message
      });
  
      // Gestion spécifique des erreurs 404
      if (error.response?.status === 404) {
        throw new Error('Ce produit n\'est pas dans votre panier');
      }
  
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du produit');
    }
  };

export const clearCart = async () => {
  try {
    const response = await axios.post(`${API_URL}/clear`,{}, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
