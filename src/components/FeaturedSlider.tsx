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

  function updateScrollButtons() {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener("resize", updateScrollButtons);
    return () => window.removeEventListener("resize", updateScrollButtons);
  }, [domains]);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const scrollAmount = 370;
    const newScroll =
      direction === "right"
        ? scrollRef.current.scrollLeft + scrollAmount
        : scrollRef.current.scrollLeft - scrollAmount;

    scrollRef.current.scrollTo({ left: newScroll, behavior: "smooth" });
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
      <button
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border shadow-lg flex items-center justify-center transition-all duration-300 ${
          canScrollRight
            ? "bg-[#fbfaf6] border-[#e4dfd2] shadow-[#1a2422]/5 text-[#226962] hover:scale-110 hover:border-[#4a9d93] hover:shadow-[#4a9d93]/20 cursor-pointer"
            : "bg-[#f6f4ee] border-[#e4dfd2] text-[#6b7572] cursor-not-allowed opacity-50"
        }`}
        style={{ right: "-24px" }}
        aria-label="الشريحة التالية"
        title="التالي"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <button
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border shadow-lg flex items-center justify-center transition-all duration-300 ${
          canScrollLeft
            ? "bg-[#fbfaf6] border-[#e4dfd2] shadow-[#1a2422]/5 text-[#226962] hover:scale-110 hover:border-[#4a9d93] hover:shadow-[#4a9d93]/20 cursor-pointer"
            : "bg-[#f6f4ee] border-[#e4dfd2] text-[#6b7572] cursor-not-allowed opacity-50"
        }`}
        style={{ left: "-24px" }}
        aria-label="الشريحة السابقة"
        title="السابق"
      >
        <svg className="w-5 h-5 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#f6f4ee] via-[#f6f4ee] to-transparent z-[5]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#f6f4ee] via-[#f6f4ee] to-transparent z-[5]" />

      <div
        ref={scrollRef}
        onScroll={updateScrollButtons}
        className="flex gap-5 overflow-x-auto scroll-smooth scrollbar-hide pb-4"
      >
        {domains.map((d) => (
          <div key={d.id} className="flex-shrink-0" style={{ width: "340px" }}>
            <SliderCard domain={d} onToggleFav={handleToggleFav} />
          </div>
        ))}
      </div>

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
      className="luxury-card relative block rounded-2xl p-6 overflow-hidden group h-full bg-gradient-to-br from-[#fbfaf6] to-[#eaf4f1] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="absolute inset-0 rounded-2xl border border-[#4a9d93] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <button
        onClick={(e) => onToggleFav(domain.id, e)}
        className={`absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center transition-all z-10 ${
          favorited
            ? "bg-gradient-to-br from-[#4a9d93] to-[#226962] text-white shadow-lg shadow-[#4a9d93]/30"
            : "bg-white border border-[#e4dfd2] text-[#6b7572] hover:text-[#a6553a] hover:border-[#a6553a]"
        }`}
        title={favorited ? "إزالة من المفضلة" : "إضافة للمفضلة"}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      <div className="flex items-center justify-between mb-6">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#6b7572] font-semibold">
          Premium Domain
        </span>
        <span className="text-[10px] px-2.5 py-1 rounded-full border border-[#4a9d93]/50 text-[#4a9d93] bg-[#eaf4f1] font-medium">
          متاح
        </span>
      </div>

      <div className="mb-4 text-center">
        <div className="flex items-baseline justify-center gap-0 flex-wrap">
          <h3 className="domain-display text-3xl font-bold text-[#1a2422] group-hover:text-[#4a9d93] transition-colors duration-500">
            {domain.name}
            <span className="text-[#4a9d93] font-light">{domain.tld}</span>
          </h3>
        </div>
        {domain.arabicName && (
          <p className="mt-1 text-[#6b7572] text-sm">({domain.arabicName})</p>
        )}
      </div>

      <p className="text-[#6b7572] text-sm leading-6 line-clamp-2 mb-6 min-h-[2.75rem] text-center">
        {domain.description || ""}
      </p>

      <div className="flex items-end justify-between pt-4 border-t border-[#e4dfd2]">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[#6b7572] mb-1 font-semibold">
            السعر
          </div>
          {isMakeOffer ? (
            <div className="text-[#4a9d93] font-bold text-sm">قدّم عرضك</div>
          ) : (
            <div className="text-[#1a2422] font-black text-lg">
              ${(domain.price ?? 0).toLocaleString("en-US")}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-[#6b7572]">
          <span className="inline-flex items-center gap-1">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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