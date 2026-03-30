import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Building, MapPin, Plus, Users, Edit, Home } from 'lucide-react';
import { getOwnerHostels } from '../../apis/ownerApis.js';
import Loader from '../Common/UI/Loader.jsx';

const OwnerHostelsPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [hostels, setHostels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  console.log('=== OWNER HOSTELS PAGE MOUNTED ===');
  console.log('Current user:', user);
  
  if (user) {
    fetchHostels();
  } else {
    console.log('No user found - redirecting to login');
    navigate('/login');
  }
}, [user, navigate]);

  const fetchHostels = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      console.log('=== STARTING HOSTELS FETCH ===');
      console.log('Current auth user from Redux:', user);
      
      const response = await getOwnerHostels();
      console.log('=== HOSTELS API RESPONSE ===');
      console.log('Full response:', response);
      console.log('Response success:', response.success);
      console.log('Response data:', response.data);
      console.log('Response data length:', response.data?.length);
      
      if (response.success) {
        setHostels(response.data || []);
        console.log('✅ Hostels loaded successfully:', response.data?.length || 0, 'hostels');
        response.data?.forEach((hostel, index) => {
          console.log(`Hostel ${index + 1}:`, hostel.name, 'ID:', hostel.id);
        });
      } else {
        const errorMsg = response.message || 'Failed to fetch hostels';
        console.error('❌ API Error:', errorMsg);
        console.error('Full error response:', response);
        setError(errorMsg);
      }
    } catch (error) {
      console.error('=== CATCH BLOCK ERROR ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error config:', error.config);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        console.log('🚫 401 Unauthorized - Session expired or invalid token');
        console.log('Current user in Redux:', user);
        setError('Session expired. Please login again.');
        setTimeout(() => {
          console.log('🔄 Redirecting to login in 2 seconds...');
          navigate('/login');
        }, 2000);
      } else if (error.response?.status === 403) {
        console.log('🚫 403 Forbidden - Access denied');
        console.log('User role:', user?.role);
        setError('Access denied. You don\'t have permission to view this page.');
      } else if (error.response?.status === 500) {
        console.log('💥 500 Server Error');
        setError('Server error. Please try again later.');
      } else {
        console.log('❓ Unknown Error');
        setError(error.response?.data?.message || error.message || 'An error occurred while fetching hostels');
      }
    } finally {
      setIsLoading(false);
      console.log('=== HOSTELS FETCH COMPLETED ===');
    }
  };

  return (
    <div className="bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">My Hostels</h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm">Manage your properties and amenities</p>
        </div>
        <Link 
          to="/owner/create-hostel"
          className="flex items-center gap-2 bg-orange-700 hover:bg-orange-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={18} /> Add New Hostel
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</p>
              <p className="text-red-600 dark:text-red-500 text-xs mt-1">
                Please check the browser console for more details.
              </p>
            </div>
            <button
              onClick={fetchHostels}
              className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <Loader 
            size="lg" 
            text="Loading ..." 
            className="py-20"
          />
      ) : hostels.length === 0 ? (
        // ✅ NEW: Empty State
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 border-dashed text-center">
          <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-4">
             <Home size={32} className="text-stone-400" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">No Hostels Found</h3>
          <p className="text-stone-500 dark:text-stone-400 max-w-sm mb-6">
            You haven't listed any hostels yet. Get started by adding your first property.
          </p>
          <Link 
            to="/owner/create-hostel"
            className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-white dark:text-stone-900 px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            <Plus size={18} /> Add Your First Hostel
          </Link>
        </div>
      ) : (
        // Hostels Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostels.map((hostel) => (
            <div
             key={hostel.id} className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800  overflow-hidden hover:shadow-lg transition-shadow group">
              
              {/* Image Area */}
              <div
               onClick={() => navigate(`/owner/hostel/${hostel.id}`)}
               className="h-48 bg-stone-200 dark:bg-stone-800 relative cursor-pointer">
                {hostel.media && hostel.media.length > 0 ? (
                  <img src={hostel.media[0].url} alt={hostel.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400">
                    <Building size={48} />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded shadow-sm ${
                    hostel.messType === 'COMPULSORY' ? 'bg-orange-100 text-orange-800' : 
                    hostel.messType === 'OPTIONAL' ? 'bg-blue-100 text-blue-800' : 'bg-stone-100 text-stone-800'
                  }`}>
                    {hostel.messType === 'NONE' ? 'No Mess' : `${hostel.messType} Mess`}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100 mb-1">{hostel.name}</h3>
                <div className="flex items-center gap-1 text-sm text-stone-500 mb-4">
                  <MapPin size={14} />
                  <span className="truncate">{hostel.city}, {hostel.area}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-stone-50 dark:bg-stone-950 rounded-lg mb-4 border border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                    <Users size={16} />
                    <span className="text-sm font-medium">Rooms</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-bold text-stone-900 dark:text-stone-100">{hostel._count?.rooms || 0}</span>
                    <span className="text-stone-400"> Total</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/owner/edit-hostel/${hostel.id}`)}
                    className="flex-1 py-2.5 border border-stone-200 dark:border-stone-700 rounded-lg flex items-center justify-center gap-2 text-stone-600 dark:text-stone-300 font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button 
                    onClick={() => navigate(`/owner/hostels/${hostel.id}/rooms`)} // Changed link to dedicated rooms page if needed, or keep edit
                    className="flex-1 py-2.5 bg-orange-700 hover:bg-orange-800 text-white rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
                  >
                    <Building size={16} /> Rooms
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerHostelsPage;
