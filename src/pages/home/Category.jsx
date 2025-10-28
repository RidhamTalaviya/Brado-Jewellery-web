import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import bangles from "../../assets/images/Category/bangle.jpeg";
import earring from "../../assets/images/Category/earring.jpeg";
import korean from "../../assets/images/Category/korean.jpeg";
import necklace from "../../assets/images/Category/necklace.jpeg";
import ring from "../../assets/images/Category/ring.jpeg";

const Category = () => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef(null);



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
    <div className="w-[90%] mx-auto py-10">
      <h2 className="text-2xl md:text-2xl section-title inline-block left-1/2 transform -translate-x-1/2 text-center mb-8">
        BULK DEAL CATAGORY WISE
      </h2>

      <div className="relative">
        <Swiper
          modules={[Navigation]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={handleSlideChange}
          onInit={handleSlideChange}
          spaceBetween={14}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4.25 },
          }}
          className="px-6"
        >
          <SwiperSlide className="flex flex-col items-center">
            <div className="overflow-hidden rounded-sm">
              <img
                src={korean}
                alt="Korean"
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide className="flex flex-col items-center">
            <div className="overflow-hidden rounded-sm">
              <img
                src={earring}
                alt="Earrings"
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide className="flex flex-col items-center">
            <div className="overflow-hidden rounded-sm">
              <img
                src={necklace}
                alt="Necklace"
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide className="flex flex-col items-center">
            <div className="overflow-hidden rounded-sm">
              <img
                src={ring}
                alt="Ring"
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide className="flex flex-col items-center">
            <div className="overflow-hidden rounded-sm">
              <img
                src={bangles}
                alt="Bangles"
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>  
        </Swiper>

        {/* Custom Navigation Arrows - Conditional Display */}
        {/* Left Arrow - Only show if not at beginning */}
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
        
        {/* Right Arrow - Only show if not at end */}
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
  );
};

export default Category;