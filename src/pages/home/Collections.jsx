import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCollectionsData } from "../../redux/slices/collections";

const CollectionsSlider = () => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => state?.collections?.collections);




  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
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
    <div className="bg-gradient-to-b from-white to-[#faf8f4] py-12">
      <div className="w-[90%] mx-auto">
        {/* Header with underline */}
        <div className="text-center mb-12">
          <h2 className="text-xl md:text-[21px] font-medium text-gray-700 mb-2">
            Discover Our Collections
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-[#b87a2c] to-[#d4a866] mx-auto"></div>
        </div>

        {/* Navigation arrows positioned outside */}
        <div className="relative">
          <Swiper
            modules={[Navigation]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={handleSlideChange}
            onInit={handleSlideChange}
            spaceBetween={20}
            slidesPerView={2}
            breakpoints={{
              480: { slidesPerView: 3 },
              640: { slidesPerView: 4 },
              768: { slidesPerView: 5 },
              1024: { slidesPerView: 6.2 },
            }}
            className="collections-swiper"
          >
            {state?.map((item, index) => (
              <SwiperSlide
                onClick={() => navigate(`/category/${item?.slug}`)}
                key={index}
                className="flex flex-col items-center group"
              >
                <div className="relative mb-4 cursor-pointer">
                  <div className="rounded-full overflow-hidden shadow-lg">
                    <img
                      src={item?.icon}
                      alt={item?.slug}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <p className="text-center font-medium text-gray-700 text-sm md:text-base px-2">
                  {item?.categoryName}
                </p>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Arrows - Conditional Display */}
          {!isBeginning && (
            <div
              onClick={handlePrev}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/60 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          )}

          {!isEnd && (
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

export default CollectionsSlider;