import Discount from "../../assets/icons/Discount";
import ArrowRightIcon from "../../assets/icons/ArrowRightIcon";
import ArrowDownIcon from "../../assets/icons/ArrowDownIcon";
import CheckBadgeIcon from "../../assets/icons/CheckBadgeIcon";
import StarRating from "../../assets/icons/startRating";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { products } from "../../constant/constant";
import { useEffect, useRef, useState } from "react";

const SpecialDeal = () => {
  const [canSlidePrev, setCanSlidePrev] = useState(false);
  const [canSlideNext, setCanSlideNext] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const swiperRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const updateArrows = (swiper) => {
    setCanSlidePrev(!swiper.isBeginning);
    setCanSlideNext(!swiper.isEnd);
  };

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#faf5ee] to-[hsla(37,30%,92%,0.21)]">
      <div className="w-[87%] mx-auto py-10">
        {/* Header */}
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl md:text-[21px] font-medium section-title mb-8">
              Special Deal
            </h2>
            <Discount className="-mt-8" />
          </div>

          <button className="relative flex items-center gap-2 text-[#b87a2c] font-medium text-sm cursor-pointer">
            <span className="absolute -left-3 w-10 h-10 bg-[#e6d4bd] rounded-full opacity-40"></span>
            <span className="relative">View All</span>
            <ArrowRightIcon />
          </button>
        </div>

        {/* Subheading */}
        <p className="text-[13.5px] tracking-wider flex items-center gap-2">
          On orders of 1 items or more, valid only on selected collection.{" "}
          <span className="text-[#b87a2c] font-medium cursor-pointer flex items-center gap-1">
            View collection <ArrowDownIcon className="rotate-180" />
          </span>
        </p>

        {/* Swiper Carousel */}
        <div className="relative">
          <Swiper
            modules={[Navigation]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              updateArrows(swiper);
            }}
            onSlideChange={updateArrows}
            spaceBetween={10}
            slidesPerView={2}
            breakpoints={{
              480: { slidesPerView: 2 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4.2 },
            }}
            className="px-6"
          >
            {products.map((item) => (
              <SwiperSlide key={item.id}>
                
                <div className="max-w-xs bg-white  rounded-2xl mt-6 border border-gray-100 overflow-hidden p-3">
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-58 mb-2 object-cover rounded-lg"
                    />
                  </div>

                  <div>
                  <div className="inline-flex items-center gap-1 text-white text-xs font-medium mb-1 px-2 py-1 pr-6 bg-[#0e854d] relative [clip-path:polygon(0_0,100%_0,85%_100%,0_100%)] rounded-sm">
                  <CheckBadgeIcon  size={17} />
                  Special Deal
                  <span className="absolute top-0 right-0 w-0 h-0 border-t-[14px] border-t-transparent border-l-[14px] border-l-[#0e854d] border-b-[14px] border-b-transparent"></span>
                </div>
                <h3 className="text-gray-800 font-medium text-[13px] mb-1 truncate">
                      {item.title}
                    </h3>
                    <StarRating rating={item.rating} size={20} />

                    <div className="mt-2">
                      <p className="text-black font-medium">{item.price}</p>
                      <p className="text-gray-500 text-[11.5px]">
                        Current Price:{" "}
                        <span className="font-medium text-black">
                          {item.currentPrice}
                        </span>
                      </p>
                    </div>

                    <button className="mt-2 w-full bg-[#b87a2c] hover:bg-[#9c6524] text-white text-[13.5px] font-medium py-1.5 rounded-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </SwiperSlide>
              
            ))}
          </Swiper>
     

          {!isMobile && canSlidePrev && (
            <div 
              onClick={handlePrev}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/60 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          )}
          
          {!isMobile && canSlideNext && (
            <div 
              onClick={handleNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialDeal;