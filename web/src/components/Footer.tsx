import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-[26px] py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-[100px]">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="45"
                height="42"
                viewBox="0 0 45 42"
                fill="none"
              >
                <path
                  d="M40.6605 21.2008C40.518 21.045 40.4389 20.8415 40.4389 20.6303C40.4389 20.4191 40.518 20.2156 40.6605 20.0598L44.5127 15.7934C44.6284 15.6669 44.7029 15.5082 44.7263 15.3384C44.7497 15.1685 44.7209 14.9956 44.6437 14.8425L38.9045 3.32405C38.8438 3.1987 38.753 3.09033 38.6402 3.00854C38.5274 2.92676 38.3962 2.87412 38.2582 2.8553C38.1202 2.83648 37.9796 2.85206 37.8491 2.90066C37.7185 2.94926 37.602 3.02938 37.5099 3.13388L31.5594 9.72462C31.4801 9.81456 31.3826 9.88659 31.2733 9.93593C31.164 9.98527 31.0454 10.0108 30.9255 10.0108C30.8056 10.0108 30.687 9.98527 30.5777 9.93593C30.4684 9.88659 30.3709 9.81456 30.2916 9.72462L28.6011 7.84819C28.458 7.69226 28.3785 7.48828 28.3785 7.2766C28.3785 7.06492 28.458 6.86094 28.6011 6.705L33.3809 1.42227C33.4943 1.30088 33.5695 1.14877 33.5969 0.984944C33.6244 0.821113 33.6029 0.652826 33.5353 0.501101C33.4677 0.349377 33.3568 0.220946 33.2166 0.131852C33.0764 0.0427577 32.9131 -0.00304676 32.747 0.000157307H11.9837C11.8176 -0.00304676 11.6543 0.0427577 11.5141 0.131852C11.3739 0.220946 11.2631 0.349377 11.1954 0.501101C11.1278 0.652826 11.1064 0.821113 11.1338 0.984944C11.1613 1.14877 11.2364 1.30088 11.3498 1.42227L16.1317 6.705C16.2749 6.86094 16.3543 7.06492 16.3543 7.2766C16.3543 7.48828 16.2749 7.69226 16.1317 7.84819L14.4413 9.72462C14.3619 9.81456 14.2644 9.88659 14.1551 9.93593C14.0458 9.98527 13.9272 10.0108 13.8073 10.0108C13.6874 10.0108 13.5689 9.98527 13.4596 9.93593C13.3503 9.88659 13.2527 9.81456 13.1734 9.72462L7.22504 3.13388C7.13297 3.02892 7.01634 2.94838 6.88556 2.8995C6.75477 2.85061 6.61391 2.83489 6.47557 2.85372C6.33723 2.87256 6.2057 2.92537 6.09275 3.00745C5.9798 3.08952 5.88894 3.19829 5.82829 3.32405L0.0912297 14.8425C0.0137826 14.9954 -0.0153589 15.1682 0.00766164 15.338C0.0306822 15.5079 0.10478 15.6667 0.220132 15.7934L4.07441 20.0598C4.21696 20.2156 4.29602 20.4191 4.29602 20.6303C4.29602 20.8415 4.21696 21.045 4.07441 21.2008L0.220132 25.4672C0.10478 25.5939 0.0306822 25.7527 0.00766164 25.9226C-0.0153589 26.0924 0.0137826 26.2652 0.0912297 26.4181L5.82829 37.9344C5.88873 38.0603 5.97944 38.1693 6.09229 38.2516C6.20514 38.3339 6.33662 38.3869 6.47498 38.406C6.61334 38.425 6.75427 38.4095 6.88516 38.3607C7.01605 38.312 7.13282 38.2316 7.22504 38.1267L13.1755 31.536C13.2548 31.446 13.3524 31.374 13.4617 31.3247C13.571 31.2753 13.6895 31.2498 13.8094 31.2498C13.9294 31.2498 14.0479 31.2753 14.1572 31.3247C14.2665 31.374 14.3641 31.446 14.4434 31.536L16.1338 33.4124C16.277 33.5683 16.3564 33.7723 16.3564 33.984C16.3564 34.1957 16.277 34.3997 16.1338 34.5556L11.3519 39.8383C11.2385 39.9597 11.1634 40.1118 11.1359 40.2757C11.1085 40.4395 11.1299 40.6078 11.1975 40.7595C11.2652 40.9112 11.376 41.0397 11.5162 41.1287C11.6564 41.2178 11.8198 41.2636 11.9858 41.2604H32.7491C32.9152 41.2636 33.0785 41.2178 33.2187 41.1287C33.3589 41.0397 33.4698 40.9112 33.5374 40.7595C33.6051 40.6078 33.6265 40.4395 33.599 40.2757C33.5716 40.1118 33.4964 39.9597 33.383 39.8383L28.6032 34.5556C28.4601 34.3997 28.3806 34.1957 28.3806 33.984C28.3806 33.7723 28.4601 33.5683 28.6032 33.4124L30.2937 31.536C30.373 31.446 30.4706 31.374 30.5799 31.3247C30.6892 31.2753 30.8077 31.2498 30.9276 31.2498C31.0475 31.2498 31.1661 31.2753 31.2754 31.3247C31.3847 31.374 31.4822 31.446 31.5616 31.536L37.512 38.1267C37.6043 38.2311 37.7209 38.3111 37.8516 38.3596C37.9822 38.408 38.1228 38.4234 38.2609 38.4044C38.3989 38.3854 38.5301 38.3325 38.6428 38.2505C38.7555 38.1685 38.8461 38.0599 38.9067 37.9344L44.6458 26.4181C44.723 26.265 44.7518 26.0921 44.7284 25.9222C44.705 25.7524 44.6305 25.5937 44.5148 25.4672L40.6605 21.2008ZM25.9682 27.0478C25.968 27.1625 25.9502 27.2765 25.9154 27.3859C25.8432 27.609 25.7019 27.8033 25.512 27.9408C25.322 28.0783 25.0933 28.1519 24.8588 28.1508H19.8677C19.6335 28.152 19.4049 28.0788 19.215 27.9417C19.0251 27.8046 18.8837 27.6107 18.8111 27.388C18.7753 27.2782 18.7575 27.1633 18.7583 27.0478V14.2128C18.7575 14.0973 18.7753 13.9824 18.8111 13.8726C18.8837 13.6499 19.0251 13.456 19.215 13.3189C19.4049 13.1818 19.6335 13.1086 19.8677 13.1098H24.863C25.0975 13.1087 25.3263 13.1823 25.5162 13.3198C25.7061 13.4573 25.8474 13.6516 25.9196 13.8747C25.9544 13.9841 25.9722 14.0981 25.9724 14.2128L25.9682 27.0478Z"
                  fill="#1C6206"
                />
              </svg>
              <span className="text-[26px] font-[700] text-[#000000]">
                AgroHive
              </span>
            </div>

            <p className="text-[16px] text-[#858C95] tracking-[-0.16px] font-[500] mb-8 max-w-[380px]">
              Design outstanding interfaces with advanced Figma features in a
              matter of minutes.
            </p>

            <div className="flex ">
              <input
                type="email"
                placeholder="Input your email"
                className="flex-1 px-4 py-3 border bg-[#FAFAFA] border-[#E5E5E7] rounded-l-lg text-[14px] text-[#333] placeholder-[#999] focus:outline-none focus:border-[#19641E] focus:ring-1 focus:ring-[#19641E]"
              />
              <button className="px-6 py-3 bg-[#1C6206] text-white text-[15px] font-[600] rounded-r-lg hover:bg-[#155018] transition-colors duration-200">
                Submit
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-[16px] font-[600] text-[#323539] tracking-[-0.16px] mb-6">
              Why Choose Us?
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/scale"
                  className="text-[16px] font-[500] text-[#858C95] tracking-[-0.16px] hover:text-[#19641E] transition-colors duration-200"
                >
                  Scale
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions"
                  className="text-[16px] font-[500] text-[#858C95] tracking-[-0.16px] hover:text-[#19641E] transition-colors duration-200"
                >
                  Solutions
                </Link>
              </li>
              <li>
                <Link
                  to="/competition"
                  className="text-[16px] font-[500] text-[#858C95] tracking-[-0.16px] hover:text-[#19641E] transition-colors duration-200"
                >
                  Our Competition
                </Link>
              </li>
              <li>
                <Link
                  to="/channels"
                  className="text-[16px] font-[500] text-[#858C95] tracking-[-0.16px] hover:text-[#19641E] transition-colors duration-200"
                >
                  Channels
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="text-[16px] font-[500] text-[#858C95] tracking-[-0.16px] hover:text-[#19641E] transition-colors duration-200"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/demo"
                  className="text-[16px] font-[500] text-[#858C95] tracking-[-0.16px] hover:text-[#19641E] transition-colors duration-200"
                >
                  Watch the Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[16px] font-[600] text-[#323539] tracking-[-0.16px] mb-6">
              Company
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/leadership"
                  className="text-[16px] font-[500] text-[#858C95] tracking-[-0.16px] hover:text-[#19641E] transition-colors duration-200"
                >
                  Leadership
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-[16px] font-[500] text-[#858C95] tracking-[-0.16px] hover:text-[#19641E] transition-colors duration-200"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/investor-relations"
                  className="text-[16px] font-[500] text-[#858C95] tracking-[-0.16px] hover:text-[#19641E] transition-colors duration-200"
                >
                  Investor Relations
                </Link>
              </li>
              <li>
                <Link
                  to="/media-kit"
                  className="text-[16px] font-[500] text-[#858C95] tracking-[-0.16px] hover:text-[#19641E] transition-colors duration-200"
                >
                  Media Kit
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[16px] font-[600] text-[#323539] tracking-[-0.16px] mb-6">
              Resources
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/community"
                  className="text-[16px] font-[500] text-[#858C95] tracking-[-0.16px] hover:text-[#19641E] transition-colors duration-200"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="text-[16px] font-[500] text-[#858C95] tracking-[-0.16px] hover:text-[#19641E] transition-colors duration-200"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/help-center"
                  className="text-[16px] font-[500] text-[#858C95] tracking-[-0.16px] hover:text-[#19641E] transition-colors duration-200"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/partners"
                  className="text-[16px] font-[500] text-[#858C95] tracking-[-0.16px] hover:text-[#19641E] transition-colors duration-200"
                >
                  Partners
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#E5E5E7] mt-12 pt-8">
          <div className="text-center">
            <p className="text-[16px] font-[400] tracking-[-0.16px] text-[#858C95]">
              © 2025 Agrohive. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
