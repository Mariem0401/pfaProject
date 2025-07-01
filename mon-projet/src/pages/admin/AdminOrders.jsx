import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../layouts/admin/AdminLayout';
import { 
  FaArrowLeft, 
  FaBox, 
  FaCalendarAlt,
  FaShippingFast,
  FaCheckCircle,
  FaClock,
  FaFilter,
  FaEye,
  FaSearch
} from 'react-icons/fa';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    try {
      const storedUser = localStorage.getItem('userData');
      if (!storedUser) {
        setError('Vous devez être connecté pour voir les commandes.');
        setLoading(false);
        return;
      }

      const { token } = JSON.parse(storedUser);
      const response = await axios.get('http://localhost:7777/commandes/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data.commandes);
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors de la récupération des commandes :', err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la récupération des commandes.');
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const storedUser = localStorage.getItem('userData');
      if (!storedUser) {
        setError('Vous devez être connecté pour modifier le statut.');
        return;
      }

      const { token } = JSON.parse(storedUser);
      await axios.patch(
        `http://localhost:7777/commandes/${orderId}`,
        { statut: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Mise à jour optimiste de l'interface
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, statut: newStatus } : order
      ));
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut :', err);
      alert(err.response?.data?.message || 'Une erreur est survenue lors de la mise à jour du statut.');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user?.name && order.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.user?.email && order.user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      filter === 'all' || 
      order.statut === filter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusStyles = (status) => {
    switch(status) {
      case 'en attente':
        return {
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          dotColor: 'bg-yellow-500'
        };
      case 'en cours':
        return {
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
          dotColor: 'bg-blue-500'
        };
      case 'livrée':
        return {
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          dotColor: 'bg-green-500'
        };
      case 'annulée':
        return {
          bgColor: 'bg-red-50',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          dotColor: 'bg-red-500'
        };
      default:
        return {
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          dotColor: 'bg-gray-500'
        };
    }
  };

  const getStatusDisplay = (status) => {
    switch(status) {
      case 'en attente': return 'PENDING';
      case 'en cours': return 'PROCESSING';
      case 'livrée': return 'COMPLETED';
      case 'annulée': return 'CANCELLED';
      default: return 'UNKNOWN';
    }
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-red-600 mb-3">{error}</h2>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Retour à l'accueil
          </Link>
        </div>
      </AdminLayout>
    );
  }

  if (!orders.length) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Aucune commande trouvée</h2>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Retour à l'accueil
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">liste des Commandes </h1>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <FaBox className="mr-2" /> Tous les commandes 
            </button>
            <button
              onClick={() => setFilter('en attente')}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${filter === 'en attente' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <FaClock className="mr-2" /> en_attente
            </button>
            <button
              onClick={() => setFilter('en cours')}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${filter === 'en cours' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <FaShippingFast className="mr-2" /> en_cours
            </button>
            <button
              onClick={() => setFilter('livrée')}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${filter === 'livrée' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <FaCheckCircle className="mr-2" /> Livrée
            </button>
          </div>

          <div className="relative flex-1 min-w-[200px] max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
           
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
               
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order, index) => {
                  const statusStyles = getStatusStyles(order.statut);
                  
                  return (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">#{order._id.slice(-6)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.user?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.totalPrice.toFixed(2)} DT
                      </td>
                     
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.statut}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`text-xs px-3 py-1 rounded-full border ${statusStyles.bgColor} ${statusStyles.textColor} ${statusStyles.borderColor}`}
                        >
                          <option value="en attente" className="bg-yellow-50 text-yellow-800">PENDING</option>
                          <option value="en cours" className="bg-blue-50 text-blue-800">PROCESSING</option>
                          <option value="livrée" className="bg-green-50 text-green-800">COMPLETED</option>
                          <option value="annulée" className="bg-red-50 text-red-800">CANCELLED</option>
                        </select>
                      </td>
                     
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-block p-4 bg-gray-100 rounded-full mb-3">
                <FaSearch className="text-gray-400 text-xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">No orders found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your filter criteria</p>
            </div>
          )}

          <div className="px-6 py-4 bg-gray-50 text-right text-sm text-gray-500">
            Last {orders.length} Days
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;