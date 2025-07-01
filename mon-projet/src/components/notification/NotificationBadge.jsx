// src/components/notifications/NotificationBadge.jsx
import { BellIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationList from './NotificationList.jsx';

export default function NotificationBadge() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none"
        aria-label="Notifications"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount.user > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount.user}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationList 
          notifications={notifications.user}
          onMarkAsRead={(id) => markAsRead(id, 'user')}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}