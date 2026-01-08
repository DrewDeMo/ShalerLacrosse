import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, X } from 'lucide-react';

export default function ImageUpload({
    currentImage,
    onImageUploaded,
    bucketName = 'player-photos',
    label = 'Player Photo'
}) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage);
    const [isDragging, setIsDragging] = useState(false);

    const uploadFile = async (file) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        setUploading(true);

        try {
            // Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file);

            if (error) throw error;

            // Get public URL
            const { data: urlData } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            const publicUrl = urlData.publicUrl;
            setPreview(publicUrl);
            onImageUploaded(publicUrl);
        } catch (error) {
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        await uploadFile(file);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        await uploadFile(file);
    };

    const handleRemove = () => {
        setPreview(null);
        onImageUploaded(null);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-navy mb-2">
                {label}
            </label>

            {preview ? (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-1 bg-red text-white rounded-full hover:bg-red/90 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <label
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${isDragging
                        ? 'border-red bg-red/5 scale-105'
                        : 'border-gray-300 hover:bg-gray-50'
                        }`}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <Upload className={`w-8 h-8 mb-2 transition-colors ${isDragging ? 'text-red' : 'text-gray-400'}`} />
                    <span className="text-sm text-gray-600 font-medium">
                        {uploading ? 'Uploading...' : isDragging ? 'Drop image here' : 'Drag & drop or click to upload'}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                        PNG, JPG, GIF up to 10MB
                    </span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="hidden"
                    />
                </label>
            )}
        </div>
    );
}
