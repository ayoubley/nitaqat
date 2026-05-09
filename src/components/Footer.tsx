import { Link } from "react-router-dom";
import { SITE_CONFIG } from "../lib/db";

export default function Footer() {
  return (
    <footer className="relative mt-0 border-t border-[#e4dfd2] bg-[#fbfaf6] overflow-hidden">
      {/* Bottom glow - updated to teal */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(74,157,147,0.15)_0%,rgba(74,157,147,0.05)_50%,transparent_80%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 py-14 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4a9d93] to-[#226962] flex items-center justify-center shadow-lg shadow-[#4a9d93]/20">
              <span className="font-black text-white">ن</span>
            </div>
            <div>
              <div className="font-black text-lg text-[#1a2422]">{SITE_CONFIG.brandName}</div>
              <div className="text-[10px] tracking-[0.3em] text-[#6b7572] uppercase">
                Premium Arabic Domain Boutique
              </div>
            </div>
          </div>
          <p className="mt-5 text-[#6b7572] leading-7 max-w-md">
            بوتيك متخصص في تنسيق وبيع نطاقات عربية فاخرة من كلمة واحدة، مُختارة
            بعناية لخدمة العلامات التجارية الراقية والشركات الطموحة في العالم العربي.
          </p>
        </div>

        <div>
          <h4 className="text-[#1a2422] font-bold mb-4">روابط سريعة</h4>
          <ul className="space-y-2 text-[#6b7572] text-sm">
            <li><Link className="hover:text-[#4a9d93] transition" to="/domains">كل النطاقات</Link></li>
            <li><Link className="hover:text-[#4a9d93] transition" to="/about">من نحن</Link></li>
            <li><Link className="hover:text-[#4a9d93] transition" to="/contact">تواصل</Link></li>
            <li><Link className="hover:text-[#4a9d93] transition" to="/admin">لوحة التحكم</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[#1a2422] font-bold mb-4">الثقة والأمان</h4>
          <ul className="space-y-2 text-[#6b7572] text-sm">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4a9d93]" />
              معاملات آمنة عبر Escrow.com
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#226962]" />
              نقل ملكية موثّق
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4a9d93]" />
              دعم خلال أيام العمل
            </li>
          </ul>
        </div>
      </div>

      <div className="relative z-10 border-t border-[#e4dfd2]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#6b7572]">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.brandName}. جميع الحقوق محفوظة.</p>
          <p className="tracking-widest uppercase">Crafted with ✦ in the Gulf</p>
        </div>
      </div>
    </footer>
  );
}