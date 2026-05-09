import { useState } from "react";
import { motion } from "framer-motion";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    
    // ✅ هنا يمكنك إضافة منطق حفظ البريد الإلكتروني في Supabase
    console.log("📧 Email submitted:", email);
    
    // محاكاة تأخير الإرسال
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setEmail("");
      
      // إعادة تعيين الرسالة بعد 3 ثوانٍ
      setTimeout(() => setSubmitted(false), 3000);
    }, 1000);
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2f8279] via-[#226962] to-[#18524d] py-12 px-6 md:py-16 md:px-12 shadow-2xl shadow-[#2f8279]/20">
      {/* Background decorative elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-[#4a9d93]/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(74,157,147,0.1),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-[#d4a76a] animate-pulse" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/80 font-semibold">
            VIP Access
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-black text-white mb-3"
        >
          انضم لقائمة النخبة
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-white/70 text-base md:text-lg leading-relaxed mb-8"
        >
          كن أول من يعلم عن النطاقات العربية الفاخرة والفرص الاستثمارية قبل طرحها للعامة.
        </motion.p>

        {submitted ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/15 rounded-2xl p-6 backdrop-blur-sm border border-white/20"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#d4a76a]/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#d4a76a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold">تم الاشتراك بنجاح!</p>
                <p className="text-white/60 text-sm">شكراً لانضمامك إلى قائمة النخبة</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              required
              className="flex-1 px-5 py-3 rounded-full bg-white text-[#1a2422] placeholder:text-[#6b7572] outline-none focus:ring-2 focus:ring-[#d4a76a] border-0"
              dir="ltr"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#d4a76a] to-[#a6553a] text-white font-bold text-sm hover:brightness-105 transition-all disabled:opacity-60 shadow-lg shadow-[#d4a76a]/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                "اشتراك"
              )}
            </button>
          </motion.form>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-white/40 text-xs mt-6"
        >
          تعدك بعدم إرسال رسائل مزعجة. يمكنك إلغاء الاشتراك في أي وقت.
        </motion.p>
      </div>
    </section>
  );
}