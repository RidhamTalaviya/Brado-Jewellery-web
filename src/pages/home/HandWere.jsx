import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { handwear } from "../../constant/constant";

function Handwere() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-[87%] mx-auto py-8">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-medium text-gray-700 mb-2">
          Handwear
        </h2>
        <div className="w-16 h-0.5 bg-gradient-to-r from-[#b87a2c] to-[#d4a866] mx-auto"></div>
      </div>

      {isMobile ? (
        // Mobile Swiper
        <Swiper spaceBetween={16} slidesPerView={1.5}>
          {handwear.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="overflow-hidden shadow-md hover:shadow-lg transition">
                <img
                  src={item}
                  alt={`product-${index}`}
                  className="w-full h-[350px] object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        // Grid layout for desktop
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-12 gap-x-6">
          {handwear.map((item, index) => (
            <div
              key={index}
              className="overflow-hidden shadow-md hover:shadow-lg transition"
            >
              <img
                src={item}
                alt={`product-${index}`}
                className="w-full h-[450px] object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Handwere;
