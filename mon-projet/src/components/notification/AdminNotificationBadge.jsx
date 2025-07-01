import { useNotifications } from '../contexts/NotificationContext';

export default function AdminNotificationBadge() {
  const { adminNotifications, adminUnreadCount, markAdminAsRead } = useNotifications();

  return (
    <div className="relative">
    <button 
      onClick={() => setIsOpen(!isOpen)}
      className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
    >
      <BellIcon className="h-6 w-6" />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </button>

    {isOpen && (
      <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-10">
        <div className="py-1">
          {notifications.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-700">Aucune notification</div>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification._id} 
                onClick={() => {
                  markAsRead(notification._id);
                  // navigation vers le lien si nécessaire
                }}
                className={`px-4 py-2 text-sm cursor-pointer ${!notification.lue ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
              >
                <p className="font-medium">{notification.message}</p>
                {notification.raisonRejet && (
                  <p className="text-xs text-gray-500">Raison: {notification.raisonRejet}</p>
                )}
                <p className="text-xs text-gray-400">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    )}
  </div>
);
}