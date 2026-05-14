import React, { useState, useRef, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../../../utils/cropImage';
import { toast } from 'sonner';
import { dashboardService } from '../../../../services/adminDashboardService';
import { getAccessToken, getRefreshToken } from '../../../../services/authService';
import { useShop } from '../../../../context/ShopContext';



// ─── Types ───────────────────────────────────────────────────────────

interface ThemeOption {
  icon: string;
  label: string;
  value: string;
}

// ─── Data ────────────────────────────────────────────────────────────

const themeOptions: ThemeOption[] = [

  { icon: 'settings_brightness', label: 'System', value: 'system' },
  { icon: 'light_mode', label: 'Light', value: 'light' },
  { icon: 'dark_mode', label: 'Dark', value: 'dark' },
];

const languages = [
  { value: 'en', label: 'English (United States)' },
  { value: 'km', label: 'Khmer (ភាសាខ្មែរ)' },
];

const printerMethods = ['IP Network', 'Bluetooth'];

// ─── Component ───────────────────────────────────────────────────────

export default function SettingsContent() {
  const [activeTab, setActiveTab] = useState('Shop Profile');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Shop Profile State

  const [shopName, setShopName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState('');
  const [about, setAbout] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { refreshShopProfile } = useShop();

  useEffect(() => {
    const fetchShopProfile = async () => {
      if (!getAccessToken() && !getRefreshToken()) return;
      
      setIsLoading(true);

      try {
        const data = await dashboardService.getShopProfile();
        setShopName(data.name);
        setContact(data.contact);
        setAddress(data.address);
        setRegion(data.region);
        setAbout(data.description);
        
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
        const logoUrl = data.image_url 
          ? (data.image_url.startsWith('http') || data.image_url.startsWith('blob:')
              ? data.image_url 
              : `${API_BASE_URL}${data.image_url}`)
          : null;
        setLogoPreview(logoUrl);
      } catch (error) {
        console.error("Error fetching shop profile:", error);
        toast.error("Failed to load shop profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopProfile();
  }, []);


  // App Preferences State
  const [selectedTheme, setSelectedTheme] = useState('system');
  const [language, setLanguage] = useState('en');
  const [printerMethod, setPrinterMethod] = useState('IP Network');
  const [printerIP, setPrinterIP] = useState('192.168.1.45');
  const [autoPrint, setAutoPrint] = useState(true);

  const [lowStock, setLowStock] = useState({
    enabled: true,
    push: true,
    email: true,
    sound: false,
  });

  const [newOrders, setNewOrders] = useState({
    enabled: true,
    push: true,
    email: false,
    sound: true,
  });

  // Cropper states
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        // Revoke previous preview if it was a blob URL
        if (logoPreview && logoPreview.startsWith('blob:')) URL.revokeObjectURL(logoPreview);
        
        const newPreviewUrl = URL.createObjectURL(croppedImageBlob);
        setLogoPreview(newPreviewUrl);
        setLogoFile(new File([croppedImageBlob], 'shop_logo.jpg', { type: 'image/jpeg' }));
        
        setIsCropping(false);
        setImageToCrop(null);
        toast.success("Logo updated successfully!");
      }
    } catch (error) {
      console.error("Error cropping logo:", error);
      toast.error("Failed to crop logo");
    }
  };

  const handleCropCancel = () => {
    setIsCropping(false);
    setImageToCrop(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirm = async () => {
    // Validation based on Backend DTO constraints
    if (shopName.length > 100) {
      toast.error("Shop name cannot exceed 100 characters");
      return;
    }
    if (contact.length > 100) {
      toast.error("Contact number cannot exceed 100 characters");
      return;
    }
    if (address.length > 150) {
      toast.error("Address cannot exceed 150 characters");
      return;
    }
    if (about.length > 250) {
      toast.error("Description cannot exceed 250 characters");
      return;
    }
    if (region.length > 50) {
      toast.error("Region cannot exceed 50 characters");
      return;
    }

    setIsLoading(true);
    try {
      await dashboardService.updateShopProfile({
        name: shopName,
        contact,
        address,
        description: about,
        region,
        image: logoFile
      });
      
      await refreshShopProfile();
      toast.success("Shop profile updated successfully!");
      setShowModal(false);
    } catch (error: any) {
      console.error("Error saving shop profile:", error);
      const detail = error.response?.data?.detail || "Failed to update shop profile";
      toast.error(detail);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <style>{`
        .tab-active {
          color: #14b83d;
          border-bottom: 2px solid #14b83d;
        }
      `}</style>

      {/* ─── Save Confirmation Modal ────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0d1a10]/80 backdrop-blur-md"></div>
          <div className="relative w-full max-w-md bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-[#14b83d]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-[#14b83d] text-4xl">save_as</span>
            </div>
            <h2 className="text-2xl font-black mb-3 dark:text-white">Save Changes?</h2>
            <p className="text-slate-600 dark:text-[#9db8a4] text-base mb-8 leading-relaxed">
              Are you sure you want to apply these system and interface updates? Some changes may require a page refresh.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirm}
                className="w-full py-4 bg-[#16a34a] hover:bg-[#16a34a]/90 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-[#16a34a]/20"
              >
                Confirm & Save
              </button>
              <button
                onClick={handleCancel}
                className="w-full py-4 bg-slate-100 dark:bg-[#233d28] hover:bg-slate-200 dark:hover:bg-[#2c4a32] text-slate-700 dark:text-slate-300 rounded-xl font-bold text-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-x-hidden">
        {/* Header */}
        <header className="px-4 md:px-8 pt-6 md:pt-8 pb-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-6">
            <div className="flex flex-col gap-1 min-w-0">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight dark:text-white truncate">
                System Settings
              </h2>
              <p className="text-slate-500 dark:text-[#9db8a4] text-sm md:text-base">
                Customize your interface and system behavior.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="flex-1 sm:flex-none px-6 py-2 bg-[#14b83d] text-white rounded-lg text-sm font-bold shadow-md hover:bg-opacity-90 transition-all whitespace-nowrap"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-[#29382d] overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("Shop Profile")}
              className={
                "px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap " +
                (activeTab === "Shop Profile"
                  ? "tab-active font-bold"
                  : "text-slate-500 dark:text-[#9db8a4] hover:text-[#14b83d]")
              }
            >
              Shop Profile
            </button>
            <button
              onClick={() => setActiveTab("App Preferences")}
              className={
                "px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap " +
                (activeTab === "App Preferences"
                  ? "tab-active font-bold"
                  : "text-slate-500 dark:text-[#9db8a4] hover:text-[#14b83d]")
              }
            >
              App Preferences
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-8 relative">
          {isLoading && (
            <div className="absolute inset-0 z-10 bg-white/50 dark:bg-[#0d1a10]/50 backdrop-blur-[2px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-[#14b83d] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-[#14b83d]">Loading shop profile...</p>
              </div>
            </div>
          )}
          {activeTab === 'Shop Profile' && (

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Form */}
              <div className="lg:col-span-2">
                <section className="bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-xl p-6 shadow-sm flex flex-col">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#14b83d]">store</span>
                    General Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
                    {/* Shop Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Shop Name</label>
                      <input
                        type="text"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        maxLength={100}
                        className="w-full bg-slate-50 dark:bg-[#112115] border border-slate-200 dark:border-[#29382d] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#14b83d] focus:border-[#14b83d] outline-none transition-all"
                      />
                    </div>

                    {/* Contact Number */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Contact Number</label>
                      <input
                        type="tel"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        maxLength={100}
                        className="w-full bg-slate-50 dark:bg-[#112115] border border-slate-200 dark:border-[#29382d] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#14b83d] focus:border-[#14b83d] outline-none transition-all"
                      />
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Address</label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={2}
                        maxLength={150}
                        className="w-full bg-slate-50 dark:bg-[#112115] border border-slate-200 dark:border-[#29382d] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#14b83d] focus:border-[#14b83d] outline-none transition-all resize-y min-h-[60px]"
                      />
                    </div>

                    {/* Region */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Shop Region</label>
                      <input
                        type="text"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        maxLength={50}
                        className="w-full bg-slate-50 dark:bg-[#112115] border border-slate-200 dark:border-[#29382d] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#14b83d] focus:border-[#14b83d] outline-none transition-all"
                        placeholder="e.g. Asia/Phnom_Penh"
                      />
                    </div>


                    {/* About */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">About the Shop</label>
                      <textarea
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        placeholder="Brief description of your coffee shop's mission or history..."
                        rows={3}
                        maxLength={250}
                        className="w-full bg-slate-50 dark:bg-[#112115] border border-slate-200 dark:border-[#29382d] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#14b83d] focus:border-[#14b83d] outline-none transition-all resize-y min-h-[100px]"
                      />
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column: Branding */}
              <div className="h-full">
                {/* Shop Branding */}
                <section className="bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-xl p-6 shadow-sm h-full flex flex-col justify-center items-center">
                  <h3 className="text-lg font-bold mb-8 text-center">Shop Branding</h3>
                  <div className="flex flex-col items-center gap-8 w-full max-w-sm">
                    <div className="relative group">
                      <div className="w-40 h-40 rounded-full flex items-center justify-center text-white text-5xl font-black overflow-hidden ring-4 ring-orange-900/10 transition-transform hover:scale-[1.02] duration-500">
                        {logoPreview ? (
                          <img src={logoPreview} alt="Shop Logo" className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-7xl text-[#7c2d12]">coffee</span>
                        )}
                      </div>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-3 -right-3 w-12 h-12 bg-[#14b83d] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all z-10"
                      >
                        <span className="material-symbols-outlined text-2xl">edit</span>
                      </button>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-base font-black tracking-tight">Shop Identity Logo</p>
                      <p className="text-xs text-slate-500 dark:text-[#9db8a4] max-w-[200px] mx-auto leading-relaxed">
                        Recommended: 512x512px (PNG or SVG) for optimal display quality.
                      </p>
                    </div>
                    <div className="w-full max-w-[240px] space-y-3 pt-4">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleLogoChange} 
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-3 px-4 bg-slate-50 dark:bg-[#112115] border-2 border-dashed border-slate-200 dark:border-[#3c5342] rounded-xl text-xs font-bold text-slate-500 dark:text-[#9db8a4] hover:border-[#14b83d] hover:text-[#14b83d] hover:bg-[#14b83d]/5 transition-all"
                      >
                        Upload New Logo
                      </button>
                      <button 
                        onClick={() => setLogoPreview(null)}
                        className="w-full py-2 text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                      >
                        Remove Current Logo
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {activeTab === 'App Preferences' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* UI/UX Customization */}
                <section className="bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#14b83d]">palette</span>
                    UI/UX Customization
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Theme Selection */}
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Theme Selection</label>
                      <div className="grid grid-cols-3 gap-3">
                        {themeOptions.map((theme) => {
                          const isActive = selectedTheme === theme.value;
                          return (
                            <button
                              key={theme.value}
                              onClick={() => setSelectedTheme(theme.value)}
                              className={
                                'flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ' +
                                (isActive
                                  ? 'border-[#14b83d] bg-[#14b83d]/5 text-[#14b83d]'
                                  : 'border-slate-100 dark:border-[#29382d] hover:border-slate-200 dark:hover:border-[#3c5342]')
                              }
                            >
                              <span className="material-symbols-outlined">{theme.icon}</span>
                              <span className="text-xs font-bold">{theme.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Display Language */}
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Display Language</label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#112115] border border-slate-200 dark:border-[#29382d] rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-[#14b83d] focus:border-[#14b83d] outline-none transition-all appearance-none cursor-pointer"
                      >
                        {languages.map((lang) => (
                          <option key={lang.value} value={lang.value}>{lang.label}</option>
                        ))}
                      </select>
                      <p className="text-[10px] text-slate-500 dark:text-[#9db8a4]">
                        Changing language will update the entire interface and receipt templates.
                      </p>
                    </div>
                  </div>
                </section>

                {/* App Information */}
                <section className="bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold mb-4">App Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 dark:text-[#9db8a4]">Stable Version</span>
                      <span className="font-bold">v2.4.0-CoffeeBean</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 dark:text-[#9db8a4]">Last Updated</span>
                      <span className="font-bold">Oct 12, 2023</span>
                    </div>
                    <div className="flex items-center gap-3 pt-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#14b83d] animate-pulse"></div>
                      <span className="text-sm font-medium">System fully optimized</span>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column */}
              <div className="h-full">
                {/* Printer Settings */}
                <section className="bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-xl p-6 shadow-sm h-full flex flex-col">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#14b83d]">print</span>
                    Printer Settings
                  </h3>
                  <div className="space-y-4 flex flex-col flex-grow">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Connection Method</label>
                      <div className="grid grid-cols-2 gap-2">
                        {printerMethods.map((method) => (
                          <button
                            key={method}
                            onClick={() => setPrinterMethod(method)}
                            className={
                              'py-2 text-xs font-bold rounded-lg border-2 transition-all ' +
                              (printerMethod === method
                                ? 'border-[#14b83d] bg-[#14b83d]/5 text-[#14b83d]'
                                : 'border-slate-100 dark:border-[#29382d] text-slate-500 dark:text-[#9db8a4]')
                            }
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Printer IP Address</label>
                      <input
                        type="text"
                        value={printerIP}
                        onChange={(e) => setPrinterIP(e.target.value)}
                        placeholder="192.168.1.100"
                        className="w-full bg-slate-50 dark:bg-[#112115] border border-slate-200 dark:border-[#29382d] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#14b83d] focus:border-[#14b83d] outline-none transition-all"
                      />
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-[#29382d] mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-500 dark:text-[#9db8a4]">Auto-print Receipts</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            checked={autoPrint}
                            onChange={(e) => setAutoPrint(e.target.checked)}
                            className="sr-only peer"
                            type="checkbox"
                          />
                          <div className="w-9 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-[#14b83d]"></div>
                        </label>
                      </div>
                      <button className="w-full py-2.5 bg-slate-100 dark:bg-[#233d28] text-slate-900 dark:text-white rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-[#2c4a32] transition-colors">
                        Test Print Connection
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
        {/* ─── Logo Cropper Overlay ────────────────────────────────────── */}
        {isCropping && imageToCrop && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col gap-6 no-scrollbar p-1">
              <div className="text-center">
                <h4 className="text-2xl font-black text-white tracking-tight">Crop Shop Logo</h4>
                <p className="text-white/50 text-xs uppercase tracking-widest font-bold mt-1">Adjust for 1:1 square ratio</p>
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

        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    </>
  );
}
