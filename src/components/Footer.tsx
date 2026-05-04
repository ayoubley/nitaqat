import { Link } from "react-router-dom";
import { SITE_CONFIG } from "../lib/db";

export default function Footer() {
  return (
    <footer className="relative mt-0 border-t border-gray-100 bg-white overflow-hidden">
      {/* Bottom cyan glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(145,239,242,0.2)_0%,rgba(145,239,242,0.05)_50%,transparent_80%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 py-14 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#91eff2] to-[#5bc9cc] flex items-center justify-center shadow-lg shadow-[#91eff2]/20">
              <span className="font-black text-white">ن</span>
            </div>
            <div>
              <div className="font-black text-lg text-[#0a1a3a]">{SITE_CONFIG.brandName}</div>
              <div className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">
                Premium Arabic Domain Boutique
              </div>
            </div>
          </div>
          <p className="mt-5 text-gray-500 leading-7 max-w-md">
            بوتيك متخصص في تنسيق وبيع نطاقات عربية فاخرة من كلمة واحدة، مُختارة
            بعناية لخدمة العلامات التجارية الراقية والشركات الطموحة في العالم
            العربي.
          </p>
        </div>

        <div>
          <h4 className="text-[#0a1a3a] font-bold mb-4">روابط سريعة</h4>
          <ul className="space-y-2 text-gray-500 text-sm">
            <li><Link className="hover:text-[#2ab0b4] transition" to="/domains">كل النطاقات</Link></li>
            <li><Link className="hover:text-[#2ab0b4] transition" to="/about">من نحن</Link></li>
            <li><Link className="hover:text-[#2ab0b4] transition" to="/contact">تواصل</Link></li>
            <li><Link className="hover:text-[#2ab0b4] transition" to="/admin">لوحة التحكم</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[#0a1a3a] font-bold mb-4">الثقة والأمان</h4>
          <ul className="space-y-2 text-gray-500 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#91eff2]" />
              معاملات آمنة عبر Escrow.com
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5bc9cc]" />
              نقل ملكية موثّق
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#91eff2]" />
              دعم خلال أيام العمل
            </li>
          </ul>
        </div>
      </div>

      <div className="relative z-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.brandName}. جميع الحقوق محفوظة.</p>
          <p className="tracking-widest uppercase">Crafted with ✦ in the Gulf</p>
        </div>
      </div>
    </footer>
  );
}
