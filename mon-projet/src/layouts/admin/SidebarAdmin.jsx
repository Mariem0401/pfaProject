import React, { useState } from 'react';
import { 
  FaTachometerAlt,
  FaUsers,
  FaBoxes,
  FaTags,
  FaClipboardList,
  FaUserCog,
  FaChevronDown,
  FaChevronRight,
  FaTimes,
  FaStore,
  FaPaw
} from 'react-icons/fa';
import { useLocation, Link } from 'react-router-dom';

const SidebarAdmin = ({ isOpen, toggleSidebar }) => {
  const [expandedSections, setExpandedSections] = useState({
    products: false,
    orders: false
  });
  const location = useLocation();

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`fixed inset-y-0 left-0 w-64 bg-white text-gray-700 shadow-lg flex flex-col border-r border-gray-100 z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out rounded-tr-3xl rounded-br-3xl`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-b from-blue-50 to-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
            <FaStore className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold">
            <span className="text-blue-600">Pet</span>Admin
          </span>
        </div>
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-full hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-colors"
          aria-label="Close sidebar"
          title="Close sidebar"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4" role="navigation">
        {/* Dashboard */}
        <Link 
          to="/dashboard-admin" 
          className={`flex items-center p-3 rounded-xl mb-1 transition-all duration-200 group hover:bg-blue-50 hover:text-blue-700 transform hover:scale-[1.02] ${isActive('/dashboard-admin') ? 'bg-blue-50 text-blue-700' : ''}`}
          aria-label="Navigate to dashboard"
          title="View dashboard"
        >
          <FaTachometerAlt className={`mr-3 ${isActive('/dashboard-admin') ? 'text-blue-700' : 'text-gray-500 group-hover:text-blue-700'}`} size={20} />
          <span className="font-medium">Dashboard</span>
        </Link>

        {/* Users */}
        <Link 
          to="/gestionUser" 
          className={`flex items-center p-3 rounded-xl mb-1 transition-all duration-200 group hover:bg-blue-50 hover:text-blue-700 transform hover:scale-[1.02] ${isActive('/gestionUser') ? 'bg-blue-50 text-blue-700' : ''}`}
          aria-label="Navigate to user management"
          title="Manage users"
        >
          <FaUsers className={`mr-3 ${isActive('/gestionUser') ? 'text-blue-700' : 'text-gray-500 group-hover:text-blue-700'}`} size={20} />
          <span className="font-medium">Users</span>
        </Link>

        {/* Adoption Requests */}
        <Link 
          to="/admin/gestionDemande" 
          className={`flex items-center p-3 rounded-xl mb-1 transition-all duration-200 group hover:bg-blue-50 hover:text-blue-700 transform hover:scale-[1.02] ${isActive('/admin/gestionDemande') ? 'bg-blue-50 text-blue-700' : ''}`}
          aria-label="Navigate to adoption requests"
          title="Manage adoption requests"
        >
          <FaPaw className={`mr-3 ${isActive('/admin/gestionDemande') ? 'text-blue-700' : 'text-gray-500 group-hover:text-blue-700'}`} size={20} />
          <span className="font-medium">Adoption Requests</span>
        </Link>

        {/* Products Section */}
        <div className="mb-1">
          <button 
            onClick={() => toggleSection('products')}
            className="flex items-center justify-between p-3 rounded-xl w-full text-left hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
            aria-expanded={expandedSections.products}
            aria-label="Toggle products section"
            title="Toggle products"
          >
            <div className="flex items-center">
              <FaBoxes className="mr-3 text-gray-500 group-hover:text-blue-700" size={20} />
              <span className="font-medium">Products</span>
            </div>
            {expandedSections.products ? (
              <FaChevronDown className="text-gray-500 group-hover:text-blue-700" size={16} />
            ) : (
              <FaChevronRight className="text-gray-500 group-hover:text-blue-700" size={16} />
            )}
          </button>
          
          {expandedSections.products && (
            <div className="ml-6 mt-1 space-y-1 transition-all duration-200">
              <Link 
                to="/gestionProduit" 
                className={`flex items-center p-2 rounded-lg transition-all duration-200 ${isActive('/gestionProduit') ? 'text-blue-700' : 'hover:text-blue-700'}`}
                title="View all products"
              >
                <span className="mr-2 text-blue-700">›</span>
                <span>All Products</span>
              </Link>
              <Link 
                to="/admin/addProduit" 
                className={`flex items-center p-2 rounded-lg transition-all duration-200 ${isActive('/admin/addProduit') ? 'text-blue-700' : 'hover:text-blue-700'}`}
                title="Add a product"
              >
                <span className="mr-2 text-blue-700">›</span>
                <span>Add Product</span>
              </Link>
        
            </div>
          )}
        </div>

        {/* Annonces */}
        <Link 
          to="/admin/gestionAnnonce" 
          className={`flex items-center p-3 rounded-xl mb-1 transition-all duration-200 group hover:bg-blue-50 hover:text-blue-700 transform hover:scale-[1.02] ${isActive('/admin/gestionAnnonce') ? 'bg-blue-50 text-blue-700' : ''}`}
          aria-label="Navigate to announcements management"
          title="Manage announcements"
        >
          <FaTags className={`mr-3 ${isActive('/admin/gestionAnnonce') ? 'text-blue-700' : 'text-gray-500 group-hover:text-blue-700'}`} size={20} />
          <span className="font-medium">Announcements</span>
        </Link>

        {/* Orders Section */}
        <div className="mb-1">
          <button 
            onClick={() => toggleSection('orders')}
            className="flex items-center justify-between p-3 rounded-xl w-full text-left hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
            aria-expanded={expandedSections.orders}
            aria-label="Toggle orders section"
            title="Toggle orders"
          >
            <div className="flex items-center">
              <FaClipboardList className="mr-3 text-gray-500 group-hover:text-blue-700" size={20} />
              <span className="font-medium">Orders</span>
            </div>
            {expandedSections.orders ? (
              <FaChevronDown className="text-gray-500 group-hover:text-blue-700" size={16} />
            ) : (
              <FaChevronRight className="text-gray-500 group-hover:text-blue-700" size={16} />
            )}
          </button>
          
          {expandedSections.orders && (
            <div className="ml-6 mt-1 space-y-1 transition-all duration-200">
              <Link 
                to="/admin/gestionCommande" 
                className={`flex items-center p-2 rounded-lg transition-all duration-200 ${isActive('/admin/gestionCommande') ? 'text-blue-700' : 'hover:text-blue-700'}`}
                title="View all orders"
              >
                <span className="mr-2 text-blue-700">›</span>
                <span>All Orders</span>
              </Link>
              <Link 
                to="/orders/pending" 
                className={`flex items-center p-2 rounded-lg transition-all duration-200 ${isActive('/orders/pending') ? 'text-blue-700' : 'hover:text-blue-700'}`}
                title="View pending orders"
              >
                <span className="mr-2 text-blue-700">›</span>
                <span>Pending Orders</span>
              </Link>
              <Link 
                to="/orders/completed" 
                className={`flex items-center p-2 rounded-lg transition-all duration-200 ${isActive('/orders/completed') ? 'text-blue-700' : 'hover:text-blue-700'}`}
                title="View completed orders"
              >
                <span className="mr-2 text-blue-700">›</span>
                <span>Completed Orders</span>
              </Link>
            </div>
          )}
        </div>

        {/* Settings */}
        <Link 
          to="/settings" 
          className={`flex items-center p-3 rounded-xl mb-1 transition-all duration-200 group hover:bg-blue-50 hover:text-blue-700 transform hover:scale-[1.02] ${isActive('/settings') ? 'bg-blue-50 text-blue-700' : ''}`}
          aria-label="Navigate to settings"
          title="Manage settings"
        >
          <FaUserCog className={`mr-3 ${isActive('/settings') ? 'text-blue-700' : 'text-gray-500 group-hover:text-blue-700'}`} size={20} />
          <span className="font-medium">Settings</span>
        </Link>
      </nav>
    </div>
  );
};

export default SidebarAdmin;