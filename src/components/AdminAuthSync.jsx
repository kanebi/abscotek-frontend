import { useEffect } from 'react';
import useAdminStore from '../store/adminStore';

const AdminAuthSync = () => {
  const loadFromStorage = useAdminStore((state) => state.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return null;
};

export default AdminAuthSync;
