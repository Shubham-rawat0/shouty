import { motion } from "framer-motion";

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="bg-slate-950 border-t border-slate-800"
    >
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400">
   
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="text-sm"
        >
          © {new Date().getFullYear()}{" "}
          <span className="text-white font-medium">Shouty</span>. All rights
          reserved.
        </motion.div>

        {/* Center */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-center"
        >
          Fast · Secure · Free URL Shortener
        </motion.div>

        {/* Right */}
        <div className="flex items-center gap-6 text-sm">
          {["Privacy", "Terms", "GitHub"].map((item) => (
            <motion.a
              key={item}
              href="#"
              whileHover={{ y: -2, color: "#ffffff" }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="cursor-pointer"
            >
              {item}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
