import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

import Cart from "../../assets/icons/Cart";
import Heart from "../../assets/icons/HeartIcon";
import Leftarrow from "../../assets/icons/Leftarrow";
import Rightarrow from "../../assets/icons/Rightarrow";
import ArrowRightIcon from "../../assets/icons/ArrowRightIcon";

import { sareepin } from "../../constant/constant";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/AxiosInterceptor";
import Card from "../../components/common/Card";

function Sareepin() {
  const swiperRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [canSlidePrev, setCanSlidePrev] = useState(false);
  const [canSlideNext, setCanSlideNext] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
    const navigate = useNavigate();
   const [sareepinData, setSareepinData] = useState([]);
  const fetchSareepinData = async () => {
    const response = await axiosInstance("/product/get?category=saree-pin");
    console.log(response , "riya bava");
    setSareepinData(response?.data?.products);
  };

  useEffect(() => {
    fetchSareepinData();
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
    <div className="w-[87%] mx-auto py-10">
      {/* Heading */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-[21px] font-medium section-title">Saree Pin</h2>
        <button className="relative flex items-center gap-2 text-[#b87a2c] font-medium text-sm cursor-pointer" onClick={() => navigate("/category/saree-pin")}>
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
              ? { prevEl: ".sareepin-prev", nextEl: ".sareepin-next" }
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
          {sareepinData.map((product, index) => (
            <SwiperSlide key={index}>
            <Card product={product}/>
            </SwiperSlide>
          ))}

          {/* Conditional Arrows */}
          {isDesktop && showArrows && canSlidePrev && (
            <div className="sareepin-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer">
              <Leftarrow />
            </div>
          )}
          {isDesktop && showArrows && canSlideNext && (
            <div className="sareepin-next absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer">
              <Rightarrow />
            </div>
          )}
        </Swiper>
      </div>
    </div>
  );
}

export default Sareepin;
