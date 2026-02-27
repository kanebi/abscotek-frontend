import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Users, Plus, Edit, Trash2, Search, Mail, Calendar, ArrowLeft, CheckCircle, XCircle, Shield, UserCheck, Crown } from 'lucide-react';
import { AppRoutes } from '../../config/routes';
import useAdminStore from '../../store/adminStore';

function UserManagement() {
  const navigate = useNavigate();
  const { user: currentAdmin } = useAdminStore();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const fetchUsers = async () => {
    clearMessages();
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      // Fetch failed
      setErrorMessage('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    clearMessages();
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id);
        fetchUsers();
        setSuccessMessage('User deleted successfully!');
      } catch (error) {
        // Delete failed
        setErrorMessage('Failed to delete user.');
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!newUser.name || !newUser.email || !newUser.password) {
      setErrorMessage('All fields are required.');
      return;
    }
    const emailRegex = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(newUser.email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (newUser.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    try {
      await userService.createUser(newUser);
      setNewUser({ name: '', email: '', password: '' });
      fetchUsers();
      setSuccessMessage('User created successfully!');
    } catch (error) {
      // Create failed
      setErrorMessage('Failed to create user.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      await userService.updateUserById(editingUser._id, editingUser);
      setEditingUser(null);
      fetchUsers();
      setSuccessMessage('User updated successfully!');
    } catch (error) {
      // Update failed
      setErrorMessage('Failed to update user.');
    }
  };

  const handleApprove = async (userId, approved) => {
    clearMessages();
    try {
      await userService.approveUser(userId, { approved });
      fetchUsers();
      setSuccessMessage(`User ${approved ? 'approved' : 'rejected'} successfully!`);
    } catch (error) {
      // Approve failed
      setErrorMessage('Failed to update approval status.');
    }
  };

  const handlePromote = async (userId, newRole) => {
    clearMessages();
    
    // Prevent self-promotion/demotion
    if (currentAdmin && currentAdmin._id === userId) {
      setErrorMessage('You cannot change your own role.');
      return;
    }
    
    try {
      await userService.approveUser(userId, { role: newRole });
      fetchUsers();
      setSuccessMessage(`User promoted to ${newRole} successfully!`);
    } catch (error) {
      // Promote failed
      const errorMsg = error.response?.data?.errors?.[0]?.msg || 'Failed to promote user.';
      setErrorMessage(errorMsg);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="w-[86%] mx-auto py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primaryp-100/10 rounded-full flex items-center justify-center">
                <Users size={24} className="text-primaryp-400" />
              </div>
              <div>
                <h1 className="text-3xl font-heading-header-2-header-2-bold text-white">
                  User Management
                </h1>
                <p className="text-neutralneutral-400">Manage user accounts and permissions</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate(AppRoutes.admin.path)}
              className="border-neutralneutral-600 text-neutralneutral-300 hover:bg-neutralneutral-800"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Dashboard
            </Button>
          </div>

          {/* Messages */}
          {errorMessage && (
            <Card className="p-4 mb-6 bg-dangerd-100/10 border-dangerd-400">
              <p className="text-dangerd-400">{errorMessage}</p>
            </Card>
          )}
          
          {successMessage && (
            <Card className="p-4 mb-6 bg-successs-100/10 border-successs-400">
              <p className="text-successs-400">{successMessage}</p>
            </Card>
          )}

          {/* Create New User Form */}
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Plus size={20} className="text-primaryp-400" />
              <h2 className="text-xl font-heading-header-3-header-3-bold text-white">
                Create New User
              </h2>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                  required
                />
              </div>
              
              <input
                type="password"
                placeholder="Password (min. 6 characters)"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                required
              />
              
              <Button type="submit" className="bg-primaryp-500 hover:bg-primaryp-400">
                <Plus size={16} className="mr-2" />
                Add User
              </Button>
            </form>
          </Card>

          {/* Edit User Form */}
          {editingUser && (
            <Card className="p-6 mb-6 border-warningw-400">
              <div className="flex items-center gap-2 mb-6">
                <Edit size={20} className="text-warningw-400" />
                <h2 className="text-xl font-heading-header-3-header-3-bold text-white">
                  Edit User
                </h2>
              </div>
              
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutralneutral-300 text-sm mb-2">Role</label>
                    <select
                      value={editingUser.role || 'user'}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                      className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white"
                    >
                      <option value="user">User</option>
                      <option value="vendor">Vendor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3 pt-8">
                    <input
                      type="checkbox"
                      id="approved"
                      checked={editingUser.approved || false}
                      onChange={(e) => setEditingUser({ ...editingUser, approved: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="approved" className="text-neutralneutral-300">
                      Approved
                    </label>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button type="submit" className="bg-warningw-500 hover:bg-warningw-400">
                    <Edit size={16} className="mr-2" />
                    Update User
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setEditingUser(null)}
                    variant="outline"
                    className="border-neutralneutral-600 text-neutralneutral-300"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Users List */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-xl font-heading-header-3-header-3-bold text-white">
                Users ({users.length})
              </h2>
              
              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutralneutral-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8 text-neutralneutral-400">Loading users...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users size={48} className="text-neutralneutral-500 mx-auto mb-3" />
                <p className="text-neutralneutral-400">
                  {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user._id} className="p-4 bg-neutralneutral-800 rounded-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-primaryp-100/10 rounded-full flex items-center justify-center">
                            <Users size={20} className="text-primaryp-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-body-large-large-bold text-white">
                              {user.name}
                            </h3>
                            <div className="flex items-center gap-2 text-neutralneutral-400 text-sm">
                              <Mail size={14} />
                              <span>{user.email}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            {user.role === 'admin' ? (
                              <Shield size={14} className="text-primaryp-400" />
                            ) : user.role === 'vendor' ? (
                              <UserCheck size={14} className="text-secondarys-400" />
                            ) : (
                              <Users size={14} className="text-neutralneutral-400" />
                            )}
                            <span className={`text-xs font-medium ${
                              user.role === 'admin' ? 'text-primaryp-400' :
                              user.role === 'vendor' ? 'text-secondarys-400' :
                              'text-neutralneutral-400'
                            }`}>
                              {user.role?.toUpperCase() || 'USER'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {user.approved ? (
                              <>
                                <CheckCircle size={14} className="text-successs-400" />
                                <span className="text-xs text-successs-400 font-medium">Approved</span>
                              </>
                            ) : (
                              <>
                                <XCircle size={14} className="text-warningw-400" />
                                <span className="text-xs text-warningw-400 font-medium">Pending</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {user.createdAt && (
                          <div className="flex items-center gap-2 text-neutralneutral-500 text-xs mt-1">
                            <Calendar size={12} />
                            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2 flex-wrap">
                          {!user.approved && (
                            <Button
                              onClick={() => handleApprove(user._id, true)}
                              size="sm"
                              className="bg-successs-500 hover:bg-successs-400"
                            >
                              <CheckCircle size={14} className="mr-1" />
                              Approve
                            </Button>
                          )}
                          {user.approved && user.role !== 'admin' && (
                            <Button
                              onClick={() => handleApprove(user._id, false)}
                              size="sm"
                              variant="outline"
                              className="border-warningw-500 text-warningw-400 hover:bg-warningw-500/10"
                            >
                              <XCircle size={14} className="mr-1" />
                              Reject
                            </Button>
                          )}
                          {user.role === 'user' && (
                            <>
                              <Button
                                onClick={() => {
                                  if (window.confirm(`⚠️ WARNING: Are you sure you want to promote ${user.name} to Admin?\n\nThis will give them full administrative access including:\n- User management\n- Product management\n- Order management\n- System settings\n\nThis action cannot be easily undone.`)) {
                                    handlePromote(user._id, 'admin');
                                  }
                                }}
                                size="sm"
                                className="bg-primaryp-500 hover:bg-primaryp-400"
                                disabled={currentAdmin && currentAdmin._id === user._id}
                                title={currentAdmin && currentAdmin._id === user._id ? 'You cannot promote yourself' : 'Promote to Admin'}
                              >
                                <Crown size={14} className="mr-1" />
                                Promote to Admin
                              </Button>
                              <Button
                                onClick={() => handlePromote(user._id, 'vendor')}
                                size="sm"
                                className="bg-secondarys-500 hover:bg-secondarys-400"
                                disabled={currentAdmin && currentAdmin._id === user._id}
                                title={currentAdmin && currentAdmin._id === user._id ? 'You cannot change your own role' : 'Promote to Vendor'}
                              >
                                <UserCheck size={14} className="mr-1" />
                                Promote to Vendor
                              </Button>
                            </>
                          )}
                          {user.role === 'vendor' && (
                            <>
                              <Button
                                onClick={() => {
                                  if (window.confirm(`⚠️ WARNING: Are you sure you want to promote ${user.name} to Admin?\n\nThis will give them full administrative access including:\n- User management\n- Product management\n- Order management\n- System settings\n\nThis action cannot be easily undone.`)) {
                                    handlePromote(user._id, 'admin');
                                  }
                                }}
                                size="sm"
                                className="bg-primaryp-500 hover:bg-primaryp-400"
                                disabled={currentAdmin && currentAdmin._id === user._id}
                                title={currentAdmin && currentAdmin._id === user._id ? 'You cannot promote yourself' : 'Promote to Admin'}
                              >
                                <Crown size={14} className="mr-1" />
                                Promote to Admin
                              </Button>
                              <Button
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to demote ${user.name} from Vendor to User?`)) {
                                    handlePromote(user._id, 'user');
                                  }
                                }}
                                size="sm"
                                variant="outline"
                                className="border-neutralneutral-600 text-neutralneutral-300"
                                disabled={currentAdmin && currentAdmin._id === user._id}
                                title={currentAdmin && currentAdmin._id === user._id ? 'You cannot change your own role' : 'Demote to User'}
                              >
                                Demote to User
                              </Button>
                            </>
                          )}
                          {user.role === 'admin' && (
                            <>
                              <Button
                                onClick={() => {
                                  if (window.confirm(`⚠️ WARNING: Are you sure you want to demote ${user.name} from Admin to Vendor?\n\nThis will remove their administrative access including:\n- User management\n- Product management\n- Order management\n- System settings\n\nThey will retain vendor privileges.`)) {
                                    handlePromote(user._id, 'vendor');
                                  }
                                }}
                                size="sm"
                                className="bg-warningw-500 hover:bg-warningw-400"
                                disabled={currentAdmin && currentAdmin._id === user._id}
                                title={currentAdmin && currentAdmin._id === user._id ? 'You cannot demote yourself' : 'Demote to Vendor'}
                              >
                                <UserCheck size={14} className="mr-1" />
                                Demote to Vendor
                              </Button>
                              <Button
                                onClick={() => {
                                  if (window.confirm(`⚠️ WARNING: Are you sure you want to demote ${user.name} from Admin to User?\n\nThis will remove ALL their administrative and vendor privileges.\n\nThis action cannot be easily undone.`)) {
                                    handlePromote(user._id, 'user');
                                  }
                                }}
                                size="sm"
                                variant="outline"
                                className="border-dangerd-500 text-dangerd-400 hover:bg-dangerd-500/10"
                                disabled={currentAdmin && currentAdmin._id === user._id}
                                title={currentAdmin && currentAdmin._id === user._id ? 'You cannot demote yourself' : 'Demote to User'}
                              >
                                <Users size={14} className="mr-1" />
                                Demote to User
                              </Button>
                            </>
                          )}
                        </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setEditingUser(user)}
                          size="sm"
                          className="bg-warningw-500 hover:bg-warningw-400"
                        >
                          <Edit size={14} className="mr-1" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(user._id)}
                          size="sm"
                          className="bg-dangerd-500 hover:bg-dangerd-400"
                        >
                          <Trash2 size={14} className="mr-1" />
                          Delete
                        </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default UserManagement;