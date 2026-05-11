import { useRef, useState } from 'react';

interface AvatarSectionProps {
  staffName: string;
  avatarUrl?: string;
  onFileSelect: (file: File) => void;
}

export default function AvatarSection({ staffName, avatarUrl, onFileSelect }: AvatarSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      // Reset input value so same file can be selected again
      e.target.value = '';
    }
  };

  const displayUrl = avatarUrl;

  return (
    <div className="flex flex-col items-center mb-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div 
        className="relative group cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        {displayUrl ? (
          <img
            src={displayUrl}
            alt={staffName}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-[#14b83d]/30 shadow-lg transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-[#14b83d]/10 flex items-center justify-center ring-4 ring-slate-200 dark:ring-[#29382d] transition-transform group-hover:scale-105">
            <span className="text-3xl font-black text-[#14b83d]">
              {staffName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </span>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
          <span className="material-symbols-outlined text-white text-2xl">photo_camera</span>
        </div>

        {/* Floating Button */}
        <div className="absolute bottom-0 right-0 bg-[#14b83d] w-8 h-8 rounded-full border-4 border-white dark:border-[#112115] flex items-center justify-center text-white shadow-md">
          <span className="material-symbols-outlined text-[18px] font-bold">add</span>
        </div>
      </div>
      <p className="mt-3 text-[10px] font-black text-[#bccbb6] uppercase tracking-widest">Click to change photo</p>
    </div>
  );
}
