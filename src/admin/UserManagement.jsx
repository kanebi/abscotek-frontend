import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);

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
      console.error('Error fetching users:', error);
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
        console.error('Error deleting user:', error);
        setErrorMessage('Failed to delete user.');
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    clearMessages();

    // Basic client-side validation
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
      console.error('Error creating user:', error);
      setErrorMessage('Failed to create user.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      await userService.updateUser(editingUser._id, editingUser);
      setEditingUser(null);
      fetchUsers();
      setSuccessMessage('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      setErrorMessage('Failed to update user.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      <ErrorMessage message={errorMessage} />
      <SuccessMessage message={successMessage} />

      {/* Create New User Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Create New User</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            Add User
          </button>
        </form>
      </div>

      {/* Edit User Form */}
      {editingUser && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">Edit User</h3>
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={editingUser.name}
              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2">
              Update User
            </button>
            <button type="button" onClick={() => setEditingUser(null)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400">
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Existing Users</h3>
        {loading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="py-2 px-4">{user.name}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4 flex space-x-2">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default UserManagement;