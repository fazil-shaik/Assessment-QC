import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

interface ImageUploadProps {
    onUpload: (url: string) => void;
    currentImage?: string;
    disabled?: boolean;
}

export const ImageUpload = ({ onUpload, currentImage, disabled }: ImageUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('/api/uploads', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onUpload(res.data.url);
        } catch (err) {
            console.error("Upload failed", err);
            alert("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    if (currentImage) {
        return (
            <div className="relative group w-20 h-20 rounded-md overflow-hidden border">
                <img src={currentImage} alt="Uploaded" className="w-full h-full object-cover" />
                {!disabled && (
                    <button
                        onClick={() => onUpload('')}
                        className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>
        );
    }

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={disabled || uploading}
            />
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || uploading}
            >
                {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                Upload
            </Button>
        </div>
    );
};
