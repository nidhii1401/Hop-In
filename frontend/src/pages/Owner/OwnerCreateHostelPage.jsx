// src/pages/owner/OwnerCreateHostelPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Save, ArrowLeft, Zap } from 'lucide-react';
import { createHostel } from '../../apis/ownerApis.js';
import { toastError, toastSuccess } from '../../utils/toast.js';

import BasicDetailsSection from './compo/CreateHostelBasic.jsx';
import AddressSection from './compo/AddressSection.jsx';
import FacilitiesSection from './compo/FacilitiesSection.jsx';
import CreateRoomsSection from './compo/CreateRoomSection.jsx';
import ImageUploadSection from './compo/ImageUploadSection.jsx';

const OwnerCreateHostelPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    addressLine: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    nearCollege: '',
    genderType: 'COED',
    messType: 'NONE',
    messPricePerMonth: '',
    messDescription: '',
    rules: '',
    amenities: [],
    rooms: [], // Add rooms to formData
    images: [], // Add images to formData
  });

  // Room configuration state
  const [roomConfig, setRoomConfig] = useState({
    singleRooms: 0,
    singleRoomPrice: 0,
    doubleRooms: 0,
    doubleRoomPrice: 0,
    tripleRooms: 0,
    tripleRoomPrice: 0,
    customRooms: []
  });

  // Handler for room config changes
  const handleRoomConfigChange = (field, value) => {
    setRoomConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Generate rooms array from roomConfig
  const generateRooms = () => {
    const rooms = [];
    
    // Single rooms
    for (let i = 1; i <= roomConfig.singleRooms; i++) {
      rooms.push({
        roomNumber: `S${i.toString().padStart(2, '0')}`,
        floor: '1',
        roomType: 'SINGLE',
        capacity: 1,
        pricePerMonth: roomConfig.singleRoomPrice
      });
    }
    
    // Double rooms
    for (let i = 1; i <= roomConfig.doubleRooms; i++) {
      rooms.push({
        roomNumber: `D${i.toString().padStart(2, '0')}`,
        floor: '1',
        roomType: 'DOUBLE',
        capacity: 2,
        pricePerMonth: roomConfig.doubleRoomPrice
      });
    }
    
    // Triple rooms  
    for (let i = 1; i <= roomConfig.tripleRooms; i++) {
      rooms.push({
        roomNumber: `T${i.toString().padStart(2, '0')}`,
        floor: '1',
        roomType: 'TRIPLE',
        capacity: 3,
        pricePerMonth: roomConfig.tripleRoomPrice
      });
    }

    // Custom rooms
    roomConfig.customRooms.forEach((customRoom, index) => {
      for (let i = 1; i <= customRoom.count; i++) {
        rooms.push({
          roomNumber: `${customRoom.seater}S${i.toString().padStart(2, '0')}`,
          floor: '1',
          roomType: `SEATER_${customRoom.seater}`,
          capacity: customRoom.seater,
          pricePerMonth: customRoom.price
        });
      }
    });
    
    return rooms;
  };

  const handleFormChange = (section, data) => {
    if (typeof section === 'object' && data === undefined) {
      // Handle case where entire form data is passed as single argument
      setFormData(prev => ({ ...prev, ...section }));
    } else {
      // Handle section-based updates
      setFormData(prev => ({ ...prev, [section]: data }));
    }
  };

  const fillDummyData = () => {
    setFormData({
      name: 'Sunshine Hostel & PG',
      description: 'A premium hostel facility with modern amenities, 24/7 security, and comfortable living spaces for students. Located near major educational institutions with easy access to public transportation.',
      addressLine: '123, Main Road, Near Metro Station',
      area: 'Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
      landmark: 'Opposite Forum Mall',
      nearCollege: 'Christ University',
      genderType: 'COED',
      messType: 'COMPULSORY',
      messPricePerMonth: '3500',
      messDescription: 'Veg and Non-veg options, 3 meals per day + tea/coffee',
      rules: 'No smoking, No alcohol, Quiet hours 10PM-6AM, Visitors allowed until 8PM',
      amenities: [1, 2, 4, 5],
      rooms: []
    });

    // Also fill room config with dummy data
    setRoomConfig({
      singleRooms: 2,
      singleRoomPrice: 8000,
      doubleRooms: 5,
      doubleRoomPrice: 6000,
      tripleRooms: 3,
      tripleRoomPrice: 4500,
      customRooms: [
        { id: 1, seater: 4, count: 2, price: 3500 }
      ]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.city || !formData.state) {
      setError('Name, city, and state are required fields');
      return;
    }

    // Validate room configuration
    const totalRooms = roomConfig.singleRooms + roomConfig.doubleRooms + roomConfig.tripleRooms + 
                      roomConfig.customRooms.reduce((sum, room) => sum + room.count, 0);
    
    if (totalRooms === 0) {
      setError('Please configure at least one room type');
      return;
    }

    setIsLoading(true);
    try {
      // Generate rooms and add to formData
      const rooms = generateRooms();
      const hostelData = { ...formData, rooms };
      
      await createHostel(hostelData);
      toastSuccess('Hostel created successfully');
      navigate('/owner/hostels');
    } catch (err) {
      const msg = err?.message || 'Failed to create hostel';
      setError(msg);
      toastError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-stone-500 hover:text-stone-900 mb-6">
        <ArrowLeft size={18} /> Back
      </button>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Register New Hostel</h1>
        {process.env.NODE_ENV === 'development' && (
          <button
            type="button"
            onClick={fillDummyData}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            <Zap size={18} /> Fill Dummy Data
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <BasicDetailsSection formData={formData} onChange={handleFormChange} />
        <AddressSection formData={formData} onChange={handleFormChange} />
        <ImageUploadSection 
          images={formData.images} 
          onChange={(images) => handleFormChange('images', images)} 
        />
        <FacilitiesSection formData={formData} onChange={handleFormChange} />
        
        {/* Pass roomConfig and handler to RoomsSection */}
        <CreateRoomsSection
          roomConfig={roomConfig} 
          onRoomConfigChange={handleRoomConfigChange} 
        />

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-orange-700 hover:bg-orange-800 disabled:bg-orange-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-900/10 flex items-center gap-2 transition-colors"
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Creating Hostel...
              </>
            ) : (
              <>
                <Save size={20} /> Save & Create Hostel
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OwnerCreateHostelPage;
