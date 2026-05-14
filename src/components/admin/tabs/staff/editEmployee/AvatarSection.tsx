import { useRef } from 'react';

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
      e.target.value = '';
    }
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#9db8a4] mb-4">
        Employee Photo
      </label>
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="relative group cursor-pointer w-full aspect-square bg-slate-50 dark:bg-[#112115] rounded-2xl border-2 border-dashed border-slate-200 dark:border-[#3c5342] flex flex-col items-center justify-center hover:border-[#14b83d] transition-all duration-300 overflow-hidden shadow-sm"
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
        
        {avatarUrl ? (
          <img src={avatarUrl} alt={staffName} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
        ) : (
          <div className="flex flex-col items-center text-slate-400 dark:text-[#3c5342] group-hover:text-[#14b83d] transition-colors text-center p-4">
            <span className="material-symbols-outlined text-6xl mb-3" style={{ fontVariationSettings: "'wght' 200" }}>add_a_photo</span>
            <p className="uppercase tracking-[0.2em] text-[10px] font-black">Change Photo</p>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
          <div className="bg-white/10 p-4 rounded-full border border-white/20">
            <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
          </div>
        </div>
      </div>
      <p className="mt-4 text-[10px] text-center font-bold text-slate-400 dark:text-[#3c5342] uppercase tracking-widest">
        Click to upload new avatar
      </p>
    </div>
  );
}
