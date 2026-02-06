import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import { AppRoutes } from '../../config/routes';
import SEO from '../../components/SEO';
import { getPageSEO } from '../../config/seo';
import useStore from '../../store/useStore';

function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phone: ''
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
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setMessage('All fields are required');
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
      const response = await authService.adminSignup(formData);
      setIsAuthenticated(true);
      setToken(response.token);
      setCurrentUser(response.user);
      navigate(AppRoutes.admin.path);
    } catch (error) {
      const errorMessage = authService.extractErrorMessage(error);
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // SEO configuration
  const seoData = getPageSEO('signup', { 
    path: '/admin/signup',
    title: 'Admin/Vendor Sign Up - Abscotek',
    description: 'Create your admin or vendor account on Abscotek platform.'
  });

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEO {...seoData} />
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Admin Portal Registration
          </h2>
          <p className="mt-2 text-center text-sm text-neutralneutral-400">
            Create your admin or vendor account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-neutralneutral-300 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-neutralneutral-800 border border-neutralneutral-600 rounded-md shadow-sm focus:outline-none focus:ring-primaryp-500 focus:border-primaryp-500 text-white placeholder-neutralneutral-400"
                placeholder="Enter your full name"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-neutralneutral-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-neutralneutral-800 border border-neutralneutral-600 rounded-md shadow-sm focus:outline-none focus:ring-primaryp-500 focus:border-primaryp-500 text-white placeholder-neutralneutral-400"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="companyName" className="block text-sm font-medium text-neutralneutral-300 mb-2">
                Company Name
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-neutralneutral-800 border border-neutralneutral-600 rounded-md shadow-sm focus:outline-none focus:ring-primaryp-500 focus:border-primaryp-500 text-white placeholder-neutralneutral-400"
                placeholder="Enter company name"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-neutralneutral-300 mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-neutralneutral-800 border border-neutralneutral-600 rounded-md shadow-sm focus:outline-none focus:ring-primaryp-500 focus:border-primaryp-500 text-white placeholder-neutralneutral-400"
                placeholder="Enter phone number"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-neutralneutral-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-neutralneutral-800 border border-neutralneutral-600 rounded-md shadow-sm focus:outline-none focus:ring-primaryp-500 focus:border-primaryp-500 text-white placeholder-neutralneutral-400"
                placeholder="Enter password (min 6 characters)"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutralneutral-300 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-neutralneutral-800 border border-neutralneutral-600 rounded-md shadow-sm focus:outline-none focus:ring-primaryp-500 focus:border-primaryp-500 text-white placeholder-neutralneutral-400"
                placeholder="Confirm your password"
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
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primaryp-600 hover:bg-primaryp-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryp-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-neutralneutral-400">
              Already have an account?{' '}
              <Link to={AppRoutes.login.path} className="font-medium text-primaryp-400 hover:text-primaryp-300">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage; 