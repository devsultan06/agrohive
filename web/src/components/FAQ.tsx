import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Is there a warranty on products?",
      answer:
        "Yes! All AgroHive-procured products come with a six-month warranty",
    },
    {
      question: "Can I post and sell my products through the app?",
      answer:
        "Absolutely! You can easily post your farm products, set prices, and connect with buyers through our integrated marketplace. Our platform makes it simple to reach customers and manage your sales.",
    },
    {
      question: "Are the learning videos free?",
      answer:
        "Yes, all our educational content and learning videos are completely free for all users. We believe in empowering farmers with knowledge at no cost.",
    },
    {
      question: "How does the app help me find tools?",
      answer:
        "Our smart search and recommendation system helps you find the right tools based on your farming type, budget, and location. You can browse by category, read reviews, and compare prices from verified sellers.",
    },
    {
      question: "What makes the app different from other Apps?",
      answer:
        "AgroHive combines marketplace, education, weather updates, and community features in one platform. We focus specifically on African farming needs with local expertise, verified sellers, and content tailored to regional farming practices.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-20">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-[26px]">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-[40px] sm:text-[48px] max-w-[743px] leading-[70px] mx-auto lg:text-[48px] font-[600] text-[#000000] ">
            Frequently asked questions
          </h2>
        </div>

        {/* Left Side - Image */}
        <div className="">
          <div className="relative">
            <img
              src="/images/faq.png"
              alt="Farmer with FAQ board"
              className="w-full h-auto rounded-2xl shadow-lg"
            />
          </div>

          {/* Description Text */}

          <div className="grid grid-cols-1 lg:grid-cols-2 mt-[80px] gap-16 items-start">
            <div className="mt-8">
              <h3 className="text-[36px] font-[500] text-[#000000] mb-4 ">
                We connect our farmers with the best and help them keep up and
                stay open
              </h3>
            </div>
            {/* Right Side - FAQ Items */}
            <div className="order-1 lg:order-2 space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="faq overflow-hidden">
                  {/* Question Header */}
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="text-[20px] font-[500] text-[#000000] pr-4">
                      {faq.question}
                    </span>

                    {/* Plus/Minus Icon */}
                    <div className="flex-shrink-0">
                      <motion.div
                        animate={{ rotate: openIndex === index ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-[20px] bg-[#1C6206] rounded-[100px] h-[20px] flex items-center justify-center"
                      >
                        {openIndex === index ? (
                          // Minus icon when open
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="2"
                            viewBox="0 0 12 2"
                            fill="none"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M0 1C0 0.585786 0.424151 0.25 0.947368 0.25H11.0526C11.5758 0.25 12 0.585786 12 1C12 1.41421 11.5758 1.75 11.0526 1.75H0.947368C0.424151 1.75 0 1.41421 0 1Z"
                              fill="white"
                            />
                          </svg>
                        ) : (
                          // Plus icon when closed
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              d="M5.99961 3.59961L5.99961 8.39961M8.39961 5.99961L3.59961 5.99961"
                              stroke="white"
                              stroke-linecap="round"
                            />
                          </svg>
                        )}
                      </motion.div>
                    </div>
                  </button>

                  {/* Answer Content */}
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                          transition: {
                            height: { duration: 0.3 },
                            opacity: { duration: 0.2, delay: 0.1 },
                          },
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          transition: {
                            height: { duration: 0.3 },
                            opacity: { duration: 0.1 },
                          },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5">
                          <p className="text-[16px] text-[#000000] opacity-[0.6] font-[400] mt-3">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
