"use client";

import React, { useState, useRef } from 'react';
import { UploadCloud, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { sellerProductService } from '@/services/sellerProductService';
import { showToast } from '@/utils/toast';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  onImageRemoved: () => void;
  defaultImage?: string;
  className?: string;
  uploadType?: 'product' | 'store' | 'user';
}

export function ImageUpload({ 
  onImageUploaded, 
  onImageRemoved, 
  defaultImage,
  className = '',
  uploadType = 'product'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast.error('Invalid File', 'Please select an image file (JPG, PNG, dll).');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast.error('File Too Large', 'Maximum image size is 5MB.');
      return;
    }

    try {
      setIsUploading(true);

      // Show local preview immediately
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Upload via backend
      const { url } = await sellerProductService.uploadProductImage(file, uploadType);

      onImageUploaded(url);
      
      let successMsg = 'Gambar produk berhasil diunggah.';
      if (uploadType === 'store') successMsg = 'Logo toko berhasil diunggah.';
      if (uploadType === 'user') successMsg = 'Foto profil berhasil diunggah.';
      showToast.success('Upload Berhasil', successMsg);
      
    } catch (error: any) {
      console.error('Upload Error:', error);
      const msg = error.response?.data?.detail || error.message || 'Gagal mengunggah gambar.';
      showToast.error('Upload Gagal', msg);
      setPreviewUrl(defaultImage || null); // revert preview
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onImageRemoved();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp"
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative w-full aspect-video rounded-xl border border-slate-200 overflow-hidden bg-slate-50 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={previewUrl} 
            alt="Product Preview" 
            className={`w-full h-full object-cover transition-opacity ${isUploading ? 'opacity-50' : 'opacity-100'}`}
          />
          
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          )}

          {!isUploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed bg-slate-50"
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          ) : (
            <>
              <div className="p-3 bg-white rounded-full shadow-sm text-slate-400 group-hover:text-blue-500 group-hover:scale-110 transition-all">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">Klik untuk unggah gambar</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG atau WEBP (Max. 5MB)</p>
              </div>
            </>
          )}
        </button>
      )}
    </div>
  );
}
