import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface ImageUploadProps {
  domainId: string;
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
}

export default function ImageUpload({ domainId, currentImageUrl, onImageUploaded }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImageUrl || '');

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      alert('يرجى رفع ملف صورة فقط (jpg, png, webp)');
      return;
    }

    // التحقق من الحجم (حد أقصى 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('حجم الصورة لا يتجاوز 2 ميجابايت');
      return;
    }

    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${domainId}-${Date.now()}.${fileExt}`;
      const filePath = `domains/${fileName}`;

      // رفع الصورة إلى Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('domain-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // الحصول على الرابط العام
      const { data: { publicUrl } } = supabase.storage
        .from('domain-images')
        .getPublicUrl(filePath);

      setPreview(publicUrl);
      onImageUploaded(publicUrl);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('فشل رفع الصورة. تأكد من إعدادات Storage في Supabase.');
    } finally {
      setUploading(false);
    }
  }

  function removeImage() {
    setPreview('');
    onImageUploaded('');
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs uppercase tracking-widest text-[#6b7572]">
        صورة النطاق (اختياري)
      </label>
      
      {preview && (
        <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-[#e4dfd2] bg-[#f6f4ee]">
          <img src={preview} alt="Domain preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600 transition"
          >
            ×
          </button>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={uploadImage}
        disabled={uploading}
        className="block w-full text-sm text-[#6b7572] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#4a9d93] file:text-white hover:file:bg-[#226962] transition cursor-pointer"
      />
      
      {uploading && (
        <div className="flex items-center gap-2 text-sm text-[#4a9d93]">
          <div className="w-4 h-4 border-2 border-[#4a9d93] border-t-transparent rounded-full animate-spin" />
          جاري رفع الصورة...
        </div>
      )}
      
      <p className="text-[10px] text-[#6b7572]">
        يمكنك رفع صورة للنطاق (jpg, png, webp - حد أقصى 2MB). ستظهر في البطاقة وصفحة التفاصيل.
      </p>
    </div>
  );
}