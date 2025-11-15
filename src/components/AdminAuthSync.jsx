import { useEffect } from 'react';
import useAdminStore from '../store/adminStore';

const AdminAuthSync = () => {
  const loadFromSession = useAdminStore((state) => state.loadFromSession);

  useEffect(() => {
    loadFromSession();
  }, [loadFromSession]);

  return null;
};

export default AdminAuthSync;
