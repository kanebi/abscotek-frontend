import { create } from 'zustand';

const useNotificationStore = create((set) => ({
  notifications: [],
  addNotification: (message, type = 'info') => {
    const notification = {
      id: Date.now() + Math.random(),
      message,
      type,
    };
    set((state) => ({
      notifications: [...state.notifications, notification],
    }));
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));

export default useNotificationStore;
