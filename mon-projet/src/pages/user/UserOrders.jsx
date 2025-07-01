
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserLayout from '../../layouts/user/UserLayout';
import { FaArrowLeft, FaBox, FaCalendarAlt, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import axios from 'axios';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const storedUser = localStorage.getItem('userData');
        if (!storedUser) {
          setError('Vous devez être connecté pour voir vos commandes.');
          setLoading(false);
          return;
        }

        const { token } = JSON.parse(storedUser);
        const response = await axios.get('http://localhost:7777/commandes/mes-commandes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data.commandes);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des commandes :', err);
        setError(err.response?.data?.message || 'Une erreur est survenue lors de la récupération de vos commandes.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-red-600 mb-3">{error}</h2>
          <Link
            to="/shop"
            className="inline-flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Retour à la boutique
          </Link>
        </div>
      </UserLayout>
    );
  }

  if (!orders.length) {
    return (
      <UserLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Vous n'avez pas encore passé de commande</h2>
          <Link
            to="/shop"
            className="inline-flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Retour à la boutique
          </Link>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Mes Commandes</h1>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {orders.map((order) => (
            <div key={order._id} className="border-b border-gray-200 py-4 last:border-b-0">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  Commande #{order._id.slice(-6)}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.statut === 'en attente'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.statut === 'en cours'
                      ? 'bg-blue-100 text-blue-800'
                      : order.statut === 'livrée'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {order.statut}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="flex items-center text-gray-600 mb-1">
                    <FaCalendarAlt className="mr-2" />
                    Date: {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="flex items-center text-gray-600 mb-1">
                    <FaDollarSign className="mr-2" />
                    Total: {order.totalPrice.toFixed(2)} DT
                  </p>
                  <p className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-2" />
                    Adresse: {order.detailsCommande.adresse}, {order.detailsCommande.ville},{' '}
                    {order.detailsCommande.gouvernorat}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Articles :</h3>
                  <ul className="list-disc list-inside">
                    {order.items.map((item) => (
                      <li key={item.product._id} className="text-gray-600">
                        {item.product.name} x {item.quantity} -{' '}
                        {(item.product.price * item.quantity).toFixed(2)} DT
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </UserLayout>
  );
};

export default UserOrders;