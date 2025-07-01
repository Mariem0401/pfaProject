import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';


const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {

  const [notifications, setNotifications] = useState({
    user: [],
    admin: []
  });
  const [unreadCount, setUnreadCount] = useState({
    user: 0,
    admin: 0
  });

  const fetchNotifications = async (type) => {
    try {
      const res = await axios.get(`/api/notifications/${type}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      setNotifications(prev => ({ ...prev, [type]: res.data }));
      setUnreadCount(prev => ({ 
        ...prev, 
        [type]: res.data.filter(n => !n.lue).length 
      }));
    } catch (err) {
      console.error(`Failed to fetch ${type} notifications:`, err);
    }
  };

  const markAsRead = async (id, type) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      setNotifications(prev => ({
        ...prev,
        [type]: prev[type].map(n => 
          n._id === id ? { ...n, lue: true } : n
        )
      }));
      
      setUnreadCount(prev => ({
        ...prev,
        [type]: prev[type] - 1
      }));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications('user');
      if (user.isAdmin) {
        fetchNotifications('admin');
        const interval = setInterval(() => fetchNotifications('admin'), 60000);
        return () => clearInterval(interval);
      }
    }
  }, [user]);

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount,
      fetchNotifications,
      markAsRead
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);