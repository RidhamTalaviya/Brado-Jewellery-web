import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import Cart from "../../assets/icons/Cart";
import SVGHaert from "../../assets/icons/HeartIcon";
import Leftarrow from "../../assets/icons/Leftarrow";
import Rightarrow from "../../assets/icons/Rightarrow";
import BadgePercent from "../../assets/icons/SettingsCogIcon";
import ArrowRightIcon from "../../assets/icons/ArrowRightIcon";

import img1 from "../../assets/images/MenBracelet/img1.jpeg";
import img2 from "../../assets/images/MenBracelet/img2.jpeg";
import img3 from "../../assets/images/MenBracelet/img3.jpeg";
import img4 from "../../assets/images/MenBracelet/img4.jpeg";
import img5 from "../../assets/images/MenBracelet/img5.jpeg";
import img6 from "../../assets/images/MenBracelet/img6.jpeg";
import img7 from "../../assets/images/MenBracelet/img7.jpeg";
import img8 from "../../assets/images/MenBracelet/img8.jpeg";
import img9 from "../../assets/images/MenBracelet/img9.jpeg";
import img10 from "../../assets/images/MenBracelet/img10.jpeg";

function Menbracelet() {
  const swiperRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [canSlidePrev, setCanSlidePrev] = useState(false);
  const [canSlideNext, setCanSlideNext] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

  const products = [
    { img: img1, title: "Stylish Leather Men's Bracelet", price: 349, original: 620, discount: 44 },
    { img: img2, title: "Classic Black Beaded Bracelet", price: 299, original: 540, discount: 45 },
    { img: img3, title: "Antique Silver Men's Bracelet", price: 329, original: 580, discount: 43 },
    { img: img4, title: "Trendy Rope Style Bracelet", price: 259, original: 480, discount: 46 },
    { img: img5, title: "Royal Gold-Plated Bracelet", price: 379, original: 640, discount: 41 },
    { img: img6, title: "Casual Daily Wear Bracelet", price: 289, original: 500, discount: 42 },
    { img: img7, title: "Elegant Chain Style Bracelet", price: 399, original: 680, discount: 41 },
    { img: img8, title: "Modern Dual Tone Bracelet", price: 359, original: 620, discount: 42 },
    { img: img9, title: "Designer Stone Studded Bracelet", price: 389, original: 660, discount: 41 },
    { img: img10, title: "Premium Party Wear Bracelet", price: 419, original: 700, discount: 40 },
  ];

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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-[21px] font-medium section-title">Men’s Bracelet</h2>
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
              ? { prevEl: ".menbracelet-prev", nextEl: ".menbracelet-next" }
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
          {products.map((product, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-lg overflow-hidden relative group hover:transition duration-300">
                <div className="relative">
                  <img
                    src={product.img}
                    alt={product.title}
                    className="w-full h-64 md:h-80 object-cover transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-black/40 rounded-full p-2 shadow hover:scale-110 transition">
                      <SVGHaert className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <div className="absolute left-0 right-0 bottom-0 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="w-full bg-white text-gray-800 px-4 py-2 text-sm rounded-none">
                      <div className="p-2 border border-gray-300 rounded-[1px] flex items-center justify-center gap-2">
                        <Cart className="w-4 h-4 text-gray-600" />
                        <span>Add To Cart</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-sm md:text-base font-medium line-clamp-2 truncate">{product.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm md:text-base font-semibold">₹{product.price}</span>
                    <span className="text-xs line-through text-gray-400">₹{product.original}</span>
                    <span className="text-xs md:text-sm text-orange-600">({product.discount}% OFF)</span>
                  </div>

                  <div className="w-full overflow-hidden bg-[#f7f2eb] rounded-md px-2 py-1 mt-2">
                    <div className="marquee flex animate-marquee">
                      {[...Array(2)].map((_, i) => (
                        <div className="marquee-content flex" key={i}>
                          {Array(6).fill(0).map((_, j) => (
                            <span key={j} className="flex items-center gap-2 mr-10 whitespace-nowrap">
                              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#b87a2c] text-white flex-shrink-0">
                                <BadgePercent size={12} strokeWidth={2} />
                              </span>
                              <span>Buy any 4 & Get @ ₹119</span>
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
            <div className="menbracelet-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer">
              <Leftarrow />
            </div>
          )}
          {isDesktop && showArrows && canSlideNext && (
            <div className="menbracelet-next absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer">
              <Rightarrow />
            </div>
          )}
        </Swiper>
      </div>

      {/* Marquee CSS */}
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

export default Menbracelet;
