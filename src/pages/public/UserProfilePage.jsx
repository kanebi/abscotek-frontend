import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userService from '../../services/userService';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { AppRoutes } from '../../config/routes';
import { User, Mail, Phone, MapPin, Calendar, Package, Edit, Settings } from 'lucide-react';

function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = await userService.getCurrentUser();
      setUser(userData);
      setEditForm({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        zipCode: userData.zipCode || '',
        country: userData.country || ''
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedUser = await userService.updateProfile(editForm);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <Layout>
        <div className="w-[86%] mx-auto py-8">
          <div className="text-center text-white">Loading profile...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-[86%] mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-heading-header-2-header-2-bold text-white">My Profile</h1>
              <p className="text-neutralneutral-400">Manage your account settings and preferences</p>
            </div>
            
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} className="bg-primaryp-500 hover:bg-primaryp-400">
                <Edit size={16} className="mr-2" />
                Edit Profile
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primaryp-100/10 rounded-full flex items-center justify-center">
                    <User size={32} className="text-primaryp-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading-header-3-header-3-bold text-white">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-neutralneutral-400">{user?.email}</p>
                  </div>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={editForm.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={editForm.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={editForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={editForm.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                      />
                    </div>
                    
                    <div className="flex gap-4 pt-4">
                      <Button type="submit" disabled={saving} className="bg-primaryp-500 hover:bg-primaryp-400">
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button type="button" onClick={() => setIsEditing(false)} variant="outline" className="border-neutralneutral-600">
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-3">
                        <Mail size={16} className="text-neutralneutral-500" />
                        <div>
                          <p className="text-neutralneutral-400 text-sm">Email</p>
                          <p className="text-white">{user?.email || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Phone size={16} className="text-neutralneutral-500" />
                        <div>
                          <p className="text-neutralneutral-400 text-sm">Phone</p>
                          <p className="text-white">{user?.phone || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-heading-header-4-header-4-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link to={AppRoutes.userOrders.path}>
                    <Button variant="outline" className="w-full border-neutralneutral-600 text-neutralneutral-300 justify-start">
                      <Package size={16} className="mr-3" />
                      View Orders
                    </Button>
                  </Link>
                  
                  <Link to={AppRoutes.referral.path}>
                    <Button variant="outline" className="w-full border-neutralneutral-600 text-neutralneutral-300 justify-start">
                      Referral Program
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default UserProfilePage; 