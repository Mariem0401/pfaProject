import React, { useEffect, useState } from 'react';
import { FaSearch, FaTrash, FaEye, FaSpinner } from 'react-icons/fa';
import AdminLayout from '../../layouts/admin/AdminLayout';
import axiosConfig from '../../config/axiosConfig';
import { useNavigate } from 'react-router-dom';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
  
    if (userData && userData.token) {
      const token = userData.token;
      fetchUsers(token);
    } else {
      navigate("/login");
    }
  }, [navigate]);
  
  const fetchUsers = async (token) => {
    try {
      setLoading(true);
      setError(null);
  
      const res = await axiosConfig.get('/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setUsers(res.data.data);
    } catch (err) {
      console.error('Error loading users', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (userId) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
  
    if (!userData || !userData.token) {
      navigate("/login");
      return;
    }
  
    if (!window.confirm('Are you sure you want to delete this user?')) return;
  
    try {
      await axiosConfig.delete(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      setUsers(prev => prev.filter(user => user._id !== userId));
    } catch (err) {
      console.error('Error deleting user', err);
      alert('Failed to delete user');
    }
  };
  
  const handleView = (user) => {
    navigate(`/admin/users/${user._id}`, { state: { user } });
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
          <div className="relative w-full sm:w-80 mt-4 sm:mt-0">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <FaSpinner className="animate-spin text-3xl text-blue-600" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button 
              onClick={() => fetchUsers(JSON.parse(localStorage.getItem("userData"))?.token)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr className="text-left text-gray-700 text-sm uppercase tracking-wide">
                  <th className="p-4 font-semibold">Profile</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-t border-gray-100 even:bg-gray-50 hover:bg-gray-100 transition duration-150">
                    <td className="p-4">
                      <img
                        src={user.profilePic && user.profilePic !== "/images/avatar-placeholder.png" ? user.profilePic : "https://via.placeholder.com/40"}
                        alt={`${user.name}'s profile`}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => (e.target.src = "https://via.placeholder.com/40")}
                      />
                    </td>
                    <td className="p-4 text-gray-800">{user.name}</td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => handleView(user)}
                          className="text-blue-500 hover:text-blue-700 p-1 transition"
                          title="View details"
                        >
                          <FaEye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-500 hover:text-red-700 p-1 transition"
                          title="Delete"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      {users.length === 0 
                        ? 'No users found' 
                        : 'No results match your search'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserManagementPage;