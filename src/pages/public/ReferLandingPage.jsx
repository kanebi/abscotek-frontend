import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import referralService from '@/services/referralService';
import authService from '@/services/authService';
import useStore from '@/store/useStore';
import { AppRoutes } from '@/config/routes';

export default function ReferLandingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { login } = usePrivy();
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const currentUser = useStore((state) => state.currentUser);
  const [displayName, setDisplayName] = useState(null);
  const [referrerId, setReferrerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError('Invalid referral link');
      setLoading(false);
      return;
    }
    let cancelled = false;
    referralService
      .getReferrerByCode(id)
      .then((data) => {
        if (!cancelled) {
          setDisplayName(data.displayName);
          setReferrerId(data.referrerId || null);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.errors?.[0]?.msg || 'Invalid or expired referral link');
          setDisplayName(null);
          setReferrerId(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  // If logged-in user is viewing their own referral link, redirect to home
  useEffect(() => {
    if (!loading && isAuthenticated && currentUser?.id && referrerId && currentUser.id === referrerId) {
      navigate(AppRoutes.home.path, { replace: true });
    }
  }, [loading, isAuthenticated, currentUser?.id, referrerId, navigate]);

  const handleRegister = () => {
    if (id) authService.setReferralCodeForNextAuth(id);
    login();
  };

  const handleLogIn = () => {
    login();
  };

  return (
    <Layout>
      <SEO
        title="You're invited - Abscotek"
        description="Join Abscotek via your friend's referral."
        path={`/refer/${id || ''}`}
      />
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-16 px-4 bg-neutral-900">
        <div className="max-w-md w-full text-center space-y-8">
          {loading && (
            <p className="text-neutral-400">Loading...</p>
          )}
          {error && !loading && (
            <>
              <p className="text-red-400">{error}</p>
              <Button
                variant="outline"
                onClick={() => navigate(AppRoutes.home.path)}
                className="text-white border-neutral-600 hover:bg-neutral-800"
              >
                Go to Home
              </Button>
            </>
          )}
          {displayName && !loading && !error && (
            <>
              <h1 className="text-2xl md:text-3xl font-semibold text-white">
                You're invited by <span className="text-primaryp-300">@{displayName}</span>
              </h1>
              {isAuthenticated ? (
                <div className="space-y-4">
                  <p className="text-white font-medium">You're already logged in.</p>
                  <p className="text-neutral-400 text-sm">
                    Your referrer may earn rewards when you make your first purchase.
                  </p>
                  <Button
                    onClick={() => navigate(AppRoutes.home.path)}
                    className="w-full max-w-xs bg-primaryp-300 hover:bg-primaryp-400 text-white font-medium py-6 text-base rounded-xl"
                  >
                    Continue to Home
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-neutral-400 text-sm md:text-base">
                    Create an account to get started and your referrer may earn rewards when you make your first purchase.
                  </p>
                  <Button
                    onClick={handleRegister}
                    className="w-full max-w-xs bg-primaryp-300 hover:bg-primaryp-400 text-white font-medium py-6 text-base rounded-xl"
                  >
                    Register
                  </Button>
                  <p className="text-neutral-500 text-xs">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={handleLogIn}
                      className="text-primaryp-300 hover:underline"
                    >
                      Log in
                    </button>
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
