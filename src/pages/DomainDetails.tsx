import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  SITE_CONFIG,
  createOffer,
  getCategories,
  getDomainBySlug,
  getDomains,
  incrementViews,
} from "../lib/db";
import Modal from "../components/Modal";
import DomainCard from "../components/DomainCard";
import { toggleFavorite, isFavorite } from "../lib/favorites";
import type { Domain, Category } from "../lib/types";

export default function DomainDetails() {
  const { slug = "" } = useParams();
  const [domain, setDomain] = useState<Domain | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allDomains, setAllDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [openOffer, setOpenOffer] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [cats, domains] = await Promise.all([
  getCategories(),
  getDomains(),
]);

// البحث عن النطاق بمقارنة name+tld مع slug
const d = domains.find((dom) => `${dom.name}${dom.tld}` === slug) || null;
setDomain(d);
        setDomain(d);
        setCategories(cats || []);
        setAllDomains(domains || []);
        
        if (d) {
          incrementViews(d.id);
          setFavorited(isFavorite(d.id));
        }
      } catch (err) {
        console.error("❌ خطأ في تحميل النطاق:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  function handleToggleFav() {
    if (!domain) return;
    toggleFavorite(domain.id);
    setFavorited(!favorited);
  }

  // شاشة التحميل
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-32 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#91eff2] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500">جاري تحميل النطاق...</p>
      </div>
    );
  }

  // النطاق غير موجود
  if (!domain) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-32 text-center">
        <div className="text-5xl mb-4">✦</div>
        <h1 className="text-3xl font-black text-[#0a1a3a]">النطاق غير موجود</h1>
        <p className="text-gray-500 mt-3">
          النطاق الذي تبحث عنه غير متوفر أو تمت إزالته.
        </p>
        <Link to="/domains" className="btn-cyan inline-block mt-6 px-6 py-3 rounded-full text-sm">
          عرض كل النطاقات
        </Link>
      </div>
    );
  }

  const fullDomain = `${domain.name}${domain.tld}`;
  const category = categories.find((c) => c.id === domain.categoryId);
  const isMakeOffer = domain.price === null || domain.price === undefined;

  const whatsappLink = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    `مرحباً، أنا مهتم بشراء النطاق ${fullDomain}. هل يمكننا التحدث؟`
  )}`;

  const related = allDomains
    .filter((d) => d.id !== domain.id && d.categoryId === domain.categoryId && d.status === "AVAILABLE")
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10 md:py-16">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-[#2ab0b4]">الرئيسية</Link>
        <span>›</span>
        <Link to="/domains" className="hover:text-[#2ab0b4]">النطاقات</Link>
        <span>›</span>
        <span className="text-[#0a1a3a] font-semibold">{fullDomain}</span>
      </nav>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10">
        {/* Hero panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl p-8 md:p-14 overflow-hidden bg-gradient-to-br from-white to-[#91eff2]/5 border border-gray-200 shadow-xl shadow-[#91eff2]/10"
        >
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#91eff2]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#91eff2]/10 blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#5bc9cc] font-semibold">
                  Premium Listing
                </span>
                {category && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-200">
                    {category.name}
                  </span>
                )}
              </div>
              <button
                onClick={handleToggleFav}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                  favorited 
                    ? "bg-gradient-to-br from-[#91eff2] to-[#5bc9cc] text-white shadow-lg shadow-[#91eff2]/30" 
                    : "bg-white border border-gray-200 text-gray-300 hover:text-red-400 hover:border-red-200"
                }`}
                title={favorited ? "إزالة من المفضلة" : "إضافة للمفضلة"}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>

            <div className="flex flex-wrap items-baseline gap-2">
              <h1 className="domain-display text-6xl md:text-8xl lg:text-9xl font-black text-[#0a1a3a] leading-none">
                {domain.name}
              </h1>
              <span className="domain-display text-4xl md:text-6xl text-[#91eff2] font-light">
                {domain.tld}
              </span>
            </div>

            {domain.arabicName && (
              <p className="mt-5 text-2xl text-gray-400 font-light">
                {domain.arabicName}
              </p>
            )}

            <p className="mt-8 text-gray-600 leading-9 text-lg max-w-2xl">
              {domain.description || ""}
            </p>

            {/* Properties */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { l: "الطول", v: `${domain.name.length} أحرف` },
                { l: "الامتداد", v: domain.tld },
                { l: "المشاهدات", v: (domain.views ?? 0).toLocaleString("ar-EG") },
                { l: "الحالة", v: "متاح" },
              ].map((p) => (
                <div key={p.l} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <div className="text-[10px] uppercase tracking-widest text-gray-400">{p.l}</div>
                  <div className="mt-1 font-bold text-[#0a1a3a]">{p.v}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Action panel */}
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="luxury-card rounded-3xl p-8">
            <div className="text-xs uppercase tracking-widest text-gray-400">السعر المعلن</div>
            {isMakeOffer ? (
              <div className="mt-2">
                <div className="text-3xl font-black text-emerald-600">قدّم عرضك</div>
                <p className="text-gray-500 text-sm mt-2">
                  هذا النطاق متاح بنظام تقديم العروض. ابدأ بعرضك الأفضل.
                </p>
              </div>
            ) : (
              <div className="mt-2">
                <div className="text-5xl font-black text-[#0a1a3a]">
                  ${(domain.price ?? 0).toLocaleString("en-US")}
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  بالدولار الأمريكي — قابل للتفاوض
                </p>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <button
                onClick={() => setOpenOffer(true)}
                className="btn-cyan w-full py-4 rounded-2xl text-base flex items-center justify-center gap-2"
              >
                <span>قدّم عرضاً</span>
                <span>←</span>
              </button>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-emerald w-full py-4 rounded-2xl text-base flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                تواصل عبر واتساب
              </a>
            </div>

            {/* Trust badge */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#91eff2]/10 border border-[#91eff2]/30 flex items-center justify-center text-[#2ab0b4]">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-sm text-[#0a1a3a]">معاملات آمنة عبر Escrow.com</div>
                  <div className="text-xs text-gray-400">
                    حماية كاملة للمشتري والبائع
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why this domain */}
          <div className="luxury-card rounded-3xl p-7">
            <h3 className="font-bold text-lg text-[#0a1a3a] mb-4">لماذا هذا النطاق؟</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="text-[#91eff2]">✦</span>
                <span>كلمة عربية أصيلة سهلة النطق والتذكّر عالمياً.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#91eff2]">✦</span>
                <span>قصير ({domain.name.length} أحرف) — مثالي للعلامات التجارية.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#91eff2]">✦</span>
                <span>امتداد {domain.tld} موثوق ومعروف عالمياً.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#91eff2]">✦</span>
                <span>قيمة استثمارية متنامية في سوق النطاقات العربية.</span>
              </li>
            </ul>
          </div>
        </motion.aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-black text-[#0a1a3a] section-title-line mb-8">نطاقات مشابهة</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((d, i) => (
              <DomainCard key={d.id} domain={d} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* OFFER MODAL */}
      <Modal
        open={openOffer}
        onClose={() => {
          setOpenOffer(false);
          setTimeout(() => setSubmitted(false), 300);
        }}
        title={submitted ? "تم استلام عرضك" : `قدّم عرضاً على ${fullDomain}`}
      >
        {submitted ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-3xl mb-4">
              ✓
            </div>
            <p className="text-gray-600 leading-7">
              شكراً لاهتمامك! سيقوم فريقنا بمراجعة عرضك والرد عليك خلال
              <span className="text-[#2ab0b4] font-bold"> 24 ساعة</span> على
              البريد المُسجّل.
            </p>
            <button
              onClick={() => { setOpenOffer(false); setTimeout(() => setSubmitted(false), 300); }}
              className="btn-cyan mt-6 px-6 py-2.5 rounded-full text-sm"
            >
              إغلاق
            </button>
          </div>
        ) : (
          <OfferForm
            domainId={domain.id}
            suggestedAmount={domain.price ?? undefined}
            onSubmitted={() => setSubmitted(true)}
          />
        )}
      </Modal>
    </div>
  );
}

function OfferForm({
  domainId,
  suggestedAmount,
  onSubmitted,
}: {
  domainId: string;
  suggestedAmount?: number;
  onSubmitted: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState<string>(suggestedAmount ? String(suggestedAmount) : "");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !amount) return;
    setSubmitting(true);
    try {
      await createOffer({
        domainId,
        buyerName: name,
        email,
        phone,
        offerAmount: Number(amount),
        message,
      });
      onSubmitted();
    } catch (err) {
      console.error("❌ خطأ في إرسال العرض:", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="الاسم الكامل *">
          <input required value={name} onChange={(e) => setName(e.target.value)} className="form-input-light" />
        </Field>
        <Field label="البريد الإلكتروني *">
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input-light" />
        </Field>
      </div>
      <Field label="رقم الهاتف (اختياري)">
        <input value={phone} onChange={(e) => setPhone(e.target.value)} className="form-input-light" placeholder="+971 ..." />
      </Field>
      <Field label="مبلغ العرض (USD) *">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#91eff2] text-sm font-bold">$</span>
          <input
            required type="number" min={1} value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-input-light pl-7" placeholder="مثال: 10000"
          />
        </div>
      </Field>
      <Field label="رسالة (اختياري)">
        <textarea
          value={message} onChange={(e) => setMessage(e.target.value)}
          rows={3} className="form-input-light resize-none"
          placeholder="حدّثنا عن مشروعك..."
        />
      </Field>
      <button type="submit" disabled={submitting} className="btn-cyan w-full py-3.5 rounded-xl text-sm disabled:opacity-60">
        {submitting ? "جارٍ الإرسال..." : "إرسال العرض"}
      </button>
      <p className="text-xs text-gray-400 text-center">
        بإرسال هذا النموذج، أنت توافق على شروط الاستخدام وسياسة الخصوصية.
      </p>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest text-gray-400 mb-2">{label}</span>
      {children}
    </label>
  );
}