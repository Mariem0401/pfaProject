// src/components/notifications/NotificationList.jsx
export default function NotificationList({ notifications, onMarkAsRead, onClose, isAdmin = false }) {
  return (
    <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-50 ring-1 ring-black ring-opacity-5">
      <div className="py-1">
        <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100">
          {isAdmin ? 'Notifications Admin' : 'Vos Notifications'}
        </div>
        
        {notifications.length === 0 ? (
          <div className="px-4 py-3 text-sm text-gray-500">Aucune notification</div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification._id}
              className={`px-4 py-3 text-sm cursor-pointer ${!notification.lue ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
              onClick={() => {
                onMarkAsRead(notification._id);
                onClose();
                // Ajouter une navigation si nécessaire: navigate(notification.lien)
              }}
            >
              <p className="font-medium">{notification.message}</p>
              {notification.raisonRejet && (
                <p className="text-xs text-gray-500 mt-1">Raison: {notification.raisonRejet}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}