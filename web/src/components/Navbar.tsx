import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-[#FAFAFA] ">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-[26px]">
        <div className="flex justify-between items-center h-[85px]">
          <div className="flex gap-[42px] items-center">
            <Link to="/">
              {" "}
              <div className="flex items-center">
                <img
                  src="/images/agrohive.png"
                  alt="AgroHive"
                  className="h-[24px] w-[24px]"
                />
                <span className="ml-2 text-[16px] font-[700] text-[#333]">
                  Agro<span className="text-[#19641E]">Hive</span>
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/features"
                className="text-[#333] text-[16px] tracking-[-0.24px] hover:text-[#19641E] font-[500] transition-colors duration-200"
              >
                Features
              </Link>

              <Link
                to="/contact"
                className="text-[#333] text-[16px] tracking-[-0.24px] hover:text-[#19641E] font-[500] transition-colors duration-200"
              >
                Contact
              </Link>
              <Link
                to="/demo"
                className="text-[#333] text-[16px] tracking-[-0.24px] hover:text-[#19641E] font-[500] transition-colors duration-200"
              >
                Watch the Demo
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-[16px]">
            <a
              href="#"
              className="inline-flex app  items-center px-[16px] py-[12px] bg-[#19641E] text-white text-[16px] font-[500] rounded-[100px] hover:bg-green-700 transition-colors duration-200"
            >
              <img
                src="/images/Apple.svg"
                alt="Apple Logo"
                className="w-5 h-5 mr-2"
              />
              Get on App Store
            </a>

            <a
              href="#"
              className="inline-flex items-center px-[16px] py-[12px] border border-[#19641E] text-[#0F0F0F] text-[16px] font-[500] rounded-[100px] hover:bg-gray-200 transition-colors duration-200"
            >
              <img
                src="/images/Playstore.svg"
                alt="Google Play Logo"
                className="w-5 h-5 mr-2"
              />
              Get on Play Store
            </a>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-green-600 p-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-1/2 bg-white shadow-lg z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-6 border-b">
                  <span className="text-lg font-semibold text-gray-900">
                    Menu
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 py-6">
                  <div className="space-y-1">
                    <div className="px-6 space-y-1">
                      <Link
                        to="/features"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-3 text-[#333] text-[16px] tracking-[-0.24px] hover:text-[#19641E] font-[500] transition-colors duration-200"
                      >
                        Features
                      </Link>
                      <Link
                        to="/contact"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-3 text-[#333] text-[16px] tracking-[-0.24px] hover:text-[#19641E] font-[500] transition-colors duration-200"
                      >
                        Contact
                      </Link>

                      <Link
                        to="/demo"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-3 text-[#333] text-[16px] tracking-[-0.24px] hover:text-[#19641E] font-[500] transition-colors duration-200"
                      >
                        Watch the Demo
                      </Link>
                    </div>
                  </div>
                </div>
                ={" "}
                <div className="p-6 border-t space-y-3">
                  <a
                    href="#"
                    className="flex app justify-center items-center px-[16px] py-[12px] bg-[#19641E] text-white text-[16px] font-[500] rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    <img
                      src="/images/Apple.svg"
                      alt="Apple Logo"
                      className="w-4 h-4 mr-2"
                    />
                    Get on App Store
                  </a>

                  <a
                    href="#"
                    className="flex items-center justify-center px-[16px] py-[12px] border border-[#19641E] text-[#0F0F0F] text-[16px] font-[500] rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    <img
                      src="/images/Playstore.svg"
                      alt="Google Play Logo"
                      className="w-4 h-4 mr-2"
                    />
                    Get on Play Store
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
