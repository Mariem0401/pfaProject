import React from 'react';
import AdminLayout from '../../layouts/admin/AdminLayout';
import useAdminStats from '../../hooks/useAdminStats';
import StatCard from '../../components/Chart/StatCard';
import { FiRefreshCw, FiAlertCircle, FiUsers, FiShoppingCart, FiDollarSign, FiFileText, FiStar } from 'react-icons/fi';
import RevenueChart from '../../components/Chart/RevenueChart';
import UserActivityChart from '../../components/Chart/UserActivityChart';
import BarChart from '../../components/Chart/BarChart';

const DashboardAdmin = () => {
  const { 
    loading, 
    error, 
    stats, 
    userActivity, 
    productsSales,
    bestSeller,
    refetch 
  } = useAdminStats();

  return (
    <AdminLayout>
      <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <button 
            onClick={refetch}
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-50"
            disabled={loading}
          >
            <FiRefreshCw className={`${loading ? 'animate-spin' : ''} text-blue-600`} />
            <span className="text-gray-700">Rafraîchir</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-start space-x-3">
            <FiAlertCircle className="text-xl mt-0.5" />
            <div>
              <p className="font-semibold">Erreur de chargement</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && stats && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Utilisateurs" 
                value={stats.users} 
                trend={`${stats.users > 0 ? '+0%' : '0%'} ce mois`}
                icon={<FiUsers className="text-blue-600" />}
                color="blue"
              />
              <StatCard 
                title="Produits" 
                value={stats.products} 
                trend={`${stats.products > 0 ? '+0%' : '0%'} cette semaine`}
                icon={<FiFileText className="text-purple-600" />}
                color="purple"
              />
              <StatCard 
                title="Commandes" 
                value={stats.orders} 
                trend={`${stats.orders > 0 ? '+0%' : '0%'} aujourd'hui`}
                icon={<FiShoppingCart className="text-green-600" />}
                color="green"
              />
              <StatCard 
                title="Revenus (DT)" 
                value={stats.revenue} 
                trend={`${stats.revenue > 0 ? '+0%' : '0%'} ce mois`}
                icon={<FiDollarSign className="text-orange-600" />}
                color="orange"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                <h3 className="font-semibold text-gray-800 mb-4 text-lg">Top 10 Produits</h3>
                {productsSales ? (
                  <BarChart data={productsSales} />
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    {loading ? (
                      <div className="animate-pulse text-gray-400">Chargement...</div>
                    ) : (
                      <div className="text-gray-400">Aucune donnée disponible</div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative">
                <h3 className="font-semibold text-gray-800 mb-6 text-lg text-center">Meilleur Produit</h3>
                {bestSeller ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative group">
                      {bestSeller.photo ? (
                        <img 
                          src={bestSeller.photo} 
                          alt={bestSeller.name}
                          className="w-48 h-48 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                          <FiStar className="text-6xl text-yellow-500" />
                        </div>
                      )}
                      <span className="absolute -top-2 -right-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1 shadow-sm">
                        <FiStar className="text-sm" />
                        <span>Top</span>
                      </span>
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 text-center">{bestSeller.name}</h4>
                    <p className="text-gray-600 text-center">
                      <span className="font-semibold text-teal-600">{bestSeller.unitsSold}</span> ventes
                    </p>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    {loading ? 'Chargement...' : 'Aucun best seller identifié'}
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                <h3 className="font-semibold text-gray-800 mb-4 text-lg">Revenus Hebdomadaires</h3>
                <RevenueChart data={stats.weeklyRevenue || { categories: [], series: [] }} />
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                <h3 className="font-semibold text-gray-800 mb-4 text-lg">Activité des Utilisateurs</h3>
                <UserActivityChart 
                  data={userActivity || { 
                    categories: ['Total', 'Actifs', 'Nouveaux'],
                    series: [stats.users || 0, 0, 0] 
                  }} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DashboardAdmin;