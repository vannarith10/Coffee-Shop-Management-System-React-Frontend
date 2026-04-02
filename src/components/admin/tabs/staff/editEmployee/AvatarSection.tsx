import { useRef, useState } from 'react';

interface AvatarSectionProps {
  staffName: string;
  avatarUrl?: string;
}

export default function AvatarSection({ staffName, avatarUrl }: AvatarSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Revoke previous object URL to avoid memory leaks
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const displayUrl = previewUrl ?? avatarUrl;

  return (
    <div className="flex flex-col items-center mb-6">
      {/* Hidden file input — triggered by the camera button */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="relative">
        {displayUrl ? (
          <img
            src={displayUrl}
            alt={staffName}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-400"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center ring-4 ring-gray-400">
            <span className="text-2xl font-bold text-primary">
              {staffName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-[-10px] hover:cursor-pointer hover:bg-white flex items-center justify-center right-[-10px] bg-primary w-8 h-8 rounded-full border-4 border-gray-400 hover:border-green-600"
          title="Change profile picture"
        >
          <span className="material-symbols-outlined text-xl! text-gray-800">photo_camera</span>
        </button>
      </div>
    </div>
  );
}
