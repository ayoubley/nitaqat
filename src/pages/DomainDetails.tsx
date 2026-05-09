import { useEffect, useMemo, useState } from "react";
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
import { isFavorite, toggleFavorite } from "../lib/favorites";
import Modal from "../components/Modal";
import DomainCard from "../components/DomainCard";

export default function DomainDetails() {
  const { slug = "" } = useParams();
  const domain = useMemo(() => getDomainBySlug(slug), [slug]);
  const categories = useMemo(() => getCategories(), []);
  const allDomains = useMemo(() => getDomains(), []);
  const [openOffer, setOpenOffer] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [fav, setFav] = useState(domain ? isFavorite(domain.id) : false);

  useEffect(() => {
    if (slug) incrementViews(slug);
  }, [slug]);

  useEffect(() => {
    if (domain) setFav(isFavorite(domain.id));
  }, [domain]);

  if (!domain) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-32 text-center">
        <div className="text-5xl mb-4">✦</div>
        <h1 className="text-3xl font-black text-[#1a2422]">النطاق غير موجود</h1>
        <p className="text-[#6b7572] mt-3">النطاق الذي تبحث عنه غير متوفر أو تمت إزالته.</p>
        <Link to="/domains" className="btn-cyan inline-block mt-6 px-6 py-3 rounded-full text-sm">
          عرض كل النطاقات
        </Link>
      </div>
    );
  }

  const fullDomain = `${domain.name}${domain.tld}`;
  const category = categories.find((c) => c.id === domain.categoryId);
  const displayPrice = domain.price ?? 30000;
  const monthly = Math.max(249, Math.ceil(displayPrice / 36));
  const isMakeOffer = domain.price === null;

  const whatsappLink = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    `مرحباً، أنا مهتم بشراء النطاق ${fullDomain}. هل يمكننا التحدث؟`
  )}`;

  const related = allDomains
    .filter((d) => d.id !== domain.id && d.categoryId === domain.categoryId && d.status === "AVAILABLE")
    .slice(0, 3);

  function handleFavorite() {
    if (!domain) return;
    const next = toggleFavorite(domain.id);
    setFav(next);
    window.dispatchEvent(new Event("storage"));
  }

  function handleInlineOffer(e: React.FormEvent) {
    e.preventDefault();
    setOpenOffer(true);
  }

  return (
    <div>
      {/* ===== HERO LANDING SECTION — Warm Editorial ===== */}
      <section className="relative overflow-hidden bg-[#f6f4ee]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-48 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[#2f8279]/8 blur-[130px]" />
          <div className="absolute top-24 -right-28 h-[420px] w-[420px] rounded-full bg-[#d4a76a]/10 blur-[120px]" />
          <div className="absolute bottom-0 -left-24 h-[440px] w-[440px] rounded-full bg-[#4a9d93]/8 blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 pt-8 pb-14">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link to="/" className="inline-flex items-center gap-3 text-[#1a2422] hover:text-[#2f8279]">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2f8279] to-[#4a9d93] font-black text-white shadow-lg shadow-[#2f8279]/20">
                ن
              </span>
              <span>
                <span className="block text-2xl font-black leading-none">نِطاقات</span>
                <span className="block text-[10px] uppercase tracking-[0.35em] text-[#6b7572]">Premium Broker</span>
              </span>
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <Link to="/domains" className="rounded-full border border-[#e4dfd2] bg-[#fbfaf6] px-4 py-2 text-xs text-[#6b7572] hover:bg-[#efece3]">
                العودة للكتالوج
              </Link>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-2xl bg-[#fbfaf6] px-5 py-3 ring-1 ring-[#e4dfd2] hover:bg-[#efece3]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2f8279] to-[#4a9d93] shadow-lg shadow-[#2f8279]/20">
                  <PhoneIcon />
                </span>
                <span className="text-right">
                  <span className="block text-xs font-bold text-[#1a2422]">تواصل مع خبراء النطاقات</span>
                  <span className="block text-[11px] text-[#6b7572]">واتساب أو اتصال مباشر</span>
                </span>
              </a>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-[260px_1fr_320px]" dir="ltr">
            {/* ✅ تم تعديل هذا القسم - إزالة صورة الشخص واستبدالها بمحتوى نصي */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative min-h-[310px] overflow-hidden rounded-2xl border border-[#e4dfd2] bg-gradient-to-br from-[#fbfaf6] to-[#efece3] p-6 shadow-xl shadow-[#1a2422]/5"
              dir="rtl"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(47,130,121,0.08),transparent_45%)]" />
              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2f8279] to-[#4a9d93] text-white shadow-lg shadow-[#2f8279]/20">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2a10 10 0 0 0-10 10c0 7 10 13 10 13s10-6 10-13a10 10 0 0 0-10-10z" />
                      <circle cx="12" cy="9" r="2" />
                      <path d="M12 22v-4" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-[#1a2422]">استشارة مجانية</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#6b7572]">
                    فريقنا متخصص في النطاقات العربية ويقدم استشارة كاملة حول قيمة النطاق وجدوى الاستثمار.
                  </p>
                </div>
                <div className="mt-6 rounded-xl bg-[#eaf4f1] p-4 ring-1 ring-[#dceeea]">
                  <p className="text-xs font-bold text-[#1a2422]">✓ تقييم احترافي</p>
                  <p className="mt-1 text-xs text-[#6b7572]">تحليل السوق وتقدير القيمة السوقية</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="relative min-h-[310px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#2f8279] via-[#226962] to-[#18524d] p-6 md:p-8 shadow-xl shadow-[#2f8279]/15"
              dir="rtl"
            >
              <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-white/8 blur-3xl" />
              <div className="absolute -bottom-28 right-8 h-64 w-64 rounded-full bg-[#4a9d93]/15 blur-3xl" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">هذا النطاق معروض للبيع</span>
                  {category && (
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/85">
                      {category.name}
                    </span>
                  )}
                </div>

                <div className="py-8">
                  {domain.arabicName && <p className="mb-3 text-xl font-light text-white/70">{domain.arabicName}</p>}
                  <h1 className="domain-display break-words text-6xl font-black leading-none tracking-tight text-white md:text-7xl xl:text-8xl" dir="ltr">
                    {fullDomain}
                  </h1>
                </div>

                <p className="max-w-2xl text-sm leading-7 text-white/78 md:text-base">
                  {domain.description}
                </p>
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="grid gap-3"
              dir="rtl"
            >
              <div className="rounded-2xl bg-gradient-to-br from-[#fbfaf6] to-[#efece3] p-5 shadow-lg shadow-[#1a2422]/5 border border-[#e4dfd2]">
                <div className="text-sm font-semibold text-[#1a2422]">الدفع على دفعات</div>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-5xl font-black tracking-tight text-[#1a2422]">${monthly.toLocaleString("en-US")}</span>
                  <span className="mb-2 text-sm font-bold text-[#6b7572]">/ شهرياً</span>
                </div>
                <button onClick={() => setOpenOffer(true)} className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#2f8279] to-[#4a9d93] px-5 py-3 text-sm font-black text-white hover:from-[#226962] hover:to-[#2f8279] transition shadow-lg shadow-[#2f8279]/20">
                  تابع الطلب ↗
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-gradient-to-br from-[#fbfaf6] to-[#eaf4f1] p-4 border border-[#e4dfd2]">
                  <p className="text-xs font-bold leading-5 text-[#6b7572]">احصل عليه الآن</p>
                  <div className="mt-3 text-2xl font-black text-[#1a2422]">{isMakeOffer ? "عرض خاص" : `$${displayPrice.toLocaleString("en-US")}`}</div>
                  <button onClick={() => setOpenOffer(true)} className="mt-4 text-sm font-black text-[#2f8279] hover:text-[#18524d]">
                    {isMakeOffer ? "قدّم عرضاً" : "ابدأ الشراء"} ↗
                  </button>
                </div>

                <form onSubmit={handleInlineOffer} className="rounded-2xl bg-gradient-to-br from-[#fbfaf6] to-[#eaf4f1] p-4 border border-[#e4dfd2]">
                  <p className="text-xs font-bold text-[#6b7572]">قدّم عرضك</p>
                  <input
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    inputMode="numeric"
                    placeholder="USD"
                    className="mt-5 w-full rounded-xl border border-[#e4dfd2] bg-white px-3 py-2 text-xs text-[#1a2422] outline-none placeholder:text-[#6b7572] focus:border-[#2f8279]"
                  />
                  <button className="mt-4 text-sm font-black text-[#2f8279] hover:text-[#18524d]">متابعة ↗</button>
                </form>
              </div>
            </motion.aside>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "شراء بثقة", desc: "حماية المشتري عبر Escrow.com", icon: <CartIcon /> },
              { title: "نقل فوري", desc: "إرشاد كامل حتى الاستلام", icon: <TransferIcon /> },
              { title: "تبادل آمن", desc: "توثيق الصفقة وخطوات الدفع", icon: <ShieldIcon /> },
              { title: "خيارات دفع مرنة", desc: "عرض، تفاوض، أو دفعات", icon: <WalletIcon /> },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2f8279] to-[#4a9d93] text-white shadow-lg shadow-[#2f8279]/20">
                  {item.icon}
                </div>
                <h3 className="mt-4 text-base font-black text-[#1a2422]">{item.title}</h3>
                <p className="mt-1 text-xs leading-5 text-[#6b7572]">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl bg-[#fbfaf6] p-5 ring-1 ring-[#e4dfd2] shadow-lg shadow-[#1a2422]/5">
            <div className="grid gap-5 lg:grid-cols-[170px_1fr]">
              <div className="flex flex-col justify-center rounded-xl bg-[#eaf4f1] p-5 text-center ring-1 ring-[#dceeea]">
                <span className="text-lg font-bold text-[#1a2422]">Excellent</span>
                <span className="mt-2 text-2xl tracking-widest text-[#2f8279]">★★★★★</span>
                <span className="mt-1 text-xs text-[#6b7572]">Trustpilot style score</span>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  { name: "Khaled A.", text: "تجربة سريعة ومحترفة، تم نقل النطاق بدون تعقيدات." },
                  { name: "Muna R.", text: "التفاوض كان واضحاً وآمناً، وخدمة الدعم ممتازة." },
                  { name: "Faisal Group", text: "اختيار قوي لعلامتنا الجديدة، والأهم أن الصفقة موثقة." },
                ].map((review) => (
                  <div key={review.name} className="rounded-xl bg-[#fbfaf6] p-4 ring-1 ring-[#e4dfd2]">
                    <div className="text-[#2f8279]">★★★★★</div>
                    <p className="mt-2 text-xs leading-6 text-[#6b7572]">{review.text}</p>
                    <p className="mt-3 text-[11px] font-bold text-[#6b7572]">{review.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LOWER SECTION — Warm Editorial Light ===== */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute -top-40 left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[#4a9d93]/8 blur-[120px]" />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="luxury-card rounded-3xl p-7 md:p-9"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-[#4a9d93] text-xs tracking-[0.3em] uppercase mb-2 font-semibold">Domain Intelligence</div>
                  <h2 className="text-3xl font-black text-[#1a2422]">لماذا {fullDomain}؟</h2>
                </div>
                <button
                  onClick={handleFavorite}
                  className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                    fav ? "border-[#a6553a]/30 bg-[#a6553a]/10 text-[#a6553a]" : "border-[#e4dfd2] bg-[#fbfaf6] text-[#6b7572] hover:border-[#a6553a]/30 hover:text-[#a6553a]"
                  }`}
                >
                  {fav ? "محفوظ في المفضلة ❤️" : "أضف للمفضلة ♡"}
                </button>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  { l: "الطول", v: `${domain.name.length} أحرف`, d: "اسم قصير وسهل الحفظ" },
                  { l: "الامتداد", v: domain.tld, d: "امتداد موثوق للعلامات الجادة" },
                  { l: "المشاهدات", v: domain.views.toLocaleString("ar-EG"), d: "اهتمام نشط من المشترين" },
                  { l: "الحالة", v: "متاح الآن", d: "جاهز للتفاوض والنقل" },
                ].map((item) => (
                  <div key={item.l} className="rounded-2xl bg-[#efece3]/50 p-5 ring-1 ring-[#e4dfd2]">
                    <p className="text-xs uppercase tracking-widest text-[#6b7572]">{item.l}</p>
                    <p className="mt-2 text-2xl font-black text-[#1a2422]">{item.v}</p>
                    <p className="mt-1 text-sm text-[#6b7572]">{item.d}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-gradient-to-br from-[#2f8279] via-[#226962] to-[#18524d] p-7 text-white shadow-2xl shadow-[#2f8279]/20 md:p-9"
            >
              <div className="text-[#4a9d93] text-xs tracking-[0.3em] uppercase mb-2 font-semibold">Secure Closing</div>
              <h2 className="text-3xl font-black">مسار شراء آمن</h2>
              <div className="mt-8 space-y-5">
                {[
                  "قدّم عرضك أو اطلب التواصل الفوري عبر واتساب.",
                  "نؤكد الاتفاق ونفتح معاملة ضمان Escrow.com.",
                  "بعد الدفع، يتم نقل النطاق لحسابك مع متابعة كاملة.",
                ].map((step, i) => (
                  <div key={step} className="flex gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#4a9d93] to-[#2f8279] text-sm font-black text-white">
                      {i + 1}
                    </div>
                    <p className="pt-1 text-sm leading-7 text-white/75">{step}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-2xl border border-[#4a9d93]/30 bg-[#4a9d93]/15 p-5">
                <p className="font-black text-[#4a9d93]">Secure transactions via Escrow.com</p>
                <p className="mt-2 text-sm leading-7 text-white/65">حماية كاملة للمشتري والبائع، وشفافية في الدفع ونقل الملكية.</p>
              </div>
            </motion.div>
          </div>

          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-black text-[#1a2422] section-title-line mb-8">نطاقات مشابهة</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map((d, i) => (
                  <DomainCard key={d.id} domain={d} index={i} />
                ))}
              </div>
            </section>
          )}
        </div>
      </section>

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
            <div className="w-16 h-16 mx-auto rounded-full bg-[#eaf4f1] border border-[#2f8279]/30 flex items-center justify-center text-[#226962] text-3xl mb-4">
              ✓
            </div>
            <p className="text-[#6b7572] leading-7">
              شكراً لاهتمامك! سيقوم فريقنا بمراجعة عرضك والرد عليك خلال
              <span className="text-[#226962] font-bold"> 24 ساعة</span> على البريد المسجل.
            </p>
            <button onClick={() => setOpenOffer(false)} className="btn-cyan mt-6 px-6 py-2.5 rounded-full text-sm">
              إغلاق
            </button>
          </div>
        ) : (
          <OfferForm
            domainId={domain.id}
            suggestedAmount={offerAmount ? Number(offerAmount) : domain.price ?? undefined}
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

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !amount) return;
    setSubmitting(true);
    setTimeout(() => {
      createOffer({
        domainId,
        buyerName: name,
        email,
        phone,
        offerAmount: Number(amount),
        message,
      });
      setSubmitting(false);
      onSubmitted();
    }, 600);
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
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2f8279] text-sm font-bold">$</span>
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
          placeholder="حدثنا عن مشروعك..."
        />
      </Field>
      <button type="submit" disabled={submitting} className="btn-cyan w-full py-3.5 rounded-xl text-sm disabled:opacity-60">
        {submitting ? "جار الإرسال..." : "إرسال العرض"}
      </button>
      <p className="text-xs text-[#6b7572] text-center">بإرسال هذا النموذج، أنت توافق على شروط الاستخدام وسياسة الخصوصية.</p>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest text-[#6b7572] mb-2">{label}</span>
      {children}
    </label>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.9.65 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.3 1.85.52 2.81.65A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6 5 2H2" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  );
}

function TransferIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
      <path d="M16 11h6v5h-6a2 2 0 0 1 0-4z" />
      <path d="M18 7V5a2 2 0 0 0-2-2H6" />
    </svg>
  );
}