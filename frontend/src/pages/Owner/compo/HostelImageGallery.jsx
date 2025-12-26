import React, { useState } from 'react';
import { X, Download, Trash2, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { deleteHostelMedia } from "../../../apis/ownerApis.js";

const HostelImageGallery = ({ 
  images = [], 
  hostelId = null,
  onClose,
  onDelete,
  isDeleting = false,
  deletingImageId = null
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white dark:bg-stone-900 p-6 rounded-xl shadow-xl border border-stone-200 dark:border-stone-800 w-full max-w-md mx-4">
          <div className="text-center">
            <p className="text-stone-600 dark:text-stone-400">No images to display</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handleDelete = async (imageId) => {
    if (onDelete) {
      await onDelete(imageId);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage.url;
    link.download = `hostel-image-${currentIndex + 1}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div 
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors z-10"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors z-10"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Main Image Container */}
        <div className="relative max-w-6xl max-h-[90vh] mx-auto">
          <img
            src={currentImage.url}
            alt={`Hostel image ${currentIndex + 1}`}
            className="w-full h-full object-contain"
            onClick={() => setIsFullscreen(!isFullscreen)}
          />

          {/* Image Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h3 className="text-lg font-semibold">
                  Image {currentIndex + 1} of {images.length}
                </h3>
                {currentImage.isCover && (
                  <span className="inline-block mt-1 px-2 py-1 bg-orange-600 text-xs rounded-full">
                    Cover Image
                  </span>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
                  title="Download image"
                >
                  <Download size={20} />
                </button>
                
                {hostelId && currentImage.id && (
                  <button
                    onClick={() => handleDelete(currentImage.id)}
                    disabled={isDeleting || deletingImageId === currentImage.id}
                    className="p-2 bg-red-600/80 backdrop-blur-sm rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete image"
                  >
                    {deletingImageId === currentImage.id ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={20} />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 p-2 bg-black/50 backdrop-blur-sm rounded-lg">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentIndex(index)}
                className={`w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                  index === currentIndex 
                    ? 'border-orange-500 scale-110' 
                    : 'border-transparent hover:border-white/50'
                }`}
              >
                <img
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostelImageGallery;
