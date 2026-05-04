import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Domain } from "../lib/types";
import { toggleFavorite, isFavorite } from "../lib/favorites";

interface Props {
  domains: Domain[];
}

export default function FeaturedSlider({ domains }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [, setRefresh] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // تحديث حالة الأزرار عند التمرير
  function updateScrollButtons() {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }

  // تحديث الأزرار عند التحميل
  useEffect(() => {
    updateScrollButtons();
    window.addEventListener("resize", updateScrollButtons);
    return () => window.removeEventListener("resize", updateScrollButtons);
  }, [domains]);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const scrollAmount = 370; // عرض البطاقة + المسافة
    const newScroll =
      direction === "right"
        ? scrollRef.current.scrollLeft + scrollAmount
        : scrollRef.current.scrollLeft - scrollAmount;

    scrollRef.current.scrollTo({ left: newScroll, behavior: "smooth" });

    // تحديث حالة الأزرار بعد التمرير
    setTimeout(updateScrollButtons, 400);
  }

  function handleToggleFav(domainId: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(domainId);
    setRefresh((r) => r + 1);
  }

  return (
    <div className="relative group">
      {/* زر اليمين - التالي */}
      <button
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border shadow-lg flex items-center justify-center transition-all duration-300 ${
          canScrollRight
            ? "bg-white border-gray-200 shadow-gray-200/50 text-[#2ab0b4] hover:scale-110 hover:border-[#91eff2] hover:shadow-[#91eff2]/30 cursor-pointer"
            : "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed opacity-50"
        }`}
        style={{ right: "-24px" }}
        aria-label="الشريحة التالية"
        title="التالي"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* زر اليسار - السابق */}
      <button
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border shadow-lg flex items-center justify-center transition-all duration-300 ${
          canScrollLeft
            ? "bg-white border-gray-200 shadow-gray-200/50 text-[#2ab0b4] hover:scale-110 hover:border-[#91eff2] hover:shadow-[#91eff2]/30 cursor-pointer"
            : "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed opacity-50"
        }`}
        style={{ left: "-24px" }}
        aria-label="الشريحة السابقة"
        title="السابق"
      >
        <svg
          className="w-5 h-5 rotate-180"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* تأثير fade على الأطراف */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white via-white to-transparent z-[5]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white via-white to-transparent z-[5]" />

      {/* حاوية السلايدر */}
      <div
        ref={scrollRef}
        onScroll={updateScrollButtons}
        className="flex gap-5 overflow-x-auto scroll-smooth scrollbar-hide pb-4"
      >
        {domains.map((d) => (
          <div
            key={d.id}
            className="flex-shrink-0"
            style={{ width: "340px" }}
          >
            <SliderCard domain={d} onToggleFav={handleToggleFav} />
          </div>
        ))}
      </div>

      {/* CSS */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function SliderCard({
  domain,
  onToggleFav,
}: {
  domain: Domain;
  onToggleFav: (id: string, e: React.MouseEvent) => void;
}) {
  const slug = `${domain.name}${domain.tld}`;
  const isMakeOffer = domain.price === null || domain.price === undefined;
  const favorited = isFavorite(domain.id);

  return (
    <Link
      to={`/domain/${slug}`}
      className="luxury-card relative block rounded-2xl p-6 overflow-hidden group h-full bg-gradient-to-br from-white to-[#91eff2]/5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Accent border on hover */}
      <div className="absolute inset-0 rounded-2xl border border-[#91eff2] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* زر المفضلة */}
      <button
        onClick={(e) => onToggleFav(domain.id, e)}
        className={`absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center transition-all z-10 ${
          favorited
            ? "bg-gradient-to-br from-[#91eff2] to-[#5bc9cc] text-white shadow-lg shadow-[#91eff2]/30"
            : "bg-white border border-gray-200 text-gray-300 hover:text-red-400 hover:border-red-200"
        }`}
        title={favorited ? "إزالة من المفضلة" : "إضافة للمفضلة"}
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill={favorited ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      {/* الشارات العلوية */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-[10px] tracking-[0.25em] uppercase text-gray-400 font-semibold">
          Premium Domain
        </span>
        <span className="text-[10px] px-2.5 py-1 rounded-full border border-emerald-300/50 text-emerald-600 bg-emerald-50 font-medium">
          متاح
        </span>
      </div>

      {/* اسم النطاق */}
      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <h3 className="domain-display text-3xl font-bold text-[#0a1a3a] group-hover:text-[#2ab0b4] transition-colors duration-500">
            {domain.name}
          </h3>
          <span className="domain-display text-xl text-[#91eff2] font-light">
            {domain.tld}
          </span>
        </div>
        {domain.arabicName && (
          <p className="mt-1 text-gray-400 text-sm">({domain.arabicName})</p>
        )}
      </div>

      {/* الوصف */}
      <p className="text-gray-500 text-sm leading-6 line-clamp-2 mb-6 min-h-[2.75rem]">
        {domain.description || ""}
      </p>

      {/* السعر والإحصائيات */}
      <div className="flex items-end justify-between pt-4 border-t border-gray-100">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1 font-semibold">
            السعر
          </div>
          {isMakeOffer ? (
            <div className="text-emerald-600 font-bold text-sm">قدّم عرضك</div>
          ) : (
            <div className="text-[#0a1a3a] font-black text-lg">
              ${(domain.price ?? 0).toLocaleString("en-US")}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="inline-flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {(domain.views ?? 0).toLocaleString("ar-EG")}
          </span>
        </div>
      </div>
    </Link>
  );
}
