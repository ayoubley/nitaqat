import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  createDomain,
  deleteDomain,
  deleteOffer,
  getCategories,
  getDomains,
  getOffers,
  updateDomain,
  updateOfferStatus,
} from "../lib/db";
import type { Domain, Offer, OfferStatus, Category } from "../lib/types";
import Modal from "../components/Modal";

const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD;
const STORAGE_AUTH = "nitaqat:admin:auth";

export default function Admin() {
  const [authed, setAuthed] = useState<boolean>(() =>
    typeof window !== "undefined" && localStorage.getItem(STORAGE_AUTH) === "1"
  );
  const [tab, setTab] = useState<"overview" | "domains" | "offers">("overview");

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-[#1a2422]">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="text-[#4a9d93] text-xs tracking-[0.3em] uppercase mb-2">
              Control Center
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white">لوحة التحكم</h1>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem(STORAGE_AUTH);
              setAuthed(false);
            }}
            className="px-4 py-2 rounded-full text-xs border border-white/20 text-white/70 hover:bg-white/5"
          >
            تسجيل الخروج
          </button>
        </div>

        <div className="flex gap-2 border-b border-white/10 mb-8 overflow-x-auto">
          {[
            { k: "overview", l: "نظرة عامة" },
            { k: "domains", l: "إدارة النطاقات" },
            { k: "offers", l: "العروض" },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k as typeof tab)}
              className={`px-5 py-3 text-sm whitespace-nowrap border-b-2 -mb-px transition ${
                tab === t.k
                  ? "border-[#4a9d93] text-[#4a9d93]"
                  : "border-transparent text-white/50 hover:text-white"
              }`}
            >
              {t.l}
            </button>
          ))}
        </div>

        {tab === "overview" && <Overview />}
        {tab === "domains" && <DomainsAdmin />}
        {tab === "offers" && <OffersAdmin />}
      </div>
    </div>
  );
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pass === ADMIN_PASS) {
      localStorage.setItem(STORAGE_AUTH, "1");
      onSuccess();
    } else {
      setErr("كلمة المرور غير صحيحة");
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#fbfaf6] rounded-2xl p-8 shadow-xl border border-[#e4dfd2]"
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#4a9d93] to-[#226962] flex items-center justify-center mb-3 shadow-lg shadow-[#4a9d93]/30">
            <span className="font-black text-xl text-white">ن</span>
          </div>
          <h2 className="text-2xl font-black text-[#1a2422]">دخول لوحة التحكم</h2>
          <p className="text-[#6b7572] text-sm mt-2">للمدراء فقط</p>
        </div>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-[#6b7572]">كلمة المرور</span>
          <input
            type="password"
            value={pass}
            onChange={(e) => { setPass(e.target.value); setErr(""); }}
            className="mt-2 w-full bg-[#f6f4ee] border border-[#e4dfd2] rounded-lg px-4 py-3 outline-none focus:border-[#4a9d93] focus:shadow-[0_0_0_3px_rgba(74,157,147,0.15)] text-[#1a2422]"
            placeholder="••••••••"
            autoFocus
          />
        </label>
        {err && <p className="text-red-500 text-xs mt-2">{err}</p>}
        <button type="submit" className="btn-cyan w-full mt-5 py-3 rounded-xl text-sm">
          دخول
        </button>
      </motion.form>
    </div>
  );
}

function Overview() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [d, o] = await Promise.all([getDomains(), getOffers()]);
        setDomains(d || []);
        setOffers(o || []);
      } catch (err) {
        console.error("❌ خطأ في Overview:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const unread = offers.filter((o) => o.status === "UNREAD").length;
  const totalValue = domains.reduce((acc, d) => acc + (d.price ?? 0), 0);

  const stats = [
    { l: "إجمالي النطاقات", v: domains.length, c: "teal" },
    { l: "العروض المستلمة", v: offers.length, c: "emerald" },
    { l: "عروض غير مقروءة", v: unread, c: "sand" },
    { l: "قيمة الكتالوج (USD)", v: `$${totalValue.toLocaleString("en-US")}`, c: "teal" },
  ];

  const recent = offers.slice(0, 5);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin w-12 h-12 border-4 border-[#4a9d93] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-white/50">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.l} className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="text-xs uppercase tracking-widest text-white/40">{s.l}</div>
            <div className={`mt-2 text-3xl font-black ${s.c === "teal" ? "text-[#4a9d93]" : s.c === "emerald" ? "text-emerald-400" : "text-[#d4a76a]"}`}>
              {s.v}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="font-bold text-lg text-white mb-4">آخر العروض</h3>
        {recent.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-white/40">
            لا توجد عروض حتى الآن.
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-widest text-white/30 bg-white/5">
                <tr>
                  <th className="text-right p-4">المشتري</th>
                  <th className="text-right p-4">النطاق</th>
                  <th className="text-right p-4">المبلغ</th>
                  <th className="text-right p-4">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => {
                  const d = domains.find((d) => d.id === o.domainId);
                  return (
                    <tr key={o.id} className="border-t border-white/5">
                      <td className="p-4">
                        <div className="font-bold text-white">{o.buyerName}</div>
                        <div className="text-xs text-white/40">{o.email}</div>
                      </td>
                      <td className="p-4 domain-display text-white">{d ? `${d.name}${d.tld}` : "—"}</td>
                      <td className="p-4 text-[#4a9d93] font-bold">${o.offerAmount.toLocaleString("en-US")}</td>
                      <td className="p-4"><StatusBadge status={o.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function DomainsAdmin() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [editing, setEditing] = useState<Domain | null>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const d = await getDomains();
    setDomains(d || []);
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin w-12 h-12 border-4 border-[#4a9d93] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-white/50">جاري تحميل النطاقات...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div className="text-sm text-white/50">{domains.length} نطاق</div>
        <button onClick={() => setCreating(true)} className="btn-cyan px-5 py-2.5 rounded-full text-sm">
          + إضافة نطاق
        </button>
      </div>

      {domains.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-white/40">
          <div className="text-4xl mb-3">📋</div>
          <p>لا توجد نطاقات بعد. أضف أول نطاق!</p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-widest text-white/30 bg-white/5">
              <tr>
                <th className="text-right p-4">النطاق</th>
                <th className="text-right p-4">الفئة</th>
                <th className="text-right p-4">السعر</th>
                <th className="text-right p-4">الحالة</th>
                <th className="text-right p-4">المشاهدات</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {domains.map((d) => (
                <DomainRow key={d.id} domain={d} onEdit={setEditing} onDelete={refresh} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!editing || creating} onClose={() => { setEditing(null); setCreating(false); }} title={editing ? "تعديل النطاق" : "إضافة نطاق جديد"}>
        <DomainForm
          initial={editing}
          onDone={async () => { setEditing(null); setCreating(false); await refresh(); }}
        />
      </Modal>
    </div>
  );
}

function DomainRow({ domain, onEdit, onDelete }: { domain: Domain; onEdit: (d: Domain) => void; onDelete: () => void }) {
  const [cat, setCat] = useState<Category | null>(null);

  useEffect(() => {
    getCategories().then((cats) => {
      const found = cats.find((c) => c.id === domain.categoryId) || null;
      setCat(found);
    });
  }, [domain.categoryId]);

  return (
    <tr className="border-t border-white/5">
      <td className="p-4">
        <div className="domain-display font-bold text-white">
          {domain.name}<span className="text-[#4a9d93]">{domain.tld}</span>
        </div>
        {domain.featured && <span className="text-[10px] text-[#4a9d93]">★ مميز</span>}
      </td>
      <td className="p-4 text-white/50">{cat?.name ?? "—"}</td>
      <td className="p-4">
        {domain.price === null ? (
          <span className="text-[#d4a76a] text-xs">عروض</span>
        ) : (
          <span className="text-[#4a9d93] font-bold">${domain.price.toLocaleString("en-US")}</span>
        )}
      </td>
      <td className="p-4">
        <span className={`text-xs px-2 py-1 rounded-full border ${
          domain.status === "AVAILABLE"
            ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
            : domain.status === "PENDING"
            ? "border-yellow-500/30 text-yellow-400 bg-yellow-500/10"
            : "border-white/10 text-white/40"
        }`}>
          {domain.status === "AVAILABLE" ? "متاح" : domain.status === "PENDING" ? "قيد التفاوض" : "مباع"}
        </span>
      </td>
      <td className="p-4 text-white/40">{domain.views}</td>
      <td className="p-4 text-left">
        <button onClick={() => onEdit(domain)} className="text-[#4a9d93] hover:underline text-xs ml-3">
          تعديل
        </button>
        <button
          onClick={async () => {
            if (confirm(`حذف النطاق ${domain.name}${domain.tld}?`)) {
              await deleteDomain(domain.id);
              onDelete();
            }
          }}
          className="text-red-400 hover:underline text-xs"
        >
          حذف
        </button>
      </td>
    </tr>
  );
}

function DomainForm({ initial, onDone }: { initial: Domain | null; onDone: () => void }) {
  const [cats, setCats] = useState<Category[]>([]);
  const [name, setName] = useState(initial?.name ?? "");
  const [tld, setTld] = useState(initial?.tld ?? ".com");
  const [arabicName, setArabicName] = useState(initial?.arabicName ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [priceMode, setPriceMode] = useState<"fixed" | "offer">(initial?.price === null ? "offer" : "fixed");
  const [price, setPrice] = useState<string>(initial?.price ? String(initial.price) : "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [status, setStatus] = useState<Domain["status"]>(initial?.status ?? "AVAILABLE");
  const [featured, setFeatured] = useState(initial?.featured ?? false);

  useEffect(() => {
    getCategories().then((c) => {
      setCats(c || []);
      if (!categoryId && c?.length > 0) setCategoryId(c[0].id);
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      name: name.trim().toLowerCase(),
      tld,
      arabicName,
      description,
      price: priceMode === "offer" ? null : Number(price),
      status,
      categoryId,
      featured,
    };
    
    console.log("📤 البيانات المرسلة:", data);
    
    try {
      let result;
      if (initial) {
        result = await updateDomain(initial.id, data);
        console.log("✅ تم التحديث:", result);
      } else {
        result = await createDomain(data);
        console.log("✅ تم الإنشاء:", result);
      }
      
      if (!result) {
        alert("❌ فشل الحفظ - تحقق من Console");
        return;
      }
      
      onDone();
    } catch (error) {
      console.error("❌ خطأ في الحفظ:", error);
      alert("❌ خطأ: " + (error as any).message);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className="text-xs uppercase tracking-widest text-[#6b7572]">الاسم</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="form-input-light mt-1" placeholder="aqar" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[#6b7572]">الامتداد</label>
          <select value={tld} onChange={(e) => setTld(e.target.value)} className="form-input-light mt-1">
            {[".com", ".net", ".org", ".io", ".co"].map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest text-[#6b7572]">الاسم بالعربية (اختياري)</label>
        <input value={arabicName} onChange={(e) => setArabicName(e.target.value)} className="form-input-light mt-1" placeholder="عَقار" />
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest text-[#6b7572]">الوصف</label>
        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="form-input-light mt-1 resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs uppercase tracking-widest text-[#6b7572]">الفئة</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="form-input-light mt-1">
            {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[#6b7572]">الحالة</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as Domain["status"])} className="form-input-light mt-1">
            <option value="AVAILABLE">متاح</option>
            <option value="PENDING">قيد التفاوض</option>
            <option value="SOLD">مباع</option>
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest text-[#6b7572]">طريقة التسعير</label>
        <div className="mt-2 flex gap-2">
          <button type="button" onClick={() => setPriceMode("fixed")} className={`flex-1 py-2 rounded-lg text-sm border ${priceMode === "fixed" ? "border-[#4a9d93] bg-[#4a9d93]/10 text-[#226962]" : "border-[#e4dfd2] text-[#6b7572]"}`}>
            سعر ثابت
          </button>
          <button type="button" onClick={() => setPriceMode("offer")} className={`flex-1 py-2 rounded-lg text-sm border ${priceMode === "offer" ? "border-[#d4a76a] bg-[#d4a76a]/10 text-[#a6553a]" : "border-[#e4dfd2] text-[#6b7572]"}`}>
            استقبال عروض
          </button>
        </div>
        {priceMode === "fixed" && (
          <input
            required type="number" min={1} value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="form-input-light mt-3" placeholder="السعر بالدولار"
          />
        )}
      </div>
      <label className="flex items-center gap-2 text-sm text-[#6b7572]">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-[#4a9d93]" />
        عرض كنطاق مميّز في الصفحة الرئيسية
      </label>
      <button type="submit" className="btn-cyan w-full py-3 rounded-xl text-sm">
        {initial ? "حفظ التعديلات" : "إضافة النطاق"}
      </button>
    </form>
  );
}

function OffersAdmin() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [filter, setFilter] = useState<OfferStatus | "ALL">("ALL");
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const o = await getOffers();
    setOffers(o || []);
  }

  useEffect(() => {
    Promise.all([getOffers(), getDomains()]).then(([o, d]) => {
      setOffers(o || []);
      setDomains(d || []);
      setLoading(false);
      
      o?.forEach((offer) => {
        if (offer.status === "UNREAD") updateOfferStatus(offer.id, "READ");
      });
    });
  }, []);

  const filtered = filter === "ALL" ? offers : offers.filter((o) => o.status === filter);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin w-12 h-12 border-4 border-[#4a9d93] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-white/50">جاري تحميل العروض...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        {(["ALL", "UNREAD", "READ", "ACCEPTED", "REJECTED"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs border ${
              filter === s ? "border-[#4a9d93]/50 bg-[#4a9d93]/10 text-[#4a9d93]" : "border-white/10 text-white/40 hover:border-white/20"
            }`}
          >
            {labelFor(s)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-white/40">
          لا توجد عروض في هذه الفئة.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => {
            const d = domains.find((x) => x.id === o.domainId);
            return (
              <div key={o.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-white/30 mb-1">
                      {new Date(o.created_at).toLocaleString("ar-EG")}
                    </div>
                    <div className="font-bold text-lg text-white">{o.buyerName}</div>
                    <div className="text-sm text-white/50">{o.email} {o.phone && `• ${o.phone}`}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-white/30">على النطاق</div>
                    <div className="domain-display font-bold text-white">
                      {d ? `${d.name}${d.tld}` : "—"}
                    </div>
                    <div className="text-[#4a9d93] font-black text-xl mt-1">
                      ${o.offerAmount.toLocaleString("en-US")}
                    </div>
                  </div>
                </div>
                {o.message && (
                  <div className="mt-4 bg-white/5 border border-white/5 rounded-lg p-3 text-sm text-white/70 leading-7">
                    {o.message}
                  </div>
                )}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <StatusBadge status={o.status} />
                  <div className="flex gap-2">
                    <button onClick={async () => { await updateOfferStatus(o.id, "ACCEPTED"); refresh(); }}
                      className="text-xs px-3 py-1.5 rounded-full border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                      قبول
                    </button>
                    <button onClick={async () => { await updateOfferStatus(o.id, "REJECTED"); refresh(); }}
                      className="text-xs px-3 py-1.5 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10">
                      رفض
                    </button>
                    <button onClick={async () => {
                      if (confirm("حذف هذا العرض؟")) { await deleteOffer(o.id); refresh(); }
                    }}
                      className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/40 hover:bg-white/5">
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: OfferStatus }) {
  const map: Record<OfferStatus, string> = {
    UNREAD: "border-yellow-500/30 text-yellow-300 bg-yellow-500/10",
    READ: "border-white/10 text-white/50 bg-white/5",
    ACCEPTED: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    REJECTED: "border-red-500/30 text-red-400 bg-red-500/10",
  };
  return (
    <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border ${map[status]}`}>
      {labelFor(status)}
    </span>
  );
}

function labelFor(s: string) {
  switch (s) {
    case "ALL": return "الكل";
    case "UNREAD": return "جديد";
    case "READ": return "مقروء";
    case "ACCEPTED": return "مقبول";
    case "REJECTED": return "مرفوض";
    default: return s;
  }
}