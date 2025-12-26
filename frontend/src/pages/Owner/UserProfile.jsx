import React, { useState, useEffect } from 'react';
import { User, Lock, Bell, CreditCard, Mail, Edit, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile } from '../../redux/slices/authSlices'; 

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email) {
      alert('Name and email are required');
      return;
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsEditing(true);
    
    try {
      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      await dispatch(updateUserProfile(updateData)).unwrap();
      
      if (formData.newPassword) {
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      }
      
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update failed:', error);
      alert(error.message || 'Failed to update profile');
      setIsEditing(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      alert('All password fields are required');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await dispatch(updateUserProfile({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      })).unwrap();
      
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Password change failed:', error);
      alert(error.message || 'Failed to change password');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    { id: 'security', label: 'Security', icon: <Lock size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard size={20} /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-stone-900 p-8 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">User Profile</h1>
          <button
            onClick={() => navigate('/owner/dashboard')}
            className="text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-stone-200 dark:border-stone-800 mb-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-orange-600 dark:text-orange-500 border-b-2 border-orange-600 dark:border-orange-500'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 border-b-2 border-transparent hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-200 mb-4">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-stone-100 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-stone-100 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-stone-100 disabled:opacity-50"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-stone-600 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleProfileUpdate}
                    className="px-6 py-2 text-white bg-orange-600 hover:bg-orange-700 rounded-lg font-medium transition-colors"
                  >
                    {loading ? 'Saving...' : <><Save size={16} className="mr-2" /> Save Changes</>}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-200 mb-4">Security Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium text-stone-900 dark:text-stone-200 mb-3">Change Password</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="submit"
                      onClick={handlePasswordChange}
                      className="px-6 py-2 text-white bg-orange-600 hover:bg-orange-700 rounded-lg font-medium transition-colors"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-200 mb-4">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-300">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="rounded text-orange-600 focus:ring-orange-500"
                    />
                    Email Notifications
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-300">
                    <input
                      type="checkbox"
                      defaultChecked={false}
                      className="rounded text-orange-600 focus:ring-orange-500"
                    />
                    SMS Alerts
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-300">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="rounded text-orange-600 focus:ring-orange-500"
                    />
                    Push Notifications
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-200 mb-4">Billing Information</h2>
              
              <div className="bg-stone-50 dark:bg-stone-950 p-6 rounded-lg border border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-stone-600 dark:text-stone-400">Current Plan</span>
                  <span className="text-lg font-bold text-stone-900 dark:text-stone-100">Premium</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-stone-600 dark:text-stone-400">Monthly Cost</span>
                    <span className="text-lg font-bold text-stone-900 dark:text-stone-100">₹999</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-stone-600 dark:text-stone-400">Next Billing Date</span>
                    <span className="text-lg font-bold text-stone-900 dark:text-stone-100">Dec 31, 2025</span>
                  </div>
                </div>
                
                <button className="w-full text-orange-600 hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-400 font-medium py-3 rounded-lg border border-orange-200 dark:border-orange-700 hover:border-orange-300 dark:hover:border-orange-500 transition-colors">
                  Upgrade to Annual Plan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
