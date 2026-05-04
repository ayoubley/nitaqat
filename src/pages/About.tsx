import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-5 lg:px-8 py-16">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-[#5bc9cc] text-xs tracking-[0.3em] uppercase mb-2 font-semibold">
          Our Story
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-[#0a1a3a] section-title-line">من نحن</h1>
      </motion.div>

      <div className="mt-10 text-gray-600 leading-9 text-lg space-y-6">
        <p>
          <span className="cyan-text font-bold">نِطاقات</span> هو بوتيك متخصص في
          تنسيق وبيع نطاقات إنترنت مشتقّة من اللغة العربية الفصحى — مُختارة
          بعناية لتمنح علامتك التجارية حضوراً عالمياً يحمل في طيّاته أصالة
          الكلمة العربية.
        </p>
        <p>
          نؤمن بأن النطاق ليس مجرد عنوان رقمي، بل هو الواجهة الأولى لهويّتك،
          وأول انطباع يبقى في ذهن عملائك. لذلك نعمل مع شركات متعددة الجنسيات
          ومستثمرين وعلامات تجارية ناشئة لمساعدتها على امتلاك أسماء فاخرة من
          كلمة واحدة، نادرة، وذات معنى.
        </p>
      </div>

      <div className="mt-14 grid md:grid-cols-3 gap-5">
        {[
          { n: "01", t: "تنسيق فاخر", d: "كل نطاق يخضع لمراجعة لغوية وتسويقية قبل عرضه." },
          { n: "02", t: "ضمان كامل", d: "كل صفقة تتم عبر منصة Escrow.com لحماية الطرفين." },
          { n: "03", t: "خبرة عربية", d: "فريق يفهم اللغة والثقافة وأسواق المنطقة." },
        ].map((c) => (
          <motion.div
            key={c.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="luxury-card rounded-2xl p-6"
          >
            <div className="cyan-text text-3xl font-black mb-2">{c.n}</div>
            <div className="font-bold text-[#0a1a3a] text-lg">{c.t}</div>
            <div className="text-gray-500 text-sm mt-2 leading-7">{c.d}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
