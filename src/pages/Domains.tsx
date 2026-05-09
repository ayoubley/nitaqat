import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getCategories, getDomains } from "../lib/db";
import DomainCard from "../components/DomainCard";
import type { Domain, Category } from "../lib/types";

const TLDs = [".com", ".net", ".org", ".io", ".co"];
type SortOpt = "newest" | "price-asc" | "price-desc" | "popular";

export default function Domains() {
  const [params, setParams] = useSearchParams();
  const [allDomains, setAllDomains] = useState<Domain[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState(params.get("q") ?? "");
  const [cat, setCat] = useState(params.get("cat") ?? "");
  const [tld, setTld] = useState(params.get("tld") ?? "");
  const [maxLen, setMaxLen] = useState<number>(Number(params.get("len")) || 12);
  const [sort, setSort] = useState<SortOpt>((params.get("sort") as SortOpt) || "newest");

  // ✅ تحميل البيانات من Supabase
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [domains, cats] = await Promise.all([
          getDomains(),
          getCategories()
        ]);
        setAllDomains(domains || []);
        setCategories(cats || []);
      } catch (error) {
        console.error("❌ خطأ في تحميل البيانات:", error);
        setAllDomains([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (cat) next.set("cat", cat);
    if (tld) next.set("tld", tld);
    if (maxLen !== 12) next.set("len", String(maxLen));
    if (sort !== "newest") next.set("sort", sort);
    setParams(next, { replace: true });
  }, [q, cat, tld, maxLen, sort, setParams]);

  const results = useMemo(() => {
    if (!Array.isArray(allDomains)) return [];
    
    let list = allDomains.filter((d) => d && d.status === "AVAILABLE");
    
    if (q) {
      const needle = q.toLowerCase();
      list = list.filter(
        (d) => d && `${d.name || ""}${d.tld || ""}`.toLowerCase().includes(needle) || 
        (d.arabicName && d.arabicName.includes(q))
      );
    }
    if (cat && categories.length > 0) {
      const c = categories.find((c) => c.slug === cat);
      if (c) list = list.filter((d) => d && d.categoryId === c.id);
    }
    if (tld) list = list.filter((d) => d && d.tld === tld);
    list = list.filter((d) => d && d.name && d.name.length <= maxLen);

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
        break;
      case "price-desc":
        list = [...list].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
        break;
      case "popular":
        list = [...list].sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
        break;
      default:
        list = [...list].sort((a, b) => +new Date(b.createdAt || 0) - +new Date(a.createdAt || 0));
    }
    return list;
  }, [allDomains, categories, q, cat, tld, maxLen, sort]);

  function clearFilters() {
    setQ(""); setCat(""); setTld(""); setMaxLen(12); setSort("newest");
  }

  // ✅ شاشة التحميل - updated colors
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#4a9d93] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-[#6b7572]">جاري تحميل النطاقات...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-[#4a9d93] text-xs tracking-[0.3em] uppercase mb-2 font-semibold">
          The Catalogue
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-[#1a2422] section-title-line">جميع النطاقات</h1>
        <p className="mt-4 text-[#6b7572] max-w-xl">
          استكشف مجموعتنا الكاملة من النطاقات العربية الفاخرة. استخدم الفلاتر لتجد ما يناسب رؤيتك.
        </p>
      </motion.div>

      <div className="mt-10 grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar - updated colors */}
        <aside className="space-y-6">
          <div className="luxury-card rounded-2xl p-5">
            <label className="text-xs uppercase tracking-widest text-[#6b7572]">بحث</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="اسم النطاق..."
              className="mt-2 w-full bg-[#fbfaf6] border border-[#e4dfd2] rounded-lg px-3 py-2.5 outline-none focus:border-[#4a9d93] focus:shadow-[0_0_0_3px_rgba(74,157,147,0.15)] text-[#1a2422]"
            />
          </div>

          <div className="luxury-card rounded-2xl p-5">
            <div className="text-xs uppercase tracking-widest text-[#6b7572] mb-3">الفئة</div>
            <div className="space-y-2">
              <button
                onClick={() => setCat("")}
                className={`w-full text-right px-3 py-2 rounded-lg text-sm transition ${
                  !cat ? "bg-[#4a9d93]/10 text-[#226962] border border-[#4a9d93]/30 font-semibold" : "text-[#6b7572] hover:bg-[#f6f4ee]"
                }`}
              >
                الكل
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCat(c.slug)}
                  className={`w-full text-right px-3 py-2 rounded-lg text-sm transition ${
                    cat === c.slug
                      ? "bg-[#4a9d93]/10 text-[#226962] border border-[#4a9d93]/30 font-semibold"
                      : "text-[#6b7572] hover:bg-[#f6f4ee]"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="luxury-card rounded-2xl p-5">
            <div className="text-xs uppercase tracking-widest text-[#6b7572] mb-3">الامتداد (TLD)</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTld("")}
                className={`px-3 py-1.5 rounded-full text-xs border ${
                  !tld ? "border-[#4a9d93]/50 text-[#226962] bg-[#4a9d93]/5 font-semibold" : "border-[#e4dfd2] text-[#6b7572]"
                }`}
              >
                الكل
              </button>
              {TLDs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTld(t === tld ? "" : t)}
                  className={`px-3 py-1.5 rounded-full text-xs border ${
                    tld === t ? "border-[#4a9d93]/50 text-[#226962] bg-[#4a9d93]/5 font-semibold" : "border-[#e4dfd2] text-[#6b7572] hover:border-[#4a9d93]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="luxury-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs uppercase tracking-widest text-[#6b7572]">الطول الأقصى</div>
              <div className="text-[#226962] font-bold text-sm">{maxLen} حرف</div>
            </div>
            <input
              type="range"
              min={3}
              max={12}
              value={maxLen}
              onChange={(e) => setMaxLen(Number(e.target.value))}
              className="w-full accent-[#4a9d93]"
            />
          </div>

          <button
            onClick={clearFilters}
            className="w-full btn-ghost py-2.5 rounded-lg text-sm"
          >
            مسح الفلاتر
          </button>
        </aside>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-[#6b7572]">
              <span className="text-[#1a2422] font-bold">{results.length}</span> نطاق متاح
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOpt)}
              className="bg-[#fbfaf6] border border-[#e4dfd2] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#4a9d93] text-[#1a2422]"
            >
              <option value="newest">الأحدث</option>
              <option value="price-asc">السعر: من الأقل</option>
              <option value="price-desc">السعر: من الأعلى</option>
              <option value="popular">الأكثر مشاهدة</option>
            </select>
          </div>

          {results.length === 0 ? (
            <div className="luxury-card rounded-2xl p-12 text-center">
              <div className="text-4xl mb-3">✦</div>
              <p className="text-[#6b7572]">
                لا توجد نطاقات تطابق الفلاتر الحالية.
              </p>
              <button onClick={clearFilters} className="mt-4 btn-ghost px-5 py-2 rounded-lg text-sm">
                إعادة الضبط
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {results.map((d, i) => (
                <DomainCard key={d.id} domain={d} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}