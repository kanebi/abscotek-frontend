import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import { AppRoutes } from '../../config/routes';
import SEO from '../../components/SEO';
import { getPageSEO } from '../../config/seo';
import useStore from '../../store/useStore';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';

function UserLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const setToken = useStore((state) => state.setToken);
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    
    try {
      const response = await authService.login(email, password);
      setIsAuthenticated(true);
      setToken(response.token);
      setCurrentUser(response.user);
      
      // Redirect to home page for regular users
      navigate(AppRoutes.home.path);
    } catch (error) {
      const errorMessage = authService.extractErrorMessage(error);
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const seoData = getPageSEO('login', { 
    path: '/login',
    title: 'Login - Abscotek',
    description: 'Sign in to your Abscotek account to start shopping.'
  });

  return (
    <Layout>
      <SEO {...seoData} />
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Welcome Back
            </h2>
            <p className="mt-2 text-center text-sm text-neutralneutral-400">
              Sign in to your account
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutralneutral-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-neutralneutral-800 border border-neutralneutral-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-white placeholder-neutralneutral-400"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutralneutral-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-neutralneutral-800 border border-neutralneutral-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-white placeholder-neutralneutral-400"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {message && (
              <div className="bg-red-900/20 border border-red-500/50 rounded-md p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-400 font-medium">
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
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-neutralneutral-400">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-red-400 hover:text-red-300">
                  Sign up here
                </Link>
              </p>
              <p className="text-sm text-neutralneutral-400">
                Are you an admin or vendor?{' '}
                <Link to={AppRoutes.login.path} className="font-medium text-red-400 hover:text-red-300">
                  Admin Portal
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default UserLoginPage;
