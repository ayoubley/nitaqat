import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Domain } from "../lib/types";

import "swiper/css";
import "swiper/css/navigation";

interface Props {
  domains: Domain[];
}

export default function FeaturedSlider({ domains }: Props) {
  if (!domains || domains.length === 0) {
    return (
      <div className="text-center py-12 text-[#6b7572]">
        لا توجد نطاقات مميزة حالياً
      </div>
    );
  }

  return (
    <div className="relative">
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={24}
        slidesPerView={1}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="featured-slider"
      >
        {domains.map((domain, idx) => (
          <SwiperSlide key={domain.id}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                to={`/domain/${domain.name}${domain.tld}`}
                className="block bg-[#fbfaf6] rounded-2xl p-6 border border-[#e4dfd2] hover:border-[#4a9d93] transition-all duration-300 group shadow-lg shadow-[#1a2422]/5 hover:shadow-[#4a9d93]/20"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#4a9d93] font-semibold">
                    Premium Pick
                  </span>
                  <span className="text-[#d4a76a] text-xs">★ مميز</span>
                </div>
                <div className="text-center mb-4">
                  <h3 className="domain-display text-3xl md:text-4xl font-black text-[#1a2422] group-hover:text-[#4a9d93] transition-colors">
                    {domain.name}
                    <span className="text-[#4a9d93] font-light">{domain.tld}</span>
                  </h3>
                  {domain.arabicName && (
                    <p className="mt-2 text-[#6b7572] text-sm">{domain.arabicName}</p>
                  )}
                </div>
                <p className="text-[#6b7572] text-sm leading-6 line-clamp-2 mb-4">
                  {domain.description || "نطاق مميز لعلامتك التجارية"}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-[#e4dfd2]">
                  <div>
                    {domain.price === null ? (
                      <span className="text-[#4a9d93] font-bold text-sm">قدّم عرضك</span>
                    ) : (
                      <span className="text-[#1a2422] font-black text-lg">
                        ${domain.price.toLocaleString("en-US")}
                      </span>
                    )}
                  </div>
                  <span className="text-[#4a9d93] text-sm group-hover:translate-x-1 transition-transform">
                    تفاصيل ←
                  </span>
                </div>
              </Link>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation buttons - updated colors */}
      <div className="swiper-button-prev-custom absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#fbfaf6] border border-[#e4dfd2] flex items-center justify-center cursor-pointer z-10 hover:bg-[#4a9d93] hover:border-[#4a9d93] hover:text-white transition shadow-md">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </div>
      <div className="swiper-button-next-custom absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#fbfaf6] border border-[#e4dfd2] flex items-center justify-center cursor-pointer z-10 hover:bg-[#4a9d93] hover:border-[#4a9d93] hover:text-white transition shadow-md">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}