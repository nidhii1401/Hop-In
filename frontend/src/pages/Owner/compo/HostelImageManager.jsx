import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, Loader2, Eye, CheckSquare, Square, Trash2, Save } from 'lucide-react';
import { deleteHostelMedia, uploadHostelMedia } from "../../../apis/ownerApis.js";
import HostelImageGallery from './HostelImageGallery.jsx';

const HostelImageManager = ({ 
  existingImages = [], 
  onImagesChange, 
  maxImages = 6,
  isUploading = false,
  hostelId = null 
}) => {
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [deletingImage, setDeletingImage] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [isUploadingNew, setIsUploadingNew] = useState(false);
  
  const fileInputRef = useRef(null);
  const previousExistingImagesRef = useRef();
  const isLocalOperationRef = useRef(false);
  
  // ✅ Synchronization Logic (UNCHANGED)
  useEffect(() => {
    if (isLocalOperationRef.current) return;
    
    if (previousExistingImagesRef.current !== existingImages) {
      if (existingImages && existingImages.length > 0) {
        const formattedImages = existingImages.map((img, index) => {
          const isNew = !!img.file || img.isExisting === false;

          return {
            ...img,
            id: img.id || `image-${index}`,
            mediaType: img.mediaType || 'IMAGE',
            isExisting: !isNew, 
            sortOrder: img.sortOrder || index
          };
        });
        
        setImages(formattedImages);
      } else {
        setImages([]);
      }
      previousExistingImagesRef.current = existingImages;
    }
  }, [existingImages]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) handleFiles(e.target.files);
  };

  const validateFiles = (files) => {
    const validFiles = [];
    const errors = [];
    for (let file of files) {
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name} is not an image`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        errors.push(`${file.name} exceeds 5MB`);
        continue;
      }
      validFiles.push(file);
    }
    return { validFiles, errors };
  };

  const updateImagesAndNotify = (newImages) => {
    isLocalOperationRef.current = true;
    setImages(newImages);
    if (onImagesChange) {
      onImagesChange(newImages);
    }
    setTimeout(() => {
      isLocalOperationRef.current = false;
    }, 100);
  };

  const handleFiles = (files) => {
    setUploadError('');
    const { validFiles, errors } = validateFiles(files);
    
    if (errors.length > 0) {
      setUploadError(errors.join(', '));
      return;
    }

    if (validFiles.length + images.length > maxImages) {
      setUploadError(`Maximum ${maxImages} images allowed.`);
      return;
    }

    const newImages = validFiles.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
      isCover: images.length === 0 && index === 0,
      mediaType: 'IMAGE',
      isExisting: false,
      sortOrder: images.length + index
    }));

    const updatedList = [...images, ...newImages];
    updateImagesAndNotify(updatedList);
    isLocalOperationRef.current = false;
  };

  const removeImage = useCallback(async (index) => {
    const img = images[index];
    
    if (img.isExisting && hostelId) {
      try {
        setDeletingImage(img.id);
        await deleteHostelMedia(hostelId, img.id);
      } catch (err) {
        setUploadError("Failed to delete image.");
        setDeletingImage(null);
        return;
      }
    }
    
    setDeletingImage(null);
    const updated = images.filter((_, i) => i !== index);
    if (img.isCover && updated.length > 0) updated[0].isCover = true;
    
    updateImagesAndNotify(updated);
  }, [images, hostelId]);

  const setCoverImage = useCallback((index) => {
    const updated = images.map((img, i) => ({ ...img, isCover: i === index }));
    updateImagesAndNotify(updated);
  }, [images]);

  const clearImages = useCallback(() => {
    const existingOnly = images.filter(img => img.isExisting);
    updateImagesAndNotify(existingOnly);
    setUploadError('');
    setSelectedImages(new Set());
  }, [images]);

  const uploadImagesToServer = useCallback(async () => {
    console.log('=== UPLOAD DEBUG START ===');
    console.log('hostelId:', hostelId);
    console.log('hostelId type:', typeof hostelId);
    console.log('images:', images);
    console.log('new images:', images.filter(img => !img.isExisting));
    
    if (!hostelId || hostelId === 'undefined' || hostelId === 'null') {
      setUploadError("Hostel ID is missing. Please save the hostel first.");
      console.error('Invalid hostelId:', hostelId);
      return;
    }

    const newImages = images.filter(img => !img.isExisting && img.file);
    console.log('filtered new images:', newImages);
    
    if (newImages.length === 0) {
      setUploadError("No new images to upload. Please select images first.");
      return;
    }

    try {
      setIsUploadingNew(true);
      setUploadError('');

      const formData = new FormData();
      newImages.forEach((img, idx) => {
        console.log(`Appending image ${idx}:`, img.file);
        formData.append('hostelImages', img.file);
        formData.append(`imageData[${idx}]`, JSON.stringify({
          isCover: img.isCover,
          mediaType: img.mediaType
        }));
      });

      console.log('FormData entries before API call:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const res = await uploadHostelMedia(hostelId, formData);
      console.log('Upload response:', res);
      
      if (res.success && res.data.media) {
         const allMedia = res.data.media.map(m => ({
            ...m,
            isExisting: true
         }));
         
         updateImagesAndNotify(allMedia);
         setUploadError('');
      } else {
         setUploadError(res.message || 'Upload failed - no media returned');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError(err.message || "Upload failed");
    } finally {
      setIsUploadingNew(false);
      console.log('=== UPLOAD DEBUG END ===');
    }
  }, [images, hostelId]);

  const toggleImageSelection = (id) => {
     const newSet = new Set(selectedImages);
     if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
     setSelectedImages(newSet);
  };

  const selectAllImages = () => {
    if (selectedImages.size === images.length) setSelectedImages(new Set());
    else setSelectedImages(new Set(images.map(i => i.id)));
  };

  const deleteSelectedImages = async () => {
      setDeletingImage('bulk');
      try {
          for (const id of selectedImages) {
              const img = images.find(i => i.id === id);
              if (img && img.isExisting && hostelId) {
                  await deleteHostelMedia(hostelId, id);
              }
          }
          const remaining = images.filter(i => !selectedImages.has(i.id));
          if (remaining.length > 0 && !remaining.some(i => i.isCover)) remaining[0].isCover = true;
          
          updateImagesAndNotify(remaining);
          setSelectedImages(new Set());
      } catch (e) {
          setUploadError("Bulk delete failed");
      } finally {
          setDeletingImage(null);
      }
  };

  const openFileDialog = () => fileInputRef.current?.click();

  return (
    <div className="bg-white dark:bg-stone-900 p-4 sm:p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
      {/* Responsive Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-4 sm:gap-0">
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">Hostel Images ({images.length}/{maxImages})</h2>
        
        {/* Responsive Button Groups */}
        <div className="flex flex-wrap items-center gap-2 justify-start sm:justify-end">
           {!selectionMode && images.length > 0 && (
             <button 
               type="button" 
               onClick={() => setSelectionMode(true)} 
               className="px-3 py-1.5 bg-stone-50 text-stone-700 border border-stone-200 rounded-lg text-xs sm:text-sm flex gap-1 items-center hover:bg-stone-100 hover:border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700 dark:hover:bg-stone-700 transition-all shrink-0"
             >
                <Square size={14} className="sm:w-4 sm:h-4"/> Select
             </button>
           )}
           {selectionMode && (
             <>
               <button 
                 type="button" 
                 onClick={selectAllImages} 
                 className="px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-lg text-xs sm:text-sm flex gap-1 items-center hover:bg-orange-100 dark:bg-stone-800 dark:text-orange-400 dark:border-stone-700 transition-all shrink-0"
               >
                    <CheckSquare size={14} className="sm:w-4 sm:h-4"/> {selectedImages.size === images.length ? 'Deselect All' : 'Select All'}
               </button>
               {selectedImages.size > 0 && (
                 <button 
                   type="button" 
                   onClick={deleteSelectedImages} 
                   disabled={deletingImage !== null} 
                   className="px-3 py-1.5 bg-white text-red-600 border border-stone-200 rounded-lg text-xs sm:text-sm flex gap-1 items-center hover:bg-red-50 hover:border-red-200 dark:bg-stone-900 dark:text-red-400 dark:border-stone-700 transition-all shrink-0"
                 >
                    {deletingImage === 'bulk' ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} className="sm:w-4 sm:h-4"/>} Delete ({selectedImages.size})
                 </button>
               )}
               <button 
                 type="button" 
                 onClick={() => { setSelectionMode(false); setSelectedImages(new Set()); }} 
                 className="px-3 py-1.5 bg-stone-50 text-stone-700 border border-stone-200 rounded-lg text-xs sm:text-sm flex gap-1 items-center hover:bg-stone-100 hover:border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700 dark:hover:bg-stone-700 transition-all shrink-0"
               >
                    <X size={14} className="sm:w-4 sm:h-4"/> Cancel
               </button>
             </>
           )}

           {!selectionMode && images.length > 0 && (
               <button 
                 type="button" 
                 onClick={() => setShowGallery(true)} 
                 className="px-3 py-1.5 bg-stone-50 text-stone-700 border border-stone-200 rounded-lg text-xs sm:text-sm flex gap-1 items-center hover:bg-stone-100 hover:border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700 dark:hover:bg-stone-700 transition-all shrink-0"
               >
                   <Eye size={14} className="sm:w-4 sm:h-4"/> View
               </button>
           )}

           {!selectionMode && images.some(img => !img.isExisting) && (
               <button 
                 type="button"
                 onClick={uploadImagesToServer} 
                 disabled={isUploadingNew || isUploading || !hostelId} 
                 className="px-3 py-1.5 bg-orange-600 text-white border border-transparent rounded-lg text-xs sm:text-sm flex gap-1 items-center hover:bg-orange-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
               >
                   {isUploadingNew ? <Loader2 className="animate-spin" size={14}/> : <Save size={14} className="sm:w-4 sm:h-4"/>} Upload New
               </button>
           )}
           
           {!selectionMode && images.length > 0 && (
               <button 
                 type="button" 
                 onClick={clearImages} 
                 className="px-3 py-1.5 bg-white text-stone-600 border border-stone-200 rounded-lg text-xs sm:text-sm flex gap-1 items-center hover:text-red-600 hover:bg-red-50 hover:border-red-200 dark:bg-stone-900 dark:text-stone-400 dark:border-stone-700 dark:hover:text-red-400 transition-all shrink-0"
               >
                    <X size={14} className="sm:w-4 sm:h-4"/> Clear New
               </button>
           )}
        </div>
      </div>

      {uploadError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg flex gap-2 items-start text-sm dark:bg-red-900/10 dark:border-red-900/30 dark:text-red-400">
          <AlertCircle size={16} className="shrink-0 mt-0.5"/> 
          {uploadError}
        </div>
      )}

      {images.length < maxImages && (
         <div 
           className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-colors ${dragActive ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20' : 'border-stone-300 dark:border-stone-700 hover:border-orange-300 hover:bg-stone-50 dark:hover:bg-stone-800'}`}
           onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
         >
            <div className="flex flex-col items-center gap-3">
               <Upload className="text-stone-400 w-12 h-12 sm:w-16 sm:h-16" />
               <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base leading-relaxed">
                 Drag & drop or{' '}
                 <span onClick={openFileDialog} className="text-orange-600 cursor-pointer font-medium hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-400">
                   Browse
                 </span>
               </p>
               <span className="text-xs text-stone-500 px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-full">Max 5MB per image</span>
            </div>
         </div>
      )}
      <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileInput} className="hidden" />

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mt-6">
           {images.map((img, idx) => (
             <div key={img.id} className={`relative group rounded-lg overflow-hidden border-2 h-24 sm:h-32 ${selectedImages.has(img.id) ? 'border-orange-500 ring-2 ring-orange-500/50' : 'border-stone-200 dark:border-stone-700'}`}>
                <img src={img.url} className="w-full h-full object-cover" alt="preview"/>
                
                {selectionMode && (
                   <button 
                     type="button" 
                     onClick={() => toggleImageSelection(img.id)} 
                     className="absolute top-2 left-2 bg-white/90 dark:bg-stone-800/95 backdrop-blur-sm rounded-lg shadow-md p-1.5 border border-stone-200/50 dark:border-stone-700/50 hover:scale-110 transition-all"
                   >
                     {selectedImages.has(img.id) ? 
                       <CheckSquare size={16} className="text-orange-600 dark:text-orange-500"/> : 
                       <Square size={16} className="text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300"/>
                     }
                   </button>
                )}

                {!selectionMode && img.isCover && (
                  <span className="absolute top-2 left-2 bg-orange-600 text-white text-xs px-2 py-1 rounded shadow-sm font-medium">Cover</span>
                )}
                {!selectionMode && !img.isExisting && (
                  <span className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded shadow-sm font-medium">New</span>
                )}

                {!selectionMode && (
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2 p-2">
                     <button 
                       type="button" 
                       onClick={() => setCoverImage(idx)} 
                       className="p-2.5 bg-white/90 dark:bg-stone-800/95 backdrop-blur-sm text-stone-700 hover:text-orange-600 hover:scale-110 rounded-full shadow-lg transition-all border border-stone-200/50 dark:border-stone-700/50"
                     >
                       <ImageIcon size={16}/>
                     </button>
                     <button 
                       type="button" 
                       onClick={() => removeImage(idx)} 
                       className="p-2.5 bg-white/90 dark:bg-stone-900/95 backdrop-blur-sm text-red-600 hover:bg-red-50 hover:scale-110 rounded-full shadow-lg transition-all border border-stone-200/50 dark:border-stone-700/50"
                     >
                       <X size={16}/>
                     </button>
                   </div>
                )}
             </div>
           ))}
        </div>
      )}

      {showGallery && (
        <HostelImageGallery images={images} onClose={() => setShowGallery(false)} />
      )}
    </div>
  );
};

export default HostelImageManager;
