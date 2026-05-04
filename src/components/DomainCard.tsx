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
  const slug = `${domain.name}${domain.tld}`;
  const isMakeOffer = domain.price === null;
  const [favorited, setFavorited] = useState(false);
  const [, setRefresh] = useState(0);

  useEffect(() => {
    setFavorited(isFavorite(domain.id));
  }, [domain.id]);

  function handleToggleFav(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(domain.id);
    setFavorited(!favorited);
    setRefresh((r) => r + 1);
  }

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
                ? "bg-gradient-to-br from-[#91eff2] to-[#5bc9cc] text-white shadow-lg shadow-[#91eff2]/30" 
                : "bg-white border border-gray-200 text-gray-300 hover:text-red-400 hover:border-red-200"
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
          <span className="text-[10px] tracking-[0.25em] uppercase text-gray-400">
            Premium Domain
          </span>
          <span className="text-[10px] px-2.5 py-1 rounded-full border border-emerald-300/50 text-emerald-600 bg-emerald-50">
            متاح
          </span>
        </div>

        {/* domain name */}
        <div className="mb-4">
          <div className="flex items-baseline gap-1">
            <h3 className="domain-display text-4xl md:text-5xl font-bold text-[#0a1a3a] group-hover:text-[#2ab0b4] transition-colors duration-500">
              {domain.name}
            </h3>
            <span className="domain-display text-2xl md:text-3xl text-[#91eff2] font-light">
              {domain.tld}
            </span>
          </div>
          {domain.arabicName && (
            <p className="mt-1 text-gray-400 text-sm">
              ({domain.arabicName})
            </p>
          )}
        </div>

        {/* description */}
        <p className="text-gray-500 text-sm leading-6 line-clamp-2 mb-6 min-h-[3rem]">
          {domain.description}
        </p>

        {/* footer */}
        <div className="flex items-end justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
              السعر
            </div>
            {isMakeOffer ? (
              <div className="text-emerald-600 font-bold">قدّم عرضك</div>
            ) : (
              <div className="text-[#0a1a3a] font-black text-xl">
                ${(domain.price ?? 0).toLocaleString("en-US")}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              {domain.views.toLocaleString("ar-EG")}
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
