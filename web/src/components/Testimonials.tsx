import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const swiperStyles = `
    .testimonials-swiper {
      width: 100%;
      height: auto;
      overflow: hidden;
    }
    .testimonials-swiper .swiper-wrapper {
      display: flex;
      transition-property: transform;
      transition-duration: 300ms;
    }
    .testimonials-swiper .swiper-slide {
      width: 100% !important;
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `;

  const testimonials = [
    {
      name: "Boluwa",
      role: "Poultry Farmer",
      image: "/images/t1.png",
      rating: 5,
      quote:
        "With AgroHive, I've embraced modern farming technology, and the results have been incredible. The app's marketplace made it easy to find affordable tools, while the learning videos helped me use them effectively.",
    },
    {
      name: "Adebayo",
      role: "Crop Farmer",
      image: "/images/t1.png",
      rating: 5,
      quote:
        "AgroHive has transformed my farming experience. The weather updates help me plan better, and the expert tutorials have improved my crop yields significantly. Highly recommended!",
    },
    {
      name: "Fatima",
      role: "Livestock Farmer",
      image: "/images/t1.png",
      rating: 5,
      quote:
        "The marketplace feature is incredible! I found quality equipment at great prices, and the community support through the app has been invaluable for my farming journey.",
    },
  ];

  const renderCustomPagination = () => {
    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`transition-all duration-300 ${
              index === activeIndex ? "opacity-100" : "opacity-40"
            }`}
            onClick={() => {
              if (swiperRef.current) {
                swiperRef.current.slideTo(index);
              }
            }}
          >
            {index === activeIndex ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="84"
                height="20"
                viewBox="0 0 114 20"
                fill="none"
              >
                <path
                  d="M0.75 10C0.75 4.6265 5.35833 0.409629 10.7107 0.885398L52.573 4.60649C55.5185 4.86831 58.4815 4.86831 61.427 4.60649L103.289 0.885397C108.642 0.409629 113.25 4.6265 113.25 10C113.25 15.3735 108.642 19.5904 103.289 19.1146L61.427 15.3935C58.4815 15.1317 55.5185 15.1317 52.573 15.3935L10.7107 19.1146C5.35832 19.5904 0.75 15.3735 0.75 10Z"
                  fill="#1C6206"
                />
              </svg>
            ) : (
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <circle cx="4" cy="4" r="4" fill="#D1D5DB" />
              </svg>
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <section className="bg-white py-20">
      <style dangerouslySetInnerHTML={{ __html: swiperStyles }} />
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-[26px]">
        <div className="text-center mb-16">
          <h2 className="text-[40px] sm:text-[48px] max-w-[743px] leading-[70px] mx-auto lg:text-[48px] font-[600] text-[#000000] ">
            What our customers say!
          </h2>
        </div>

        <div className="flex justify-end gap-4 ">
          <button
            onClick={() => {
              if (swiperRef.current) {
                swiperRef.current.slidePrev();
              }
            }}
            className="w-[44px] h-[44px] prev rounded-[100px] flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M20.0505 11.47L13.0505 4.47C12.8575 4.28243 12.5792 4.21204 12.3203 4.28533C12.0614 4.35863 11.8613 4.56447 11.7953 4.82533C11.7293 5.08619 11.8075 5.36243 12.0005 5.55L17.7105 11.25H4.48047C4.06626 11.25 3.73047 11.5858 3.73047 12C3.73047 12.4142 4.06626 12.75 4.48047 12.75H17.7005L12.0005 18.45C11.8575 18.5893 11.7769 18.7804 11.7769 18.98C11.7769 19.1796 11.8575 19.3707 12.0005 19.51C12.1383 19.6546 12.3307 19.7345 12.5305 19.73C12.7295 19.7309 12.9206 19.6516 13.0605 19.51L20.0605 12.51C20.3529 12.2172 20.3529 11.7428 20.0605 11.45L20.0505 11.47Z"
                fill="black"
              />
            </svg>
          </button>

          <button
            onClick={() => {
              if (swiperRef.current) {
                swiperRef.current.slideNext();
              }
            }}
            className="w-[44px] h-[44px] bg-[#1C6206] rounded-[100px] flex items-center justify-center hover:bg-[#155018] transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M20.0505 11.47L13.0505 4.47C12.8575 4.28243 12.5792 4.21204 12.3203 4.28533C12.0614 4.35863 11.8613 4.56447 11.7953 4.82533C11.7293 5.08619 11.8075 5.36243 12.0005 5.55L17.7105 11.25H4.48047C4.06626 11.25 3.73047 11.5858 3.73047 12C3.73047 12.4142 4.06626 12.75 4.48047 12.75H17.7005L12.0005 18.45C11.8575 18.5893 11.7769 18.7804 11.7769 18.98C11.7769 19.1796 11.8575 19.3707 12.0005 19.51C12.1383 19.6546 12.3307 19.7345 12.5305 19.73C12.7295 19.7309 12.9206 19.6516 13.0605 19.51L20.0605 12.51C20.3529 12.2172 20.3529 11.7428 20.0605 11.45L20.0505 11.47Z"
                fill="white"
              />
            </svg>
          </button>
        </div>

        <div className="relative overflow-hidden">
          <Swiper
            modules={[]}
            spaceBetween={0}
            slidesPerView={1}
            slidesPerGroup={1}
            centeredSlides={false}
            loop={false}
            allowTouchMove={true}
            watchSlidesProgress={true}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="testimonials-swiper"
            style={{
              width: "100%",
              height: "auto",
              overflow: "hidden",
            }}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="w-full h-full flex items-center justify-center ">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-[100px] md:gap-[167px] mx-auto">
                    <div className="flex-shrink-0 ml-[-100px] md:ml-0">
                      <div className="bg-[#1C6206] rounded-[20px] py-[86px] px-[28px] text-white relative ">
                        {" "}
                        <div className="absolute -right-[130px] top-[67px]">
                          <div className="w-[218px] h-[180px] rounded-[12px] overflow-hidden">
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="pr-24">
                          <h3 className="text-[32px] font-[500] mb-[16px] ">
                            {testimonial.name}
                          </h3>
                          <p className="text-[28px] font-[400] mb-8">
                            {testimonial.role}
                          </p>

                          <div className="flex space-x-2">
                            {[...Array(testimonial.rating)].map(() => (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="28"
                                height="26"
                                viewBox="0 0 28 26"
                                fill="none"
                              >
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M15.5116 22.2369C14.6189 21.5561 13.3811 21.5561 12.4884 22.2369L8.89323 24.9785C6.92434 26.4799 4.20764 24.5032 5.03042 22.1678L6.52631 17.922C6.90032 16.8604 6.51657 15.6798 5.58981 15.0411L1.88464 12.4873C-0.155209 11.0813 0.882412 7.88319 3.35914 7.94261L7.8699 8.05082C8.99339 8.07777 9.996 7.34967 10.318 6.27298L11.6117 1.9475C12.3209 -0.423902 15.6791 -0.423903 16.3883 1.9475L17.682 6.27298C18.004 7.34967 19.0066 8.07777 20.1301 8.05082L24.6409 7.94261C27.1176 7.88319 28.1552 11.0813 26.1154 12.4873L22.4102 15.0411C21.4834 15.6798 21.0997 16.8604 21.4737 17.922L22.9696 22.1678C23.7924 24.5032 21.0757 26.4799 19.1068 24.9785L15.5116 22.2369Z"
                                  fill="#FFC068"
                                />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="">
                      <blockquote className="text-[24px] text-[#000] opacity-[0.5] font-[400]">
                        "{testimonial.quote}"
                      </blockquote>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {renderCustomPagination()}
      </div>
    </section>
  );
};

export default Testimonials;
