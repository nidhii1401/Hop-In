import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Lock, Bell, Loader2, AlertCircle, CheckCircle, Save, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile, setUser } from '../../redux/slices/authSlices';
import { getUserAvatar } from '../../utils/avatarUtils.js';

const HostellerProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // --- State Management ---
  const [activeTab, setActiveTab] = useState('profile');
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Separate Loading States
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Password Visibility State
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    avatarUrl: '', // Initialize as empty string
    // Hosteller Specific Fields
    collegeName: '',
    course: '',
    branch: '',
    yearOfStudy: '',
    bio: ''
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // --- Load User Data ---
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        avatarUrl: getUserAvatar(user),
        // Hosteller Specific Fields
        collegeName: user.hostellerProfile?.collegeName || '',
        course: user.hostellerProfile?.course || '',
        branch: user.hostellerProfile?.branch || '',
        yearOfStudy: user.hostellerProfile?.yearOfStudy || '',
        bio: user.hostellerProfile?.bio || ''
      });
    }
  }, [user]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (statusMessage.text) {
      const timer = setTimeout(() => setStatusMessage({ type: '', text: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  // --- Handlers ---

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const generateRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    setProfileData(prev => ({
      ...prev,
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${randomSeed}`
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });

    try {
      setProfileLoading(true);
      const result = await dispatch(updateUserProfile({
        fullName: profileData.fullName,
        phone: profileData.phone,
        email: profileData.email,
        avatarUrl: profileData.avatarUrl,
        // Hosteller Specific Fields
        collegeName: profileData.collegeName,
        course: profileData.course,
        branch: profileData.branch,
        yearOfStudy: profileData.yearOfStudy,
        bio: profileData.bio
      })).unwrap();

      // Manually update Redux user state
      if (result.user) {
        dispatch(setUser(result.user));
      }

      setStatusMessage({ type: 'success', text: 'Profile details updated successfully!' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: err || 'Failed to update profile' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setStatusMessage({ type: 'error', text: 'Please fill in all password fields' });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setStatusMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    try {
      setPasswordLoading(true);
      const result = await dispatch(updateUserProfile({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })).unwrap();

      // Manually update Redux user state
      if (result.user) {
        dispatch(setUser(result.user));
      }

      setStatusMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: err || 'Failed to change password' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // --- Tabs Configuration ---
  const tabs = [
    { id: 'profile', label: 'My Profile', icon: <User size={20} /> },
    { id: 'security', label: 'Security', icon: <Lock size={20} /> },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">Account Settings</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">Manage your personal details and security preferences.</p>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-stone-900 p-8 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
        
        {/* Inline Status Message */}
        {statusMessage.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            statusMessage.type === 'error' 
              ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800' 
              : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
          }`}>
            {statusMessage.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
            <span className="font-medium text-sm">{statusMessage.text}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-stone-200 dark:border-stone-800 mb-8 overflow-x-auto no-scrollbar scrollbar-hide">
          <div className="flex space-x-1 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 outline-none ${
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

        {/* --- Tab Content: Profile --- */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-200 mb-4">Personal Information</h2>
            
            <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Avatar Section */}
              <div className="col-span-1 md:col-span-2 flex items-center justify-center mb-4">
                 <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden border-4 border-orange-100 dark:border-orange-900/30 shadow-sm transition-transform hover:scale-105">
                        {/* Only render img if avatarUrl is present to avoid src="" error */}
                        {profileData.avatarUrl ? (
                            <img 
                                src={profileData.avatarUrl} 
                                alt="Avatar" 
                                className="h-full w-full object-cover" 
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-stone-400">
                                <User size={32} />
                            </div>
                        )}
                    </div>
                     <button
                        type="button"
                        onClick={generateRandomAvatar}
                        className="absolute bottom-0 right-0 bg-orange-600 text-white p-1.5 rounded-full hover:bg-orange-700 transition-colors shadow-sm ring-2 ring-white dark:ring-stone-900"
                        title="Generate Random Avatar"
                        >
                        <RefreshCw size={14} />
                    </button>
                </div>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Full Name</label>
                <input
                  type="text" name="fullName" value={profileData.fullName} onChange={handleProfileChange}
                  className="w-full px-4 py-2.5 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Phone Number</label>
                <input
                  type="tel" name="phone" value={profileData.phone} onChange={handleProfileChange}
                  className="w-full px-4 py-2.5 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Email Address</label>
                <input
                  type="email" name="email" value={profileData.email} disabled
                  className="w-full px-4 py-2.5 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-100 dark:bg-stone-900 text-stone-500 cursor-not-allowed"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">College Name</label>
                <input
                  type="text" name="collegeName" value={profileData.collegeName} onChange={handleProfileChange}
                  className="w-full px-4 py-2.5 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Course</label>
                <input
                  type="text" name="course" value={profileData.course} onChange={handleProfileChange}
                  className="w-full px-4 py-2.5 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Branch</label>
                <input
                  type="text" name="branch" value={profileData.branch} onChange={handleProfileChange}
                  className="w-full px-4 py-2.5 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Year of Study</label>
                <input
                  type="text" name="yearOfStudy" value={profileData.yearOfStudy} onChange={handleProfileChange}
                  className="w-full px-4 py-2.5 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Bio</label>
                <textarea
                  name="bio" value={profileData.bio} onChange={handleProfileChange}
                  rows="4"
                  className="w-full px-4 py-2.5 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="flex items-center px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {profileLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- Tab Content: Security --- */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-200 mb-4">Password Settings</h2>
            
            <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-5">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none pr-10"
                    placeholder="•••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                  >
                    {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none pr-10"
                    placeholder="Min 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                  >
                    {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none pr-10"
                    placeholder="Re-enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                  >
                    {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex items-center px-6 py-2.5 bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-stone-200 text-white dark:text-stone-900 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed min-w-[170px] justify-center"
                >
                  {passwordLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock size={18} className="mr-2" />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default HostellerProfile;
