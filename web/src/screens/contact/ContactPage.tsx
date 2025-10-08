import { motion } from "framer-motion";
import { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  const contactInfo = [
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      title: "Our Location",
      description: "123 Farm Street, Agriculture City, AC 12345",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      title: "Phone Number",
      description: "+1 (555) 123-4567",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Email Address",
      description: "contact@agrohive.com",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Business Hours",
      description: "Mon - Fri: 9:00 AM - 6:00 PM",
    },
  ];

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
              Contact Us
            </h1>
            <p className="text-[18px] sm:text-[24px] text-white font-[400] max-w-[799px] mx-auto">
              Get in touch with our team of farming experts. We're here to help
              you grow better.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Info Cards */}
      <section className="py-[80px] bg-white">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-[26px]">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, staggerChildren: 0.1 }}
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                className="text-center p-8 rounded-[20px] border border-[#E5E5E7] hover:border-[#19641E] transition-all duration-300 hover:shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-[#19641E]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#19641E]">
                  {info.icon}
                </div>
                <h3 className="text-[18px] font-[700] text-[#000000] mb-2">
                  {info.title}
                </h3>
                <p className="text-[14px] text-[#858C95] font-[400]">
                  {info.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-[80px] bg-[#FAFAFA]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-[26px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-[28px] sm:text-[36px] font-[700] text-[#000000] mb-4">
                Send us a message
              </h2>
              <p className="text-[16px] text-[#858C95] font-[400] mb-8">
                Have questions about our platform? Need help with your farming
                challenges? Fill out the form below and we'll get back to you
                within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[14px] font-[600] text-[#000000] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-[#E5E5E7] rounded-[8px] text-[14px] text-[#333] placeholder-[#999] focus:outline-none focus:border-[#19641E] focus:ring-1 focus:ring-[#19641E] transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] font-[600] text-[#000000] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-[#E5E5E7] rounded-[8px] text-[14px] text-[#333] placeholder-[#999] focus:outline-none focus:border-[#19641E] focus:ring-1 focus:ring-[#19641E] transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[14px] font-[600] text-[#000000] mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#E5E5E7] rounded-[8px] text-[14px] text-[#333] placeholder-[#999] focus:outline-none focus:border-[#19641E] focus:ring-1 focus:ring-[#19641E] transition-all duration-200"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] font-[600] text-[#000000] mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-[#E5E5E7] rounded-[8px] text-[14px] text-[#333] placeholder-[#999] focus:outline-none focus:border-[#19641E] focus:ring-1 focus:ring-[#19641E] transition-all duration-200"
                      placeholder="What's this about?"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[14px] font-[600] text-[#000000] mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-[#E5E5E7] rounded-[8px] text-[14px] text-[#333] placeholder-[#999] focus:outline-none focus:border-[#19641E] focus:ring-1 focus:ring-[#19641E] transition-all duration-200 resize-vertical"
                    placeholder="Tell us more about how we can help you..."
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full md:w-auto px-8 py-4 bg-[#19641E] text-white text-[16px] font-[600] rounded-[8px] hover:bg-[#19641E]/90 transition-all duration-200 inline-flex items-center justify-center"
                >
                  Send Message
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Info & Map */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="bg-white rounded-[20px] p-8 shadow-sm border border-[#E5E5E7]">
                <h3 className="text-[24px] font-[700] text-[#000000] mb-6">
                  Get in Touch
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#19641E]/10 rounded-full flex items-center justify-center flex-shrink-0 text-[#19641E]">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-[16px] font-[600] text-[#000000] mb-1">
                        Visit Our Office
                      </h4>
                      <p className="text-[14px] text-[#858C95]">
                        123 Farm Street, Agriculture City
                        <br />
                        AC 12345, United States
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#19641E]/10 rounded-full flex items-center justify-center flex-shrink-0 text-[#19641E]">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-[16px] font-[600] text-[#000000] mb-1">
                        Email Us
                      </h4>
                      <p className="text-[14px] text-[#858C95]">
                        contact@agrohive.com
                        <br />
                        support@agrohive.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#19641E]/10 rounded-full flex items-center justify-center flex-shrink-0 text-[#19641E]">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-[16px] font-[600] text-[#000000] mb-1">
                        Call Us
                      </h4>
                      <p className="text-[14px] text-[#858C95]">
                        +1 (555) 123-4567
                        <br />
                        Mon - Fri: 9:00 AM - 6:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                {/* Placeholder for Map */}
                <div className="mt-8 h-[200px] bg-[#F5F5F5] rounded-[12px] flex items-center justify-center border border-[#E5E5E7]">
                  <div className="text-center">
                    <svg
                      className="w-12 h-12 text-[#858C95] mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="text-[14px] text-[#858C95]">
                      Interactive Map
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
