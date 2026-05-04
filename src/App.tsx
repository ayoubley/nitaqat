import { HashRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
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

// مكون يكتشف الدومين الوارد ويعيد توجيهه
function DomainRedirect() {
  const hostname = window.location.hostname; // مثال: sara.com
  const isMainDomain = hostname === "nitaqat.vercel.app" || hostname === "localhost" || hostname === "nitaqat.com";
  
  useEffect(() => {
    if (!isMainDomain) {
      // استخرج اسم الدومين من hostname (sara.com → sara)
      const domainSlug = hostname.replace(/^www\./, "");
      window.location.hash = `#/domain/${domainSlug}`;
    }
  }, [hostname, isMainDomain]);

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
      <div className="cyan-text text-7xl font-black">404</div>
      <p className="mt-3 text-gray-500">الصفحة المطلوبة غير موجودة.</p>
    </div>
  );
}