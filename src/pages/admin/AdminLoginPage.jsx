import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import { AppRoutes } from '../../config/routes';
import SEO from '../../components/SEO';
import { getPageSEO } from '../../config/seo';
import useAdminStore from '../../store/adminStore';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';


function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = useAdminStore((state) => state.login);
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    
    try {
      const response = await authService.adminLogin(email, password);
      login(response.token, response.user);
      
      // Redirect based on role
      if (response.user.role === 'admin') {
        navigate(AppRoutes.admin.path);
      } else if (response.user.role === 'vendor') {
        navigate(AppRoutes.vendor.path || '/vendor');
      } else {
        navigate(AppRoutes.home.path);
      }
    } catch (error) {
      const errorMessage = authService.extractErrorMessage(error);
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // SEO configuration
  const seoData = getPageSEO('admin', { 
    path: '/admin/login',
    title: 'Admin/Vendor Login - Abscotek',
    description: 'Login portal for Abscotek platform administrators and vendors.'
  });

  return (
    <Layout>
      <SEO {...seoData} />
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full space-y-8 p-8 bg-neutral-800 border-neutral-700">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Admin Portal
            </h2>
            <p className="mt-2 text-center text-sm text-neutral-400">
              Sign in to your admin or vendor account
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {message && (
              <div className="bg-dangerd-900/20 border border-dangerd-500/50 rounded-md p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-dangerd-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-dangerd-400 font-medium">
                      {message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>

            {!isAuthenticated && (
              <div className="text-center">
                <p className="text-sm text-neutral-400">
                  Don't have an account?{' '}
                  <Link to={AppRoutes.signup.path} className="font-medium text-primaryp-400 hover:text-primaryp-300">
                    Sign up here
                  </Link>
                </p>
              </div>
            )}
          </form>
        </Card>
      </div>
    </Layout>
  );
}


export default AdminLoginPage;