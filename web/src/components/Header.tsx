const Header = () => {
  return (
    <header
      style={{
        backgroundImage: "url('/images/hero2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className=" flex items-center"
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-[26px] py-20">
        <div className=" text-center">
          <div className="mb-8">
            <h1 className="text-[32px] sm:text-[48px] lg:text-[64px] leading-[72px] font-[600] text-[#0F0F0F] mb-6">
              Revolutionizing Agriculture
              <br />
              <span className="text-[#0F0F0F]">Through Technology</span>
            </h1>

            <p className="text-[20px] text-[#666666] font-[400] leading-[30px] max-w-[950px] mx-auto mb-8">
              Gain access to cutting-edge tools, expert resources, and a
              thriving marketplace designed to transform farming into a
              sustainable, profitable, and technology-driven venture for farmers
              across Nigeria
            </p>

            <button className="inline-flex items-center px-[24px] py-[12px] bg-[#19641E] app text-white text-[16px] font-[500] rounded-[100px] hover:bg-[#155018] transition-colors duration-200 shadow-lg">
              Get Started
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>

          <img
            src="/images/2.png"
            alt="Phone Mockup"
            className=" lg:mt-[200px] w-full relative z-40 mx-auto"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:h-[400px] overflow-hidden lg:absolute lg:top-[550px] lg:left-[650px] gap-8 items-center">
            <img
              src="/images/3.png"
              alt="Phone Mockup"
              className=" w-[360px] z-10  mx-auto"
            />
            <img
              src="/images/1.png"
              alt="Phone Mockup"
              className=" w-[400px] z-50 mx-auto"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
