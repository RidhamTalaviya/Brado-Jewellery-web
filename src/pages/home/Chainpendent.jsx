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

import SVGHaert from "../../assets/icons/HeartIcon";
import { pendent } from "../../constant/constant";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/AxiosInterceptor";
import Card from "../../components/common/Card";

function Chainpendent() {
  const swiperRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [canSlidePrev, setCanSlidePrev] = useState(false);
  const [canSlideNext, setCanSlideNext] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

    const navigate = useNavigate();
   const [pendentData, setPendentData] = useState([]);
  const fetchPendentData = async () => {
    const response = await axiosInstance("/product/get?category=chain-pendant");
    setPendentData(response?.data?.products);
  };

  useEffect(() => {
    fetchPendentData();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    <>
      <div className="w-[87%] mx-auto py-10">
        {/* header */}
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl md:text-[21px] font-medium section-title">
            Chain Pendant
          </h2>
          <button className="relative flex items-center gap-2 text-[#b87a2c] font-medium text-sm cursor-pointer" onClick={() => navigate("/category/chain-pendant")}>
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
                ? { prevEl: ".chain-prev", nextEl: ".chain-next" }
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
            {pendentData.map((product, index) => (
              <SwiperSlide key={index}>
               <Card product={product} />
              </SwiperSlide>
            ))}

            {/* Conditional Arrows */}
            {isDesktop && showArrows && canSlidePrev && (
              <div className="chain-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer">
                <Leftarrow />
              </div>
            )}
            {isDesktop && showArrows && canSlideNext && (
              <div className="chain-next absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer">
                <Rightarrow />
              </div>
            )}
          </Swiper>
        </div>

        {/* Marquee styles */}
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

      {/* Video Section */}
      <div className="w-full h-[200px] sm:h-[300px] md:h-[600px]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://pub-fcbdfa5d08884a7fb45a0457f296badb.r2.dev/video/b/1713940466054.mp4" type="video/mp4" />
        </video>
      </div>
    </>
  );
}

export default Chainpendent;
