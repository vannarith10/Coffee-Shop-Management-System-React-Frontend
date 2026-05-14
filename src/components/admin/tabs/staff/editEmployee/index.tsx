import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../../../../utils/cropImage';
import { toast } from 'sonner';
import { WeekDay } from '../types';
import { EditStaffFormData } from './types';
import EditFormHeader from './EditFormHeader';
import AvatarSection from './AvatarSection';
import StaffInfoFields from './StaffInfoFields';
import EditWorkingDaysPicker from './EditWorkingDaysPicker';
import RoleShiftStatusFields from './RoleShiftStatusFields';
import SecuritySection from './SecuritySection';
import EditFormFooter from './EditFormFooter';

export interface EditEmployeeFormProps {
  /** Pre-populated read-only display name shown in the header subtitle */
  staffName?: string;
  currentUsername?: string;
  avatarUrl?: string;
  onClose: () => void;
  onSubmit?: (data: EditStaffFormData) => void;
  initialData?: Partial<EditStaffFormData>;
}

export default function EditEmployeeForm({
  staffName = 'Staff Member',
  avatarUrl,
  onClose,
  onSubmit,
  initialData,
}: EditEmployeeFormProps) {
  const [formData, setFormData] = useState<EditStaffFormData>({
    staffName: '', // Show as placeholder, don't auto-fill
    username: '',  // Show as placeholder, don't auto-fill
    email: initialData?.email ?? '',
    phone: initialData?.phone ?? '',
    workingDays: initialData?.workingDays ?? [],
    role: initialData?.role ?? 'barista',
    shift: initialData?.shift ?? 'morning',
    isActive: initialData?.isActive ?? true,
    newPassword: '',
    confirmPassword: '',
  });

  const [previewUrl, setPreviewUrl] = useState<string | undefined>(avatarUrl);

  // Cropper states
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImageToCrop(reader.result as string);
      setIsCropping(true);
    });
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_extendedCroppedArea: any, pixelCrop: any) => {
    setCroppedAreaPixels(pixelCrop);
  }, []);

  const handleCropSave = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;

    try {
      const croppedImageBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
      if (croppedImageBlob) {
        const croppedFile = new File([croppedImageBlob], "avatar.jpg", { type: 'image/jpeg' });
        
        // Revoke previous object URL if it was a local one
        if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
        
        const newPreviewUrl = URL.createObjectURL(croppedImageBlob);
        setPreviewUrl(newPreviewUrl);
        setFormData(prev => ({ ...prev, avatarFile: croppedFile }));
        
        setIsCropping(false);
        setImageToCrop(null);
        toast.success("Avatar updated!");
      }
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Failed to crop image");
    }
  };

  const handleCropCancel = () => {
    setIsCropping(false);
    setImageToCrop(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day: WeekDay) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  const handleActiveToggle = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    onClose();
  };

  return (
    <div className="w-full max-w-6xl max-h-[90vh] flex flex-col bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
      {/* Header */}
      <EditFormHeader staffName={formData.staffName || staffName} onClose={onClose} />

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 md:p-10 edit-form-scrollbar">
          <div className="flex flex-col lg:flex-row-reverse gap-8 lg:gap-12">
            {/* Main Content Area */}
            <div className="flex-[1.4] space-y-8">
              <StaffInfoFields 
                formData={formData} 
                currentStaffName={staffName}
                currentUsername={initialData?.username}
                onChange={handleChange} 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <EditWorkingDaysPicker
                  selectedDays={formData.workingDays}
                  onToggle={handleDayToggle}
                />
                <RoleShiftStatusFields
                  formData={formData}
                  onChange={handleChange}
                  onActiveToggle={handleActiveToggle}
                />
              </div>

              <SecuritySection formData={formData} onChange={handleChange} />
            </div>

            {/* Avatar Section - Left Side (as requested) */}
            <div className="lg:w-72 w-full max-w-[260px] mx-auto lg:mx-0 shrink-0 flex flex-col items-center border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-[#3c5342]/30 pb-8 lg:pb-0 lg:pr-12 mb-4 lg:mb-0">
              <AvatarSection 
                staffName={formData.staffName || staffName} 
                avatarUrl={previewUrl} 
                onFileSelect={handleFileSelect}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <EditFormFooter onClose={onClose} onSubmit={handleSubmit} />
      </form>

      {/* ─── Cropper Overlay ────────────────────────────────────── */}
      {isCropping && imageToCrop && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col gap-6 no-scrollbar p-1">
            <div className="text-center">
              <h4 className="text-2xl font-black text-white tracking-tight">Crop Profile Photo</h4>
              <p className="text-white/50 text-xs uppercase tracking-widest font-bold mt-1">Adjust for 1:1 ratio</p>
            </div>

            <div className="relative aspect-square w-full bg-[#0a140c] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="rect"
                showGrid={true}
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="material-symbols-outlined text-white/50 text-sm">zoom_out</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 accent-[#14b83d] h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <span className="material-symbols-outlined text-white/50 text-sm">zoom_in</span>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleCropCancel}
                  className="flex-1 py-4 bg-white/5 border border-white/10 text-white text-sm font-bold rounded-xl hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCropSave}
                  className="flex-[2] py-4 bg-[#14b83d] text-white text-sm font-bold rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl">crop</span>
                  <span>Apply Crop</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scoped scrollbar styles */}
      <style>{`
        .edit-form-scrollbar::-webkit-scrollbar { width: 6px; }
        .edit-form-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .edit-form-scrollbar::-webkit-scrollbar-thumb { background: #3c5342; border-radius: 10px; }
        .edit-form-scrollbar::-webkit-scrollbar-thumb:hover { background: #14b83d; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
