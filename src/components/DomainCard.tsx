import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toggleFavorite, isFavorite } from "../lib/favorites";
import type { Domain } from "../lib/types";

interface Props {
  domain: Domain;
  index?: number;
  showFavorite?: boolean;
}

export default function DomainCard({ domain, index = 0, showFavorite = true }: Props) {
  // ✅ التحقق من وجود domain
  if (!domain) {
    console.warn("DomainCard received undefined domain");
    return null;
  }

  const slug = `${domain.name || ""}${domain.tld || ""}`;
  const isMakeOffer = domain.price === null;
  const [favorited, setFavorited] = useState(false);
  const [, setRefresh] = useState(0);

  useEffect(() => {
    if (domain?.id) {
      setFavorited(isFavorite(domain.id));
    }
  }, [domain]);

  function handleToggleFav(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!domain?.id) return;
    toggleFavorite(domain.id);
    setFavorited(!favorited);
    setRefresh((r) => r + 1);
  }

  // ✅ عرض آمن للاسم والامتداد
  const domainName = domain.name || "???";
  const domainTld = domain.tld || ".com";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link
        to={`/domain/${slug}`}
        className="luxury-card relative block rounded-2xl p-6 overflow-hidden group h-full"
      >
        {/* Favorite button */}
        {showFavorite && (
          <button
            onClick={handleToggleFav}
            className={`absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center transition z-10 ${
              favorited 
                ? "bg-gradient-to-br from-[#4a9d93] to-[#226962] text-white shadow-lg shadow-[#4a9d93]/30" 
                : "bg-white border border-gray-200 text-gray-300 hover:text-[#a6553a] hover:border-[#a6553a]"
            }`}
            title={favorited ? "إزالة من المفضلة" : "إضافة للمفضلة"}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        )}

        {/* status pill */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#6b7572]">
            Premium Domain
          </span>
          <span className="text-[10px] px-2.5 py-1 rounded-full border border-[#4a9d93]/50 text-[#4a9d93] bg-[#eaf4f1]">
            متاح
          </span>
        </div>

        {/* ✅ DOMAIN NAME - عرض النطاق بشكل صحيح */}
        <div className="mb-4 text-center">
          <div className="flex items-baseline justify-center gap-1 flex-wrap">
            <h3 className="domain-display text-4xl md:text-5xl font-bold text-[#1a2422] group-hover:text-[#4a9d93] transition-colors duration-500">
              {domainName}
            </h3>
            <span className="domain-display text-2xl md:text-3xl text-[#4a9d93] font-light">
              {domainTld}
            </span>
          </div>
          {domain.arabicName && (
            <p className="mt-2 text-[#6b7572] text-sm">
              {domain.arabicName}
            </p>
          )}
        </div>

        {/* description */}
        <p className="text-[#6b7572] text-sm leading-6 line-clamp-2 mb-6 min-h-[3rem] text-center">
          {domain.description || "نطاق مميز في سوق النطاقات العربية الفاخرة"}
        </p>

        {/* footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#e4dfd2]">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#6b7572] mb-1">
              السعر
            </div>
            {isMakeOffer ? (
              <div className="text-[#4a9d93] font-bold text-sm">قدّم عرضك</div>
            ) : (
              <div className="text-[#1a2422] font-black text-xl">
                ${(domain.price ?? 0).toLocaleString("en-US")}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#6b7572]">
            <span className="inline-flex items-center gap-1">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              {(domain.views ?? 0).toLocaleString("ar-EG")}
            </span>
          </div>
        </div>

        {/* hover shimmer */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute -inset-x-10 -top-10 h-40 shimmer" />
        </div>
      </Link>
    </motion.div>
  );
}