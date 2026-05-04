import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, title, children }: Props) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-[#0a1a3a]/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-lg bg-white rounded-2xl p-6 md:p-8 shadow-2xl shadow-[#91eff2]/10 max-h-[90vh] overflow-y-auto border border-gray-100"
          >
            {title && (
              <div className="mb-6 flex items-start justify-between">
                <h3 className="text-xl md:text-2xl font-bold text-[#0a1a3a]">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-[#0a1a3a] transition w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
                  aria-label="إغلاق"
                >
                  ✕
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
