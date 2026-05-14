import { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../../../../utils/cropImage';
import { toast } from 'sonner';
import { EmployeeFormData, WeekDay, CreateEmployeeRequest, StaffRole, StaffShift, StaffScheduleDay } from '../types';
import { DEFAULT_FORM } from './constants';
import FormHeader from './FormHeader';
import PersonalInfoFields from './PersonalInfoFields';
import WorkingDaysPicker from './WorkingDaysPicker';
import AccountSettingsFields from './AccountSettingsFields';
import FormFooter from './FormFooter';
import { dashboardService } from '../../../../../services/adminDashboardService';

interface AddEmployeeFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

// ── Mapping helpers ────────────────────────────────────────────────────────────
const DAY_MAP: Record<WeekDay, StaffScheduleDay> = {
  mon: 'MONDAY',
  tue: 'TUESDAY',
  wed: 'WEDNESDAY',
  thu: 'THURSDAY',
  fri: 'FRIDAY',
  sat: 'SATURDAY',
  sun: 'SUNDAY',
};

const ROLE_MAP: Record<EmployeeFormData['role'], StaffRole> = {
  staff:   'STAFF',
  barista: 'BARISTA',
  cashier: 'CASHIER',
  admin:   'ADMIN',
};

const SHIFT_MAP: Record<EmployeeFormData['shift'], StaffShift> = {
  morning:   'MORNING',
  afternoon: 'AFTERNOON',
  full_day:  'FULL_DAY',
};

function buildPayload(formData: EmployeeFormData): CreateEmployeeRequest {
  return {
    full_name: formData.fullName.trim(),
    username:  formData.username.trim(),
    password:  formData.password,
    role:      ROLE_MAP[formData.role],
    shift:     SHIFT_MAP[formData.shift],
    schedules: formData.workingDays.map((d) => DAY_MAP[d]),
    status:    formData.isActive ? 'ACTIVE' : 'INACTIVE',
    image:     formData.avatarFile,
  };
}

function parseApiError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const detail: string = err.response?.data?.detail ?? '';
    const status: number = err.response?.status ?? 0;

    if (status === 409 || detail.toLowerCase().includes('username'))
      return 'Username is already taken. Please choose a different one.';

    if (detail.toLowerCase().includes('weak password') || detail.toLowerCase().includes('password'))
      return 'Weak password. Please include uppercase, lowercase, a number, and a special character (e.g. Barista#1234).';

    if (detail) return detail;
    if (status === 400) return 'Invalid request. Please check your information.';
  }
  return 'Failed to create employee. Please try again.';
}

export default function AddEmployeeForm({ onClose, onSuccess }: AddEmployeeFormProps) {
  const [formData, setFormData] = useState<EmployeeFormData>(DEFAULT_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cropper states
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageToCrop(reader.result as string);
        setIsCropping(true);
      });
      reader.readAsDataURL(file);
    }
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
        
        if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
        
        const newPreviewUrl = URL.createObjectURL(croppedImageBlob);
        setPreviewUrl(newPreviewUrl);
        setFormData(prev => ({ ...prev, avatarFile: croppedFile }));
        
        setIsCropping(false);
        setImageToCrop(null);
        toast.success("Profile photo ready!");
      }
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Failed to crop image");
    }
  };

  const handleCropCancel = () => {
    setIsCropping(false);
    setImageToCrop(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null); // clear error on any change
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    // Basic client-side validation
    if (!formData.fullName.trim()) { setError('Full name is required.'); return; }
    if (!formData.username.trim()) { setError('Username is required.'); return; }
    if (!formData.password)        { setError('Password is required.'); return; }
    if (formData.workingDays.length === 0) { setError('Please select at least one working day.'); return; }

    setIsLoading(true);
    setError(null);
    try {
      await dashboardService.createEmployee(buildPayload(formData));
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
      {/* Header */}
      <FormHeader onClose={onClose} />

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-8 md:p-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Main Content Area */}
          <div className="flex-[1.4]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              {/* Left Column */}
              <div className="space-y-8">
                <PersonalInfoFields formData={formData} onChange={handleChange} />
                <WorkingDaysPicker
                  selectedDays={formData.workingDays}
                  onToggle={handleDayToggle}
                />
              </div>

              {/* Right Column */}
              <AccountSettingsFields
                formData={formData}
                onChange={handleChange}
                onActiveToggle={handleActiveToggle}
              />
            </div>
          </div>

          {/* Avatar Section - Right Side */}
          <div className="lg:w-72 w-full max-w-[260px] mx-auto lg:mx-0 shrink-0 flex flex-col items-center border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-[#3c5342]/30 pt-8 lg:pt-0 lg:pl-12 mt-4 lg:mt-0">
            <div className="w-full max-w-[260px] lg:max-w-none mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#9db8a4] mb-4 text-center lg:text-left">
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
                  onChange={handleFileSelect} 
                />
                
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                ) : (
                  <div className="flex flex-col items-center text-slate-400 dark:text-[#3c5342] group-hover:text-[#14b83d] transition-colors">
                    <span className="material-symbols-outlined text-6xl mb-3" style={{ fontVariationSettings: "'wght' 200" }}>add_a_photo</span>
                    <p className="uppercase tracking-[0.2em] text-[10px] font-black">Upload Photo</p>
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                  <div className="bg-white/10 p-4 rounded-full border border-white/20">
                    <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mt-5 flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/40 rounded-lg">
            <span className="material-symbols-outlined text-red-500 text-lg flex-shrink-0 mt-0.5">error</span>
            <p className="text-xs text-red-700 dark:text-red-300 leading-snug">{error}</p>
          </div>
        )}

        {/* Footer: info banner + action buttons */}
        <FormFooter onClose={onClose} onSubmit={handleSubmit} isLoading={isLoading} />
      </form>

      {/* ─── Cropper Overlay ────────────────────────────────────── */}
      {isCropping && imageToCrop && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-xl flex flex-col gap-6">
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
    </div>
  );
}
