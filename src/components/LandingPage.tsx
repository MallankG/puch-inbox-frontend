import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import TestimonialsSection from "./TestimonialsSection";
import Footer from "./Footer";
import Navigation from "./Navigation";
import BackgroundIcons from "./BackgroundIcons";
import { motion } from "framer-motion";

const LandingPage = () => {
  return (
    <div className="min-h-screen aurora-bg text-white relative overflow-hidden">
      {/* Animated mail/envelope icons */}
      <BackgroundIcons count={20} />

      <Navigation />
      {/* Animated sections with framer-motion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <HeroSection />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <FeaturesSection />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <HowItWorksSection />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <TestimonialsSection />
      </motion.div>
      <Footer />
    </div>
  );
};

export default LandingPage;
