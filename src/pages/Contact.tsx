import { motion } from "framer-motion";
import { SITE_CONFIG } from "../lib/db";

export default function Contact() {
  const wa = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent("مرحباً، أرغب في الاستفسار عن نطاق...")}`;

  return (
    <div className="max-w-4xl mx-auto px-5 lg:px-8 py-16">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-[#5bc9cc] text-xs tracking-[0.3em] uppercase mb-2 font-semibold">
          Get in touch
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-[#0a1a3a] section-title-line">تواصل معنا</h1>
        <p className="mt-5 text-gray-500 max-w-xl leading-8">
          سواء كنت مهتماً بشراء نطاق، أو تبحث عن استشارة لاختيار الاسم المناسب
          لعلامتك التجارية، فريقنا في خدمتك.
        </p>
      </motion.div>

      <div className="mt-10 grid md:grid-cols-2 gap-6">
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="luxury-card rounded-2xl p-7 group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-5">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
            </svg>
          </div>
          <h3 className="font-bold text-xl text-[#0a1a3a] mb-2">واتساب</h3>
          <p className="text-gray-500 text-sm">رد سريع خلال ساعات العمل.</p>
          <div className="mt-4 text-emerald-600 text-sm font-semibold group-hover:underline">
            ابدأ المحادثة ←
          </div>
        </a>

        <div className="luxury-card rounded-2xl p-7">
          <div className="w-12 h-12 rounded-xl bg-[#91eff2]/10 border border-[#91eff2]/30 flex items-center justify-center text-[#2ab0b4] mb-5">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h3 className="font-bold text-xl text-[#0a1a3a] mb-2">بريد إلكتروني</h3>
          <a href={`mailto:${SITE_CONFIG.email}`} className="cyan-text font-semibold text-sm">
            {SITE_CONFIG.email}
          </a>
          <p className="text-gray-400 text-sm mt-3">
            لاستفسارات الشركات والصفقات الخاصة.
          </p>
        </div>
      </div>
    </div>
  );
}
