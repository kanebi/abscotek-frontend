import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../config/routes';

function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to user profile with order ID as query parameter
    if (id) {
      navigate(`${AppRoutes.userProfile.path}?orderId=${id}`, { replace: true });
    } else {
      // If no order ID, redirect to user profile
      navigate(AppRoutes.userProfile.path, { replace: true });
    }
  }, [id, navigate]);

  // This component will redirect immediately, so we don't need to render anything
  return null;
}

export default OrderDetailsPage; 