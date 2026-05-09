import { useState } from "react";
import { motion } from "framer-motion";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setEmail("");
    }, 800);
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f6f4ee] via-[#eaf4f1] to-[#f6f4ee] border-t border-b border-[#e4dfd2]">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_top_right,rgba(74,157,147,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_bottom_left,rgba(74,157,147,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-5 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#4a9d93]/40 bg-[#4a9d93]/10 text-[#226962] text-xs tracking-widest mb-6 font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#4a9d93] animate-pulse" />
            VIP Access
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-[#1a2422] leading-tight">
            انضم لقائمة <span className="gold-text">النخبة</span>
          </h2>

          <p className="mt-4 text-[#6b7572] text-lg max-w-2xl mx-auto leading-8">
            كن أول من يعلم عن النطاقات العربية الفاخرة والفرص الاستثمارية قبل طرحها للعامة.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#eaf4f1] border border-[#4a9d93]/30 text-[#226962]"
            >
              <div className="w-8 h-8 rounded-full bg-[#4a9d93]/20 flex items-center justify-center">
                ✓
              </div>
              <div className="text-right">
                <div className="font-bold">تم الاشتراك بنجاح!</div>
                <div className="text-sm text-[#4a9d93]">شكراً لانضمامك لقائمة النخبة</div>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="البريد الإلكتروني"
                    className="w-full px-5 py-4 rounded-full bg-white border-2 border-[#e4dfd2] text-[#1a2422] placeholder:text-[#6b7572] outline-none focus:border-[#4a9d93] focus:shadow-[0_0_0_4px_rgba(74,157,147,0.15)] transition"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7572]">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="M22 6l-10 7L2 6"/>
                    </svg>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-cyan px-8 py-4 rounded-full text-sm font-semibold whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "جارٍ..." : "اشتراك"}
                </button>
              </div>
              <p className="mt-4 text-xs text-[#6b7572]">
                نعدك بعدم إرسال رسائل مزعجة. يمكنك إلغاء الاشتراك في أي وقت.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}