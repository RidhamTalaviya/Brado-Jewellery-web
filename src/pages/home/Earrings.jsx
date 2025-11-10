import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import ArrowRightIcon from "../../assets/icons/ArrowRightIcon";
import Leftarrow from "../../assets/icons/Leftarrow";
import Rightarrow from "../../assets/icons/Rightarrow";
import SVGHaert from "../../assets/icons/HeartIcon";
import Cart from "../../assets/icons/Cart";
import BadgePercent from "../../assets/icons/SettingsCogIcon";
import Card from "../../components/common/Card";
import axiosInstance from "../../api/AxiosInterceptor";
import { useNavigate } from "react-router-dom";
// import { BadgePercent, Heart } from "lucide-react";

function Earrings() {
  const swiperRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [canSlidePrev, setCanSlidePrev] = useState(false);
  const [canSlideNext, setCanSlideNext] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const navigate = useNavigate();
   const [earringsData, setEarringsData] = useState([]);
  const fetchEarringsData = async () => {
    const response = await axiosInstance("/product/get?category=earrings");
    console.log(response , "riya bava");
    setEarringsData(response?.data?.products);
  };

  useEffect(() => {
    fetchEarringsData();
  }, []);

  // Detect desktop
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update arrow visibility
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
    <div className="w-[87%] mx-auto">
      {/* header */}
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl md:text-[21px] font-medium section-title">
          Earrings
        </h2>

        <button className="relative flex items-center gap-2 text-[#b87a2c] font-medium text-sm cursor-pointer" onClick={() => navigate("/category/earrings")}>
          <span className="absolute -left-3 w-10 h-10 bg-[#e6d4bd] rounded-full opacity-40"></span>
          <span className="relative">View All</span>
          <ArrowRightIcon />
        </button>
      </div>

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
              ? { prevEl: ".earrings-prev", nextEl: ".earrings-next" }
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
          {earringsData?.map((product, index) => (
            <SwiperSlide key={index}>
             <Card product={product}/>
            </SwiperSlide>
          ))}

          {/* Conditional Navigation Arrows */}
          {isDesktop && showArrows && canSlidePrev && (
            <div className="earrings-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer">
              <Leftarrow />
            </div>
          )}
          {isDesktop && showArrows && canSlideNext && (
            <div className="earrings-next absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer">
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

export default Earrings;
