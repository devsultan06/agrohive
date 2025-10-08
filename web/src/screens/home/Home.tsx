import { motion } from "framer-motion";
import Header from "../../components/Header";
import Features from "../../components/Features";
import Benefits from "../../components/Benefits";
import Testimonials from "../../components/Testimonials";
import FAQ from "../../components/FAQ";
import Transform from "../../components/Transform";
import Footer from "../../components/Footer";

const Home = () => {
  return (
    <div className="overflow-hidden">
      {/* Header - Entrance animation */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          ease: "easeOut",
          delay: 0.2,
        }}
      >
        <Header />
      </motion.div>

      {/* Features - Fade up with scale */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Features />
      </motion.div>

      {/* Benefits - Slide from left */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Benefits />
      </motion.div>

      {/* Testimonials - Slide from right */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Testimonials />
      </motion.div>

      {/* FAQ - Fade up */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <FAQ />
      </motion.div>

      {/* Transform - Scale and fade with spring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: 0.9,
          ease: "easeOut",
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
      >
        <Transform />
      </motion.div>

      {/* Footer - Simple fade up */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Footer />
      </motion.div>
    </div>
  );
};

export default Home;
