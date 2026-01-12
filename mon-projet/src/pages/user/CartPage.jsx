import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaShoppingBasket } from 'react-icons/fa';
import { useCart } from './CartContext';
import UserLayout from '../../layouts/user/UserLayout';

const CartPage = () => {
  const { 
    cart, 
    loading, 
    updateItemQuantity, 
    removeItemFromCart, 
    clearUserCart,
    refreshCart
  } = useCart();

  const [localQuantities, setLocalQuantities] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // SOLUTION URGENTE : Charger le panier au montage
  useEffect(() => {
    const loadCart = async () => {
      try {
        await refreshCart();
      } finally {
        setIsInitialLoading(false);
      }
    };
    loadCart();
  }, []);

  // Initialiser les quantités locales
  useEffect(() => {
    if (cart?.items) {
      const quantities = {};
      cart.items.forEach(item => {
        quantities[item.product._id] = item.quantity;
      });
      setLocalQuantities(quantities);
    }
  }, [cart]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setLocalQuantities(prev => ({
      ...prev,
      [productId]: newQuantity
    }));
  };

  const updateQuantity = async (productId) => {
    setIsUpdating(true);
    try {
      await updateItemQuantity(productId, localQuantities[productId]);
      await refreshCart();
    } catch (error) {
      console.error("Erreur de mise à jour", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      await removeItemFromCart(productId);
      await refreshCart();
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir vider le panier ?")) {
      await clearUserCart();
      await refreshCart();
    }
  };

  // MODIFICATION : Vérifier aussi isInitialLoading
  if (loading || isInitialLoading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </UserLayout>
    );
  }

  // MODIFICATION : Vérifier aussi cart.items
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <UserLayout>
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="inline-block p-4 bg-teal-50 rounded-full mb-4">
              <FaShoppingBasket className="text-teal-500 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Votre panier est vide</h2>
            <p className="text-gray-600 mb-6">Explorez nos produits et trouvez ce qui vous plaît</p>
            <Link 
              to="/shop" 
              className="inline-flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Retour à la boutique
            </Link>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/shop"
          className="inline-flex items-center text-teal-600 hover:text-teal-800 font-medium"
        >
          <FaArrowLeft className="mr-2" /> Retour au boutique
        </Link>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Liste des produits */}
          <div className="md:w-2/3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800">Votre Panier ({cart.items.length})</h1>
              </div>
              
              <div className="divide-y divide-gray-100">
                {cart.items.map(item => (
                  <div key={item.product._id} className="p-6 cart-item">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <img 
                          src={item.product.image || '/placeholder-product.jpg'} 
                          alt={item.product.name} 
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-medium text-gray-800">{item.product.name}</h3>
                          <button 
                            onClick={() => handleRemoveItem(item.product._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </div>
                        
                        <p className="text-gray-600 mt-1">{item.product.price.toFixed(2)} DT</p>
                        
                        <div className="mt-4 flex items-center">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button 
                              onClick={() => handleQuantityChange(item.product._id, localQuantities[item.product._id] - 1)}
                              disabled={localQuantities[item.product._id] <= 1}
                              className="px-3 py-1 bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
                            >
                              <FaMinus className="text-gray-600" />
                            </button>
                            <input
                              type="number"
                              value={localQuantities[item.product._id] || 0}
                              onChange={(e) => handleQuantityChange(item.product._id, parseInt(e.target.value) || 1)}
                              min="1"
                              className="w-12 text-center border-x border-gray-200 py-1"
                            />
                            <button 
                              onClick={() => handleQuantityChange(item.product._id, localQuantities[item.product._id] + 1)}
                              className="px-3 py-1 bg-gray-50 hover:bg-gray-100"
                            >
                              <FaPlus className="text-gray-600" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => updateQuantity(item.product._id)}
                            disabled={isUpdating || localQuantities[item.product._id] === item.quantity}
                            className={`ml-4 px-3 py-1 text-sm rounded ${isUpdating || localQuantities[item.product._id] === item.quantity ? 'bg-gray-200 text-gray-400' : 'bg-teal-100 text-teal-700 hover:bg-teal-200'}`}
                          >
                            {isUpdating ? 'En cours...' : 'Mettre à jour'}
                          </button>
                        </div>
                      </div>
                      
                      <div className="sm:text-right">
                        <p className="text-lg font-semibold text-gray-800">
                          {(item.product.price * item.quantity).toFixed(2)} DT
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Récapitulatif */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Récapitulatif</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">{cart.totalPrice.toFixed(2)} DT</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-medium">Gratuite</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg text-teal-600">{cart.totalPrice.toFixed(2)} DT</span>
                  </div>
                </div>
                
                <div className="space-y-3 pt-4">
                  <button
                    onClick={handleClearCart}
                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium"
                  >
                    Vider le panier
                  </button>
                  <Link
                    to="/user/commandeDetails"
                    className="block w-full py-3 bg-teal-600 hover:bg-teal-700 text-white text-center rounded-lg font-medium shadow-md"
                  >
                    Passer la commande
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default CartPage;