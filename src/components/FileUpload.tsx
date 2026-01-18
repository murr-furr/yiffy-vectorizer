import React, { useCallback } from 'react';
import { UploadCloud } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onFileSelect(e.dataTransfer.files[0]);
      }
    },
    [onFileSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        onFileSelect(e.target.files[0]);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      className="border-2 border-dashed border-zinc-200 rounded-lg p-8 text-center hover:bg-zinc-50 hover:border-zinc-300 transition-all cursor-pointer group relative bg-zinc-50/50"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <input
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex flex-col items-center gap-3 text-zinc-500 group-hover:text-zinc-900 transition-colors">
        <div className="bg-white p-3 rounded-full shadow-sm border border-zinc-100">
          <UploadCloud size={24} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />
        </div>
        <div className="text-sm font-medium">
          <span className="text-zinc-900">Click to upload</span> or drag and drop
        </div>
        <div className="text-xs text-zinc-400">PNG, JPG or WEBP (max 5MB)</div>
      </div>
    </div>
  );
};
