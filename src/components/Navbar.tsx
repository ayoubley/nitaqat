import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getFavorites } from "../lib/favorites";
import { SITE_CONFIG } from "../lib/db";

export default function Navbar() {
  const loc = useLocation();
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    setFavCount(getFavorites().length);
  }, [loc]);

  const links = [
    { to: "/", label: "الرئيسية" },
    { to: "/domains", label: "النطاقات" },
    { to: "/favorites", label: "المفضلة", badge: favCount > 0 ? favCount : undefined },
    { to: "/about", label: "من نحن" },
    { to: "/contact", label: "تواصل" },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-18 py-4 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            initial={{ rotate: -8, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#91eff2] to-[#5bc9cc] shadow-lg shadow-[#91eff2]/30"
          >
            <span className="font-black text-lg text-white">ن</span>
          </motion.div>
          <div className="leading-tight">
            <div className="font-black text-xl tracking-tight text-[#0a1a3a]">
              {SITE_CONFIG.brandName}
            </div>
            <div className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">
              Premium Domains
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-full px-2 py-1.5">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `px-4 py-1.5 text-sm rounded-full transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-gradient-to-l from-[#91eff2]/20 to-[#91eff2]/10 text-[#2ab0b4] border border-[#91eff2]/40 font-semibold"
                    : "text-gray-500 hover:text-[#0a1a3a]"
                }`
              }
            >
              {l.label}
              {l.badge && (
                <span className="ml-1 min-w-[18px] h-[18px] px-1.5 flex items-center justify-center text-[10px] font-bold bg-gradient-to-br from-[#91eff2] to-[#5bc9cc] text-white rounded-full">
                  {l.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/admin"
            className="hidden sm:inline-flex btn-ghost px-4 py-2 rounded-full text-xs font-semibold"
          >
            لوحة التحكم
          </Link>
          <Link
            to="/domains"
            className="btn-cyan px-5 py-2.5 rounded-full text-sm"
          >
            تصفّح النطاقات
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-5 flex justify-between overflow-x-auto">
          {links.map((l) => {
            const active = loc.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-2.5 text-xs whitespace-nowrap flex items-center gap-1 ${
                  active ? "text-[#2ab0b4] font-bold" : "text-gray-400"
                }`}
              >
                {l.label}
                {l.badge && (
                  <span className="min-w-[16px] h-[16px] px-1 flex items-center justify-center text-[9px] font-bold bg-gradient-to-br from-[#91eff2] to-[#5bc9cc] text-white rounded-full">
                    {l.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
