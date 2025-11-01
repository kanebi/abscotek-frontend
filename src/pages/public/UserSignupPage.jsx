import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import { AppRoutes } from '../../config/routes';
import SEO from '../../components/SEO';
import { getPageSEO } from '../../config/seo';
import useStore from '../../store/useStore';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';

function UserSignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    referralCode: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const setToken = useStore((state) => state.setToken);
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setMessage('All required fields must be filled');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await authService.signup(formData);
      setIsAuthenticated(true);
      setToken(response.token);
      setCurrentUser(response.user);
      
      // Redirect to home page for new users
      navigate(AppRoutes.home.path);
    } catch (error) {
      const errorMessage = authService.extractErrorMessage(error);
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const seoData = getPageSEO('signup', { 
    path: '/signup',
    title: 'Sign Up - Abscotek',
    description: 'Create your Abscotek account and start shopping today.'
  });

  return (
    <Layout>
      <SEO {...seoData} />
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Create Account
            </h2>
            <p className="mt-2 text-center text-sm text-neutralneutral-400">
              Join Abscotek and start shopping today
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSignup}>
            <div className="rounded-md shadow-sm space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-neutralneutral-300 mb-2">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-neutralneutral-800 border border-neutralneutral-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-white placeholder-neutralneutral-400"
                    placeholder="First name"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-neutralneutral-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-neutralneutral-800 border border-neutralneutral-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-white placeholder-neutralneutral-400"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutralneutral-300 mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-neutralneutral-800 border border-neutralneutral-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-white placeholder-neutralneutral-400"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-neutralneutral-300 mb-2">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-neutralneutral-800 border border-neutralneutral-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-white placeholder-neutralneutral-400"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutralneutral-300 mb-2">
                  Password *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-neutralneutral-800 border border-neutralneutral-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-white placeholder-neutralneutral-400"
                  placeholder="Enter password (min 6 characters)"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutralneutral-300 mb-2">
                  Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-neutralneutral-800 border border-neutralneutral-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-white placeholder-neutralneutral-400"
                  placeholder="Confirm your password"
                />
              </div>

              <div>
                <label htmlFor="referralCode" className="block text-sm font-medium text-neutralneutral-300 mb-2">
                  Referral Code (Optional)
                </label>
                <input
                  id="referralCode"
                  name="referralCode"
                  type="text"
                  value={formData.referralCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-neutralneutral-800 border border-neutralneutral-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-white placeholder-neutralneutral-400"
                  placeholder="Enter referral code if you have one"
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
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-neutralneutral-400">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-red-400 hover:text-red-300">
                  Sign in here
                </Link>
              </p>
              <p className="text-sm text-neutralneutral-400">
                Are you an admin or vendor?{' '}
                <Link to={AppRoutes.signup.path} className="font-medium text-red-400 hover:text-red-300">
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

export default UserSignupPage;
