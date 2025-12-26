import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ImageUploadSection = ({ images = [], onChange, maxImages = 6 }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const validateFiles = (files) => {
    const validFiles = [];
    const errors = [];

    for (let file of files) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name} is not an image file`);
        continue;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        errors.push(`${file.name} exceeds 5MB limit`);
        continue;
      }

      validFiles.push(file);
    }

    return { validFiles, errors };
  };

  const handleFiles = (files) => {
    const { validFiles, errors } = validateFiles(files);
    
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    const currentImages = [...images];
    const remainingSlots = maxImages - currentImages.length;

    if (validFiles.length > remainingSlots) {
      alert(`You can only add ${remainingSlots} more image(s)`);
      return;
    }

    // Convert files to preview URLs and add to images array
    const newImages = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      isCover: currentImages.length === 0, // First image is cover by default
      mediaType: 'IMAGE'
    }));

    onChange([...currentImages, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    
    // If removing cover image, set first remaining image as cover
    if (images[index].isCover && newImages.length > 0) {
      newImages[0].isCover = true;
    }
    
    onChange(newImages);
  };

  const setCoverImage = (index) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isCover: i === index
    }));
    onChange(newImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Hostel Images</h2>
        <span className="text-sm text-stone-500">
          {images.length}/{maxImages} images
        </span>
      </div>

      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
              : 'border-stone-300 dark:border-stone-600 hover:border-stone-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-2">
            <Upload className="w-8 h-8 text-stone-400" />
            <div className="text-sm text-stone-600 dark:text-stone-400">
              <p className="font-medium">Drag & drop images here</p>
              <p className="text-xs mt-1">or</p>
            </div>
            <button
              type="button"
              onClick={openFileDialog}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
            >
              Browse Files
            </button>
            <p className="text-xs text-stone-500">
              JPG, PNG, GIF up to 5MB each
            </p>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="relative group rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700"
              >
                <img
                  src={image.url}
                  alt={`Hostel image ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                
                {/* Cover Badge */}
                {image.isCover && (
                  <div className="absolute top-2 left-2 bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                    Cover
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  {!image.isCover && (
                    <button
                      type="button"
                      onClick={() => setCoverImage(index)}
                      className="p-2 bg-white rounded-full hover:bg-stone-100 transition-colors"
                      title="Set as cover"
                    >
                      <ImageIcon className="w-4 h-4 text-stone-700" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                    title="Remove image"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="mt-4 text-xs text-stone-500">
            <p>• First image is automatically set as cover</p>
            <p>• Click the image icon to set a different cover</p>
            <p>• Maximum {maxImages} images allowed</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadSection;
