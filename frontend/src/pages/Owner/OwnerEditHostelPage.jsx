import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Trash2, Building, AlertCircle } from 'lucide-react';
import BasicInfoSection from './compo/BasicInfoSection.jsx';
import LocationSection from './compo/LocationSection.jsx';
import RoomsSection from './compo/RoomsSection.jsx';
import MessSection from './compo/MessSection.jsx';
import HostelImageManager from './compo/HostelImageManager.jsx';
import { getHostelById, updateHostel, deleteHostel, uploadHostelMedia, deleteHostelMedia, updateHostelMedia } from '../../apis/ownerApis.js';
import Loader from '../Common/UI/Loader.jsx';
import { toastError, toastSuccess } from '../../utils/toast.js';

const OwnerEditHostelPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    addressLine: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    genderType: 'COED',
    messType: 'NONE',
    messPricePerMonth: '',
    messDescription: '',
    rules: '',
    rooms: [] 
  });

  const [hostelData, setHostelData] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchHostelData = async () => {
      try {
        setLoading(true);
        const response = await getHostelById(id);
        if (response.success && response.data) {
          const data = response.data;
          // ✅ Separate media from form fields so it isn't sent back in update payloads
          const { media, ...rest } = data;
          setFormData({
            ...rest,
            rooms: rest.rooms || [],
            messPricePerMonth: rest.messPricePerMonth || '' 
          });
          setHostelData(data);
          setImages(media || []);
        }
      } catch (err) {
        console.error("Failed to fetch hostel:", err);
        setError("Could not load hostel details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchHostelData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Wrapped in useCallback to prevent infinite render loops in RoomsSection
  const handleRoomsUpdate = useCallback((updatedRooms) => {
    setFormData(prev => ({ ...prev, rooms: updatedRooms }));
  }, []);

  // ✅ Wrapped in useCallback to prevent unnecessary re-renders
  const handleImagesChange = useCallback((updatedImages) => {
    console.log('Parent handleImagesChange called with:', updatedImages.length, 'images');
    setImages(updatedImages);
  }, []);

  const handleDeleteHostel = async () => {
    setDeleting(true);
    try {
      const response = await deleteHostel(id);
      if (response.success) {
        toastSuccess('Hostel deleted');
        navigate('/owner/hostels');
      }
    } catch (err) {
      const msg = err.message || "Failed to delete hostel.";
      setError(msg);
      toastError(msg);
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      // First update hostel basic info
      // ✅ Do NOT send media back in the basic update payload – media is managed via dedicated APIs
      const { media, ...formWithoutMedia } = formData;
      const payload = {
        ...formWithoutMedia,
        messPricePerMonth: formData.messPricePerMonth ? Number(formData.messPricePerMonth) : null,
        rooms: undefined // Rooms handled separately
      };

      const response = await updateHostel(id, payload);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update hostel');
      }

      // Handle image uploads and deletions
      const newImages = images.filter(img => !img.isExisting && img.file);
      const existingImageIds = images.filter(img => img.isExisting).map(img => img.id);
      const originalImageIds = (hostelData?.media || []).map(img => img.id);
      const imagesToDelete = originalImageIds.filter(id => !existingImageIds.includes(id));

      // Delete removed images
      for (const imageId of imagesToDelete) {
        try {
          await deleteHostelMedia(id, imageId);
        } catch (err) {
          console.warn('Failed to delete image:', err);
        }
      }

      // Save image metadata changes (cover image, sort order)
      const existingImages = images.filter(img => img.isExisting);
      for (const image of existingImages) {
        const originalImage = (hostelData?.media || []).find(original => original.id === image.id);
        
        // Check if cover image or sort order changed
        if (originalImage && (originalImage.isCover !== image.isCover || originalImage.sortOrder !== image.sortOrder)) {
          try {
            await updateHostelMedia(id, image.id, {
              isCover: image.isCover,
              sortOrder: image.sortOrder
            });
          } catch (err) {
            console.warn('Failed to update image metadata:', err);
          }
        }
      }

      // Upload new images
      if (newImages.length > 0) {
        setUploadingImages(true);
        const formData = new FormData();
        
        newImages.forEach((image, index) => {
          formData.append('hostelImages', image.file);
          formData.append(`imageData[${index}]`, JSON.stringify({
            isCover: image.isCover,
            mediaType: image.mediaType || 'IMAGE'
          }));
        });

        try {
          await uploadHostelMedia(id, formData);
        } catch (uploadErr) {
          console.warn('Image upload failed:', uploadErr);
          const msg = 'Hostel updated but image upload failed. Please try uploading images again.';
          setError(msg);
          toastError(msg);
        }
      }

      toastSuccess('Hostel updated successfully');
      navigate('/owner/hostels'); 
    } catch (err) {
      const msg = err.message || "Failed to update hostel.";
      setError(msg);
      toastError(msg);
    } finally {
      setSaving(false);
      setUploadingImages(false);
    }
  };

  if (loading) return <Loader size="lg" text="Loading hostel details..." className="py-20" />;

  return (
    <div className="bg-stone-50 dark:bg-stone-950 min-h-screen pb-20 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 transition-colors w-fit">
            <ArrowLeft size={18} /> Back
          </button>
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-red-100 dark:border-red-900/30 w-full sm:w-auto"
          >
            <Trash2 size={16} /> Delete Hostel
          </button>
        </div>

        {/* Title */}
        <div className="flex items-center gap-4 mb-6">
           <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center text-orange-700 dark:text-orange-400">
              <Building size={32} />
           </div>
           <div>
              <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Edit {formData.name}</h1>
              <p className="text-stone-500 dark:text-stone-400 text-sm">Update property details</p>
           </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <BasicInfoSection formData={formData} handleChange={handleChange} />
          <LocationSection formData={formData} handleChange={handleChange} />
          
          <HostelImageManager 
            existingImages={images}
            onImagesChange={handleImagesChange}
            maxImages={6}
            isUploading={uploadingImages}
            hostelId={id}
          />

          <RoomsSection 
             rooms={formData.rooms} 
             hostelId={id} 
             onRoomsUpdate={handleRoomsUpdate} 
          />

          <MessSection formData={formData} handleChange={handleChange} />

          <div className="pt-6 border-t border-stone-100 dark:border-stone-800 flex justify-end">
            <button 
              type="submit" 
              disabled={saving}
              className="bg-orange-700 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-orange-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              {saving ? 'Saving...' : <><Save size={18} /> Update Changes</>}
            </button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal (Same as before) */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-xl shadow-xl border border-stone-200 dark:border-stone-800 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <Trash2 size={20} className="text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">Delete Hostel</h3>
            </div>
            <div className="mb-6">
              <p className="text-stone-600 dark:text-stone-400 mb-2">
                Are you sure you want to delete "<span className="font-semibold text-stone-900 dark:text-stone-100">{formData.name}</span>"?
              </p>
              <p className="text-sm text-stone-500 dark:text-stone-500">
                This action will permanently remove the hostel and all its data.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 py-2 px-4 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteHostel}
                disabled={deleting}
                className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold rounded-lg"
              >
                {deleting ? 'Deleting...' : 'Delete Hostel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerEditHostelPage;
