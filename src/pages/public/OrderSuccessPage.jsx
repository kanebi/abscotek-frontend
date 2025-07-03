import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import Layout from '../../components/Layout';
import { AppRoutes } from '../../config/routes';

function OrderSuccessPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  // Generate order number if not provided
  const orderNumber = orderId || '13578667';

  const handleCheckOrderDetails = () => {
    navigate(AppRoutes.userOrders.path);
  };

  return (
    <div className="min-h-screen bg-neutral-900 overflow-hidden">
      <Layout>
        {/* Main Content */}
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] px-4 py-8">
          <div className="flex flex-col justify-start items-center gap-8 max-w-md md:max-w-lg lg:max-w-xl">
            {/* Success Message */}
            <div className="flex flex-col justify-start items-center gap-8">
              <div className="flex flex-col justify-start items-center gap-3">
                {/* Thank You Title */}
                <div className="text-center">
                  <span className="text-gray-200 text-2xl md:text-3xl font-bold font-['Mona_Sans'] leading-8 md:leading-10">
                    THANK YOU FOR<br/>YOUR ORDER{' '}
                  </span>
                  <span className="text-fuchsia-700 text-2xl md:text-3xl font-bold font-['Mona_Sans'] leading-8 md:leading-10">
                    #{orderNumber}
                  </span>
                </div>
                
                {/* Delivery Information */}
                <div className="flex flex-col justify-start items-center gap-1">
                  <div className="text-center text-white text-base font-semibold font-['Mona_Sans'] leading-normal">
                    ESTIMATED DELIVERY
                  </div>
                  <div className="text-white text-base font-normal font-['Mona_Sans'] leading-normal">
                    3-7 working days
                  </div>
                </div>
                
                {/* Confirmation Text */}
                <div className="w-full max-w-96 text-center text-white text-sm font-normal font-['Mona_Sans'] leading-tight px-4">
                  We are getting started on your order right away, and you will receive an order confirmation email shortly to your registered email address.
                </div>
              </div>
              
              {/* Action Button */}
              <div className="w-full max-w-96 px-4">
                <Button
                  onClick={handleCheckOrderDetails}
                  className="w-full px-7 py-3 bg-rose-500 hover:bg-rose-600 rounded-xl text-white text-sm font-medium font-['Mona_Sans'] leading-tight"
                >
                  Check Order Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default OrderSuccessPage; 