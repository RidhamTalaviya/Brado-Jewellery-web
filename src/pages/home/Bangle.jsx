import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import BadgePercent from "../../assets/icons/SettingsCogIcon";
import ArrowRightIcon from "../../assets/icons/ArrowRightIcon";
import Cart from "../../assets/icons/Cart";
import Leftarrow from "../../assets/icons/Leftarrow";
import Rightarrow from "../../assets/icons/Rightarrow";
import Heart from "../../assets/icons/HeartIcon";
import { bangless } from "../../constant/constant";

function BangleSet() {
  const swiperRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [canSlidePrev, setCanSlidePrev] = useState(false);
  const [canSlideNext, setCanSlideNext] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

  // Detect desktop
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update arrows
  const updateArrows = (swiper) => {
    if (!swiper) return;
    const slidesPerView = swiper.params.slidesPerView;
    const totalSlides = swiper.slides.length;
    const overflow = totalSlides > slidesPerView;

    setShowArrows(overflow);
    setCanSlidePrev(!swiper.isBeginning);
    setCanSlideNext(!swiper.isEnd);
  };

  return (
    <div className="w-[87%] mx-auto py-8">
      {/* Heading */}
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl md:text-[21px] font-medium section-title">
          Bangles Collection
        </h2>
        <button className="relative flex items-center gap-2 text-[#b87a2c] font-medium text-sm cursor-pointer">
          <span className="absolute -left-3 w-10 h-10 bg-[#e6d4bd] rounded-full opacity-40"></span>
          <span className="relative">View All</span>
          <ArrowRightIcon />
        </button>
      </div>

      {/* Swiper */}
      <div className="relative">
        <Swiper
          modules={[Navigation]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            updateArrows(swiper);
          }}
          onSlideChange={() => updateArrows(swiperRef.current)}
          navigation={
            isDesktop && showArrows
              ? { prevEl: ".bangle-prev", nextEl: ".bangle-next" }
              : false
          }
          spaceBetween={16}
          breakpoints={{
            320: { slidesPerView: 1.5 },
            480: { slidesPerView: 2.5 },
            640: { slidesPerView: 3.2 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
        >
          {bangless.map((product, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-lg overflow-hidden relative group hover:transition duration-300">
                {/* Image */}
                <div className="relative">
                  <img
                    src={product.img}
                    alt={product.title}
                    className="w-full h-64 md:h-80 object-cover transition-transform duration-300"
                  />
                  {/* Heart */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white rounded-full p-2 shadow hover:scale-110 transition">
                      <Heart className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  {/* Add to Cart */}
                  <div className="absolute left-0 right-0 bottom-0 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="w-full bg-white text-gray-800 px-4 py-2 text-sm rounded-none">
                      <div className="p-2 border border-gray-300 rounded-[1px] flex items-center justify-center gap-2">
                        <Cart className="w-4 h-4 text-gray-600" />
                        <span>Add To Cart</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-3">
                  <h3 className="text-sm md:text-base font-medium line-clamp-2 truncate">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm md:text-base font-semibold">
                      ₹{product.price}
                    </span>
                    <span className="text-xs line-through text-gray-400">
                      ₹{product.original}
                    </span>
                    <span className="text-xs md:text-sm text-orange-600">
                      ({product.discount}% OFF)
                    </span>
                  </div>

                  {/* Marquee */}
                  <div className="w-full overflow-hidden bg-[#f7f2eb] rounded-md px-2 py-1 mt-2">
                    <div className="marquee flex animate-marquee">
                      {[...Array(2)].map((_, i) => (
                        <div className="marquee-content flex" key={i}>
                          {Array(6)
                            .fill(0)
                            .map((_, j) => (
                              <span
                                key={j}
                                className="flex items-center gap-2 mr-10 whitespace-nowrap"
                              >
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#b87a2c] text-white flex-shrink-0">
                                  <BadgePercent size={12} strokeWidth={2} />
                                </span>
                                <span>Buy any 4 & Get @ ₹299</span>
                              </span>
                            ))}
                          <span className="flex-shrink-0 w-16"></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* Conditional Arrows */}
          {isDesktop && showArrows && canSlidePrev && (
            <div className="bangle-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer">
              <Leftarrow />
            </div>
          )}
          {isDesktop && showArrows && canSlideNext && (
            <div className="bangle-next absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer">
              <Rightarrow />
            </div>
          )}
        </Swiper>
      </div>

      {/* Marquee Keyframes */}
      <style>
        {`
          .marquee-content {
            display: flex;
            align-items: center;
            white-space: nowrap;
            flex-shrink: 0;
          }
          .animate-marquee {
            display: flex;
            width: max-content;
            animation: marquee 20s linear infinite;
          }
          .marquee:hover {
            animation-play-state: paused;
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
    </div>
  );
}

export default BangleSet;
