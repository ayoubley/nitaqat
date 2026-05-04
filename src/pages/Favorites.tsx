import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFavoriteDomains, toggleFavorite } from "../lib/favorites";
import type { Domain } from "../lib/types";

export default function Favorites() {
  const [favorites, setFavorites] = useState<Domain[]>([]);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      try {
        setLoading(true);
        console.log("🔄 تحميل المفضلة...");
        const favs = await getFavoriteDomains();
        
        if (!Array.isArray(favs)) {
          console.error("❌ البيانات ليست مصفوفة:", favs);
          setFavorites([]);
          return;
        }

        const validFavs = favs.filter((d): d is Domain => {
          return !!d && typeof d === "object" && "id" in d && "name" in d && "tld" in d;
        });

        console.log("✅ تم تحميل", validFavs.length, "مفضل");
        setFavorites(validFavs);
      } catch (error) {
        console.error("❌ خطأ:", error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    }
    loadFavorites();
  }, [refresh]);

  const handleToggle = (domainId: string) => {
    try {
      toggleFavorite(domainId);
      setRefresh(r => r + 1);
    } catch (err) {
      console.error("❌ خطأ في toggle:", err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#91eff2] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500">جاري تحميل المفضلة...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-[#5bc9cc] text-xs tracking-[0.3em] uppercase mb-2 font-semibold">
          Your Collection
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-[#0a1a3a] section-title-line flex items-center gap-3">
          المفضلة
          <span className="text-2xl">❤️</span>
        </h1>

        <p className="mt-4 text-gray-500 max-w-xl">
          النطاقات التي قمت بحفظها للعودة إليها لاحقاً.
        </p>
      </motion.div>

      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 luxury-card rounded-2xl p-16 text-center"
        >
          <div className="text-6xl mb-4">💎</div>
          <h2 className="text-2xl font-bold text-[#0a1a3a] mb-2">
            لا توجد نطاقات مفضلة بعد
          </h2>

          <p className="text-gray-500 mb-6">
            استكشف مجموعتنا واحفظ النطاقات التي تعجبك للعودة إليها لاحقاً.
          </p>

          <Link
            to="/domains"
            className="btn-cyan inline-block px-8 py-3 rounded-full text-sm font-semibold"
          >
            تصفّح النطاقات
          </Link>
        </motion.div>
      ) : (
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="luxury-card relative rounded-2xl p-6 overflow-hidden"
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleToggle(d.id);
                }}
                className="absolute top-4 left-4 w-9 h-9 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-500 hover:bg-red-100 transition z-10"
              >
                ❤️
              </button>

              <Link to={`/domain/${d.name}${d.tld}`} className="block">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-gray-400">
                    Premium Domain
                  </span>
                  <span className="text-[10px] px-2.5 py-1 rounded-full border border-emerald-300/50 text-emerald-600 bg-emerald-50">
                    متاح
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <h3 className="domain-display text-4xl font-bold text-[#0a1a3a]">
                      {d.name}
                    </h3>
                    <span className="domain-display text-2xl text-[#91eff2] font-light">
                      {d.tld}
                    </span>
                  </div>
                  {d.arabicName && (
                    <p className="mt-1 text-gray-400 text-sm">({d.arabicName})</p>
                  )}
                </div>

                <p className="text-gray-500 text-sm leading-6 line-clamp-2 mb-6">
                  {d.description || ""}
                </p>

                <div className="flex items-end justify-between pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                      السعر
                    </div>
                    {d.price === null || d.price === undefined ? (
                      <div className="text-emerald-600 font-bold">قدّم عرضك</div>
                    ) : (
                      <div className="text-[#0a1a3a] font-black text-xl">
                        ${Number(d.price).toLocaleString("en-US")}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}