import { Link } from "react-router-dom";

const Features = () => {
  const features = [
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
        "Stay informed with accurate weather forecasts tailored for farming needs. Icon Suggestion",
    },
    {
      image: "/images/f2.png",
      title: "Marketplace for Farm Equipment",
      description:
        "Explore a digital marketplace for modern and used agricultural tools",
    },
  ];

  return (
    <section
      style={{
        backgroundImage: "url('/images/hero.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="bg-[#1C6206] pt-[100px] pb-[63px]"
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-[26px]">
        <div className="text-center mb-16">
          <h2 className="text-[28px] sm:text-[36px] lg:text-[48px] font-[700] text-white  mb-6">
            Explore our features
          </h2>
          <p className="text-[18px] sm:text-[24px] text-white font-[400] max-w-[799px] mx-auto">
            We provide all the advantages that can simplify and improve your
            farming experiences
          </p>
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="group cursor-pointer h-full">
              <div className=" overflow-hidden  h-full flex flex-col">
                {" "}
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
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link
            to="/features"
            className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-[16px] font-[600] rounded-[100px] border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-200"
          >
            View all
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
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;
