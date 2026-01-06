import { motion, useScroll } from "framer-motion";
import Footer from "@/component/Footer";
import Navbar from "@/component/Navbar";
import { Button } from "@/components/ui/button";
import {  useNavigate } from "react-router-dom";
import { GoArrowUpRight } from "react-icons/go";

function Landing() {
  const { scrollYProgress } = useScroll();
  const navigate=useNavigate()

  return (
    <>
      <Navbar logged={false} />

      <motion.div
        style={{
          scaleX: scrollYProgress,
          position: "fixed",
          top: 60,
          left: 0,
          right: 0,
          height: 6,
          originX: 0,
          backgroundColor: "#fff312",
          zIndex: 50,
        }}
      />

      <div className="min-h-screen  bg-[#0d63f844] text-black flex flex-col items-center justify-center px-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="text-sm"
        >
          <h1 className="text-4xl font-bold text-center max-w-xl">
            Welcome to Shouty — your free URL shortener
          </h1>
        </motion.div>

        <div className="flex justify-center text-black px-6 pt-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-2xl text-center"
          >
            {/* Accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mx-auto mb-6 h-0.5 w-16 origin-left"
            />

            {/* Description */}
            <p className="text-black text-lg leading-relaxed">
              Shouty is a fast and secure URL shortener that turns long, messy
              links into clean, shareable URLs. Create short links instantly,
              track how often they’re used, and manage everything from a simple
              dashboard.
            </p>

            {/* Feature list */}
            <ul className="mt-6 space-y-2 text-black text-xl">
              <li>• Shorten URLs in seconds</li>
              <li>• Track link usage and popularity</li>
              <li>• Secure authentication with Google</li>
              <li>• Built for speed and reliability</li>
            </ul>
          </motion.div>
        </div>

        <div className="flex justify-center text-black px-6 pt-10">
          <Button
            onClick={() => navigate("/signin")}
            className="bg-[#4ff0b7] text-black text-lg hover:bg-[#3fd9a3]"
          >
            Get started for free <GoArrowUpRight size={32} />
          </Button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Landing;
