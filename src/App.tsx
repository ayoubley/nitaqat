import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Domains from "./pages/Domains";
import DomainDetails from "./pages/DomainDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Favorites from "./pages/Favorites";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

// مكون يكتشف الدومين الوارد ويعيد توجيهه (مع تحسين لمنع الحلقات)
function DomainRedirect() {
  const { pathname, hash } = useLocation();
  const hostname = window.location.hostname;
  
  // النطاقات الرئيسية المقبولة
  const mainDomains = ["nitaqat.vercel.app", "nitaqat-brown.vercel.app", "localhost", "nitaqat.com"];
  const isMainDomain = mainDomains.includes(hostname);
  
  useEffect(() => {
    // إذا كان الدومين ليس رئيسياً ولم يتم التوجيه مسبقاً
    if (!isMainDomain && !hash.includes("/domain/")) {
      const domainSlug = hostname.replace(/^www\./, "");
      // استخدام replace بدلاً من تعيين مباشر لتجنب إعادة التحميل
      window.location.hash = `#/domain/${domainSlug}`;
    }
  }, [hostname, isMainDomain, hash]);

  return null;
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <DomainRedirect />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/domains" element={<Domains />} />
            <Route path="/domain/:slug" element={<DomainDetails />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}

function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-5 py-32 text-center">
      <div className="gold-text text-7xl font-black">404</div>
      <p className="mt-3 text-[#6b7572]">الصفحة المطلوبة غير موجودة.</p>
      <a href="/" className="inline-block mt-6 px-6 py-3 bg-[#4a9d93] text-white rounded-full text-sm hover:bg-[#226962] transition">
        العودة إلى الرئيسية
      </a>
    </div>
  );
}