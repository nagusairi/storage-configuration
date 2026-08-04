import React, { useState, useRef } from 'react';
import { ImageIcon, X } from 'lucide-react';

/**
 * ImageUploadInput Component
 * 
 * A reusable image upload component with:
 * - Multiple image upload support
 * - Drag-and-drop functionality
 * - Image thumbnail gallery with preview
 * - Delete individual images
 * - Primary image indication
 * - Image size and type validation
 * - Image lightbox viewer with navigation
 * 
 * @example
 * ```tsx
 * <ImageUploadInput
 *   images={uploadedImages}
 *   onImagesChange={setUploadedImages}
 *   label="Product Images"
 *   maxImages={10}
 *   maxSizeMB={5}
 *   disabled={false}
 * />
 * ```
 */

// ============================================================================
// Type Definitions
// ============================================================================

export interface UploadedImage {
  file: File;
  preview: string;
  id: number;
}

export interface ImageUploadInputProps {
  // Data
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  
  // Configuration
  label?: string;
  maxImages?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  disabled?: boolean;
  required?: boolean;
  
  // Customization
  className?: string;
  uploadAreaClassName?: string;
  thumbnailSize?: 'small' | 'medium' | 'large';
  showPrimaryBadge?: boolean;
}

// ============================================================================
// Main Component
// ============================================================================

export function ImageUploadInput({
  images,
  onImagesChange,
  label = 'Images',
  maxImages = 10,
  maxSizeMB = 5,
  acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
  disabled = false,
  required = false,
  className = '',
  uploadAreaClassName = '',
  thumbnailSize = 'medium',
  showPrimaryBadge = true
}: ImageUploadInputProps) {
  
  // ============================================================================
  // State Management
  // ============================================================================
  
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // ============================================================================
  // Validation
  // ============================================================================
  
  const validateImageFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Invalid file type: ${file.type}. Only ${acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')} are allowed.`;
    }
    
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size ${(file.size / 1024 / 1024).toFixed(1)}MB exceeds ${maxSizeMB}MB limit.`;
    }
    
    return null;
  };
  
  // ============================================================================
  // Event Handlers
  // ============================================================================
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    const fileArray = Array.from(files);
    const newImages: UploadedImage[] = [];
    const errors: string[] = [];
    
    fileArray.forEach(file => {
      // Check max images limit
      if (images.length + newImages.length >= maxImages) {
        errors.push(`Maximum ${maxImages} images allowed.`);
        return;
      }
      
      const error = validateImageFile(file);
      if (error) {
        errors.push(error);
      } else {
        newImages.push({
          file,
          preview: URL.createObjectURL(file),
          id: Date.now() + Math.random()
        });
      }
    });
    
    if (errors.length > 0) {
      alert(`Upload errors:\n${errors.join('\n')}`);
    }
    
    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (!files) return;
    
    const fileArray = Array.from(files);
    const newImages: UploadedImage[] = [];
    const errors: string[] = [];
    
    fileArray.forEach(file => {
      // Check max images limit
      if (images.length + newImages.length >= maxImages) {
        errors.push(`Maximum ${maxImages} images allowed.`);
        return;
      }
      
      const error = validateImageFile(file);
      if (error) {
        errors.push(error);
      } else {
        newImages.push({
          file,
          preview: URL.createObjectURL(file),
          id: Date.now() + Math.random()
        });
      }
    });
    
    if (errors.length > 0) {
      alert(`Upload errors:\n${errors.join('\n')}`);
    }
    
    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    const imageToRemove = images[index];
    URL.revokeObjectURL(imageToRemove.preview);
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
    
    if (selectedImageIndex === index) {
      setSelectedImageIndex(null);
    }
  };
  
  // ============================================================================
  // Cleanup Effect
  // ============================================================================
  
  React.useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, []);
  
  // ============================================================================
  // Thumbnail Size Configuration
  // ============================================================================
  
  const thumbnailSizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-20 h-20',
    large: 'w-24 h-24'
  };
  
  const thumbnailClass = thumbnailSizeClasses[thumbnailSize];
  
  // ============================================================================
  // Render
  // ============================================================================
  
  return (
    <div className={className}>
      {/* Label */}
      <label className="block text-sm text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        multiple
        onChange={handleFileSelect}
        disabled={disabled}
        className="hidden"
      />
      
      {/* Upload Dropzone */}
      <div
        onClick={() => !disabled && images.length < maxImages && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          disabled || images.length >= maxImages 
            ? 'cursor-not-allowed opacity-50' 
            : 'cursor-pointer'
        } ${
          isDragging
            ? 'border-[#5C1F3D] bg-purple-50'
            : 'border-gray-300 hover:border-[#5C1F3D]'
        } ${uploadAreaClassName}`}
      >
        <ImageIcon className={`w-12 h-12 mx-auto mb-3 transition-colors ${
          isDragging ? 'text-[#5C1F3D]' : 'text-gray-400'
        }`} />
        <p className="text-sm text-gray-600 mb-1">
          {isDragging 
            ? 'Drop images here' 
            : images.length >= maxImages
              ? `Maximum ${maxImages} images reached`
              : 'Click to upload or drag and drop'
          }
        </p>
        <p className="text-xs text-gray-500">
          {acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')} up to {maxSizeMB}MB
        </p>
        {maxImages > 1 && (
          <p className="text-xs text-gray-500 mt-1">
            {images.length} / {maxImages} images uploaded
          </p>
        )}
      </div>
      
      {/* Uploaded Images Preview */}
      {images.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-gray-600 font-medium">
            Uploaded Images ({images.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {images.map((image, index) => (
              <div
                key={image.id}
                onClick={() => !disabled && setSelectedImageIndex(index)}
                className="relative group cursor-pointer"
              >
                {/* Primary Badge */}
                {showPrimaryBadge && index === 0 && (
                  <div className="absolute top-1 left-1 z-10">
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-[#5C1F3D] text-white border border-[#5C1F3D]">
                      Primary
                    </span>
                  </div>
                )}
                
                {/* Delete Button */}
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(index);
                    }}
                    className="absolute top-1 right-1 z-10 p-0.5 rounded-full bg-white/90 hover:bg-red-50 border border-gray-200 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-3 h-3 text-red-500" />
                  </button>
                )}
                
                {/* Thumbnail */}
                <div className={`${thumbnailClass} border border-gray-200 rounded-lg overflow-hidden bg-gray-50 hover:border-[#5C1F3D] hover:shadow-md transition-all`}>
                  <img
                    src={image.preview}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Image Lightbox Modal */}
      {selectedImageIndex !== null && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
            onClick={() => setSelectedImageIndex(null)}
          />
          
          {/* Lightbox Content */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
            <div className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {showPrimaryBadge && selectedImageIndex === 0 && (
                      <span className="px-2 py-1 text-xs rounded bg-[#5C1F3D] text-white border border-[#5C1F3D]">
                        Primary Image
                      </span>
                    )}
                    <span className="text-sm text-white">
                      {selectedImageIndex + 1} / {images.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedImageIndex(null)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
              
              {/* Image */}
              <div className="flex items-center justify-center bg-gray-100 h-[70vh]">
                <img
                  src={images[selectedImageIndex].preview}
                  alt={`Image ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              
              {/* Navigation */}
              {images.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setSelectedImageIndex(prev => 
                        prev === null ? null : prev > 0 ? prev - 1 : images.length - 1
                      )}
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors text-white text-sm"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(prev => 
                        prev === null ? null : prev < images.length - 1 ? prev + 1 : 0
                      )}
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors text-white text-sm"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
