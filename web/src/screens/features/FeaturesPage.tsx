import { motion } from "framer-motion";

const FeaturesPage = () => {
  const allFeatures = [
    {
      image: "/images/f1.png",
      title: "Expert Farming Tutorials",
      description:
        "Learn step-by-step techniques with in-app videos and guides",
    },
    {
      image: "/images/f3.png",
      title: "Real-Time Weather Updates",
      description:
        "Stay informed with accurate weather forecasts tailored for farming needs",
    },
    {
      image: "/images/f2.png",
      title: "Marketplace for Farm Equipment",
      description:
        "Explore a digital marketplace for modern and used agricultural tools",
    },
    {
      image:
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
      title: "Crop Health Monitoring",
      description:
        "Monitor your crops' health using AI-powered analysis and satellite imagery",
    },
    {
      image:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&crop=center",
      title: "Soil Analysis Reports",
      description:
        "Get detailed soil composition reports and recommendations for optimal crop growth",
    },
    {
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center",
      title: "Pest & Disease Detection",
      description:
        "Early detection of pests and diseases using machine learning and expert knowledge",
    },
    {
      image:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop&crop=center",
      title: "Irrigation Planning",
      description:
        "Smart irrigation scheduling based on weather data and soil moisture levels",
    },
    {
      image:
        "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=300&fit=crop&crop=center",
      title: "Harvest Prediction",
      description:
        "Predict optimal harvest times and expected yields using advanced algorithms",
    },
    {
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop&crop=center",
      title: "Community Forum",
      description:
        "Connect with other farmers, share experiences, and get advice from the community",
    },
    {
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop&crop=center",
      title: "Supply Chain Management",
      description:
        "Track your produce from farm to market with transparent supply chain tools",
    },
    {
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&crop=center",
      title: "Financial Planning",
      description:
        "Manage farm finances, track expenses, and optimize profitability",
    },
    {
      image:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop&crop=center",
      title: "Sustainable Farming Tips",
      description:
        "Learn eco-friendly farming practices for sustainable agriculture",
    },
  ];

  return (
    <motion.section
      style={{
        backgroundImage: "url('/images/hero.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="bg-[#1C6206] pt-[100px] pb-[63px]"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-[26px]">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-[28px] sm:text-[36px] lg:text-[48px] font-[700] text-white mb-6">
            All Features
          </h2>
          <p className="text-[18px] sm:text-[24px] text-white font-[400] max-w-[799px] mx-auto">
            We provide all the advantages that can simplify and improve your
            farming experiences
          </p>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, staggerChildren: 0.1 }}
        >
          {allFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="group cursor-pointer h-full"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
            >
              <div className="overflow-hidden h-full flex flex-col">
                <div className="aspect-[4/3] overflow-hidden flex-shrink-0">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-105 rounded-[12px] transition-transform duration-300"
                  />
                </div>
                <div className="p-6 bg mt-[10px] hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2 flex-grow flex flex-col">
                  <h3 className="text-[20px] font-[700] text-white mb-[16px]">
                    {feature.title}
                  </h3>
                  <p className="text-[14px] text-white font-[400]">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeaturesPage;
