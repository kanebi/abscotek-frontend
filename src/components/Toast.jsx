import React, { useEffect } from 'react';
import useNotificationStore from '../store/notificationStore';

const Toast = () => {
  const { notifications, removeNotification } = useNotificationStore();

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        removeNotification(notifications[0].id);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notifications, removeNotification]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-white flex items-center justify-between gap-3 min-w-[300px] ${
            n.type === 'error' 
              ? 'bg-red-600 border border-red-500' 
              : n.type === 'success'
              ? 'bg-green-600 border border-green-500'
              : 'bg-blue-600 border border-blue-500'
          }`}
        >
          <span className="flex-1">{n.message}</span>
          <button
            onClick={() => removeNotification(n.id)}
            className="text-white hover:text-gray-200 text-lg font-bold ml-2"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
