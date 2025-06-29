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
          className={`px-4 py-2 rounded shadow text-white ${n.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
};

export default Toast;
