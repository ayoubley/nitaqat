import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getDomains, getCategories } from "../lib/db";
import FeaturedSlider from "../components/FeaturedSlider";
import Newsletter from "../components/Newsletter";

export default function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [allDomains, setAllDomains] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [d, c] = await Promise.all([getDomains(), getCategories()]);
        setAllDomains(d || []);
        setCategories(c || []);
      } catch (err) {
        console.error("❌ خطأ:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const featured = (allDomains || []).filter(
    (d) => d.status === "AVAILABLE"
  );

  const suggestions = q.trim()
    ? (allDomains || [])
        .filter(
          (d) =>
            `${d.name}${d.tld}`.toLowerCase().includes(q.toLowerCase()) ||
            d.arabicName?.includes(q)
        )
        .slice(0, 5)
    : [];

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) navigate(`/domains?q=${encodeURIComponent(q.trim())}`);
  }

  const stats = [
    { value: allDomains.length, label: "نطاق فاخر", prefix: "+" },
    { value: 40, label: "علامة تجارية", prefix: "+" },
    { value: "100%", label: "نقل آمن", prefix: "" },
  ];

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-[#f6f4ee]">
        <div className="hero-glow-top" />
        <div className="relative max-w-6xl mx-auto px-5 lg:px-8 pt-20 md:pt-28 pb-16 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#4a9d93]/40 bg-[#4a9d93]/10 text-[#226962] text-xs tracking-widest mb-7 font-semibold"
          >
            <span className="w-2 h-2 rounded-full bg-[#4a9d93] animate-pulse" />
            بوتيك النطاقات العربية الفاخرة
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight text-[#1a2422]"
          >
            امتلك <span className="gold-text">هويّتك</span><br />الرقميّة
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-[#6b7572] text-lg md:text-xl max-w-2xl mx-auto leading-9"
          >
            مجموعة مُختارة بعناية من النطاقات العربية النادرة، من كلمة واحدة، صُمّمت لتمنح علامتك التجارية حضوراً عالمياً يليق بطموحك.
          </motion.p>

          {/* SEARCH */}
          <motion.form
            onSubmit={onSearchSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 max-w-2xl mx-auto relative"
          >
            <div className="bg-white border-2 border-[#e4dfd2] rounded-full flex items-center pr-2 pl-2 py-2 shadow-xl shadow-[#1a2422]/5 hover:border-[#4a9d93]/60 transition-colors focus-within:border-[#4a9d93] focus-within:shadow-[#4a9d93]/20">
              <span className="px-4 text-[#4a9d93]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
                </svg>
              </span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                type="text"
                placeholder="ابحث عن نطاقك المثالي... (مثال: aqar)"
                className="flex-1 bg-transparent outline-none text-[#1a2422] placeholder:text-[#6b7572] text-base py-2"
              />
              <button type="submit" className="btn-cyan px-6 py-3 rounded-full text-sm">بحث</button>
            </div>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute mt-2 w-full bg-white border border-[#e4dfd2] rounded-2xl overflow-hidden shadow-2xl shadow-[#1a2422]/5 text-right z-20"
              >
                {suggestions.map((s: any) => (
                  <Link
                    key={s.id}
                    to={`/domain/${s.name}${s.tld}`}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-[#4a9d93]/5 border-b border-[#e4dfd2] last:border-0"
                  >
                    <span className="domain-display text-lg text-[#1a2422]">
                      {s.name}<span className="text-[#4a9d93]">{s.tld}</span>
                    </span>
                    <span className="text-xs text-[#6b7572]">
                      {s.price ? `$${Number(s.price).toLocaleString("en-US")}` : "قدّم عرضاً"}
                    </span>
                  </Link>
                ))}
              </motion.div>
            )}
          </motion.form>
        </div>
      </section>

      {/* ===== STATS BAR - updated colors ===== */}
      <section className="border-y border-[#e4dfd2] bg-[#fbfaf6] py-6">
        <div className="max-w-4xl mx-auto px-5 flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-baseline gap-1"
            >
              <span className="text-3xl md:text-4xl font-black text-[#1a2422]">
                {s.prefix}{typeof s.value === 'number' ? s.value.toLocaleString("en-US") : s.value}
              </span>
              <span className="text-[#6b7572] text-sm mr-1">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== CATEGORIES - updated colors ===== */}
      <section className="border-b border-[#e4dfd2] bg-[#f6f4ee]/40 py-6">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex flex-wrap items-center justify-center gap-3 text-sm">
          <span className="text-[#6b7572] ml-2">تصفّح حسب الفئة:</span>
          {categories.map((c: any) => (
            <Link
              key={c.id}
              to={`/domains?cat=${c.slug}`}
              className="px-4 py-1.5 rounded-full border border-[#e4dfd2] hover:border-[#4a9d93] hover:text-[#226962] hover:bg-[#4a9d93]/5 transition text-[#6b7572]"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ===== FEATURED SLIDER - updated colors ===== */}
      <section className="relative max-w-7xl mx-auto px-5 lg:px-8 py-20 overflow-hidden">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="text-[#4a9d93] text-xs tracking-[0.3em] uppercase mb-2 font-semibold">The Collection</div>
            <h2 className="text-3xl md:text-4xl font-black text-[#1a2422]">نطاقات مميّزة</h2>
          </div>
          <Link to="/domains" className="text-[#226962] hover:underline text-sm flex items-center gap-1">
            عرض الكل <span className="text-lg">←</span>
          </Link>
        </div>
        <FeaturedSlider domains={featured} />
      </section>

      {/* ===== WHY US - updated colors ===== */}
      <section className="bg-[#f6f4ee]/40 border-y border-[#e4dfd2] py-20">
        <div className="max-w-5xl mx-auto px-5 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-[#1a2422] mb-12">لماذا نِطاقات؟</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🛡️", title: "ضمان Escrow.com", desc: "كل عملية شراء تتم بأمان عبر منصة الضمان العالمية، حماية كاملة للطرفين." },
              { icon: "⚡", title: "نقل ملكية فوري", desc: "ننقل ملكية النطاق إلى حسابك خلال 24-72 ساعة بعد إتمام الدفع." },
              { icon: "✦", title: "استشارة مجانية", desc: "فريقنا يساعدك في اختيار النطاق المناسب لرؤية علامتك التجارية." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="luxury-card rounded-2xl p-6 text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg text-[#1a2422] mb-2">{item.title}</h3>
                <p className="text-[#6b7572] text-sm leading-7">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA - updated colors ===== */}
      <section className="relative overflow-hidden bg-[#fbfaf6] py-20">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-[#1a2422] mb-6">
            علامتك التجارية تستحق الأفضل
          </h2>
          <p className="text-[#6b7572] text-lg mb-8 max-w-2xl mx-auto">
            اكتشف النطاق المثالي لمشروعك القادم، واحجز اسمك في العالم الرقمي اليوم.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/domains" className="btn-cyan px-8 py-3 rounded-full text-sm font-semibold">
              تصفّح النطاقات
            </Link>
            <Link to="/contact" className="btn-ghost px-8 py-3 rounded-full text-sm">
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="relative overflow-hidden">
        <div className="hero-glow-bottom" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 pb-20">
          <Newsletter />
        </div>
      </section>
    </>
  );
}