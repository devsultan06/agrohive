import { motion } from "framer-motion";
import { useState } from "react";

const DemoPage = () => {
  const [selectedDemo, setSelectedDemo] = useState("overview");

  const demoVideos = [
    {
      id: "overview",
      title: "Platform Overview",
      description:
        "Get a complete walkthrough of the AgroHive platform and its key features",
      duration: "3:45",
      thumbnail:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=225&fit=crop&crop=center",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual demo video
    },
    {
      id: "farming-tutorials",
      title: "Expert Farming Tutorials",
      description:
        "See how our step-by-step farming guides can help improve your agricultural practices",
      duration: "5:20",
      thumbnail:
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=225&fit=crop&crop=center",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual demo video
    },
    {
      id: "weather-updates",
      title: "Weather Monitoring",
      description:
        "Learn how real-time weather updates can optimize your farming decisions",
      duration: "4:15",
      thumbnail:
        "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=225&fit=crop&crop=center",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual demo video
    },
    {
      id: "crop-monitoring",
      title: "Crop Health Monitoring",
      description:
        "Discover how AI-powered crop monitoring can detect issues before they become problems",
      duration: "6:30",
      thumbnail:
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=225&fit=crop&crop=center",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual demo video
    },
    {
      id: "marketplace",
      title: "Equipment Marketplace",
      description:
        "Explore our digital marketplace for agricultural tools and equipment",
      duration: "4:45",
      thumbnail:
        "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=225&fit=crop&crop=center",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual demo video
    },
    {
      id: "mobile-app",
      title: "Mobile App Features",
      description:
        "See how you can manage your farm on-the-go with our mobile application",
      duration: "3:30",
      thumbnail:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=225&fit=crop&crop=center",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual demo video
    },
  ];

  const selectedVideo =
    demoVideos.find((video) => video.id === selectedDemo) || demoVideos[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
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
            <h1 className="text-[28px] sm:text-[36px] lg:text-[48px] font-[700] text-white mb-6">
              Watch the Demo
            </h1>
            <p className="text-[18px] sm:text-[24px] text-white font-[400] max-w-[799px] mx-auto">
              See AgroHive in action and discover how our platform can transform
              your farming experience
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Video Section */}
      <section className="py-[80px] bg-white">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-[26px]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Video Player */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-black rounded-[20px] overflow-hidden aspect-video mb-6">
                <iframe
                  src={selectedVideo.videoUrl}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="bg-[#FAFAFA] rounded-[16px] p-6">
                <h2 className="text-[24px] font-[700] text-[#000000] mb-3">
                  {selectedVideo.title}
                </h2>
                <p className="text-[16px] text-[#858C95] font-[400] mb-4">
                  {selectedVideo.description}
                </p>
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center px-3 py-1 bg-[#19641E]/10 text-[#19641E] rounded-full text-[14px] font-[500]">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {selectedVideo.duration}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-4 py-2 bg-[#19641E] text-white rounded-[8px] text-[14px] font-[500] hover:bg-[#19641E]/90 transition-all duration-200"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Video Playlist */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3 className="text-[20px] font-[700] text-[#000000] mb-6">
                More Demos
              </h3>
              <div className="space-y-4">
                {demoVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    className={`p-4 rounded-[12px] cursor-pointer transition-all duration-200 ${
                      selectedDemo === video.id
                        ? "bg-[#19641E]/10 border-2 border-[#19641E]"
                        : "bg-[#FAFAFA] border-2 border-transparent hover:border-[#E5E5E7]"
                    }`}
                    onClick={() => setSelectedDemo(video.id)}
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <div className="flex gap-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-20 h-12 object-cover rounded-[8px]"
                        />
                        <div className="absolute inset-0 bg-black/30 rounded-[8px] flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`text-[14px] font-[600] mb-1 truncate ${
                            selectedDemo === video.id
                              ? "text-[#19641E]"
                              : "text-[#000000]"
                          }`}
                        >
                          {video.title}
                        </h4>
                        <p className="text-[12px] text-[#858C95] font-[400] line-clamp-2">
                          {video.description}
                        </p>
                        <span className="text-[12px] text-[#858C95] font-[500]">
                          {video.duration}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="py-[80px] bg-[#19641E]"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-[26px] text-center">
          <motion.h2
            className="text-[28px] sm:text-[36px] font-[700] text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p
            className="text-[16px] text-white/90 font-[400] max-w-[600px] mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Join thousands of farmers who are already using AgroHive to improve
            their agricultural practices
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-[#19641E] text-[16px] font-[600] rounded-[8px] hover:bg-white/90 transition-all duration-200"
            >
              Start Free Trial
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent border-2 border-white text-white text-[16px] font-[600] rounded-[8px] hover:bg-white/10 transition-all duration-200"
            >
              Schedule a Demo Call
            </motion.button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default DemoPage;
