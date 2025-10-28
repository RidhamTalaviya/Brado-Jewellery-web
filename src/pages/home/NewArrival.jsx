import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Cart from '../../assets/icons/Cart'

import ArrowRightIcon from '../../assets/icons/ArrowRightIcon'
import HeartIcon from '../../assets/icons/HeartIcon'
import Leftarrow from '../../assets/icons/Leftarrow'
import Rightarrow from '../../assets/icons/Rightarrow'
import { newarrival } from "../../constant/constant";

function Newarrival() {
    const [canSlidePrev, setCanSlidePrev] = useState(false);
    const [canSlideNext, setCanSlideNext] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const swiperRef = useRef(null);

    // Detect screen size
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640); // mobile < 640px
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const updateArrows = (swiper) => {
        if (swiper) {
            setCanSlidePrev(!swiper.isBeginning);
            setCanSlideNext(!swiper.isEnd);
        }
    };

    const handleSwiperInit = (swiper) => {
        swiperRef.current = swiper;
        updateArrows(swiper);
    };

    const handleSlideChange = (swiper) => {
        updateArrows(swiper);
    };

    const goToPrev = () => {
        if (swiperRef.current) {
            swiperRef.current.slidePrev();
        }
    };

    const goToNext = () => {
        if (swiperRef.current) {
            swiperRef.current.slideNext();
        }
    };

    return (
        <div className="w-[87%] mx-auto py-8">
            {/* Heading */}
            <div className="flex justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl md:text-[21px] font-medium section-title mb-8">
                        New Arrival
                    </h2>
                </div>

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
                    onSwiper={handleSwiperInit}
                    onSlideChange={handleSlideChange}
                    onReachBeginning={() => setCanSlidePrev(false)}
                    onReachEnd={() => setCanSlideNext(false)}
                    onFromEdge={() => {
                        // This fires when leaving the beginning or end
                        if (swiperRef.current) {
                            updateArrows(swiperRef.current);
                        }
                    }}
                    spaceBetween={16}
                    breakpoints={{
                        320: { slidesPerView: 1.5 },
                        480: { slidesPerView: 2.5 },
                        640: { slidesPerView: 3.2 },
                        768: { slidesPerView: 4 },
                        1024: { slidesPerView: 5 },
                    }}
                >
                    {/* Left Arrow - only show on non-mobile screens and when can slide prev */}
                    {!isMobile && canSlidePrev && (
                        <div 
                            className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
                            onClick={goToPrev}
                        >
                            <Leftarrow />
                        </div>
                    )}
                    
                    {/* Right Arrow - only show on non-mobile screens and when can slide next */}
                    {!isMobile && canSlideNext && (
                        <div 
                            className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
                            onClick={goToNext}
                        >
                            <Rightarrow />
                        </div>
                    )}

                    {newarrival.map((product, index) => (
                        <SwiperSlide key={index}>
                            <div className="bg-white rounded-lg overflow-hidden relative group hover:transition duration-300">
                                {/* Product Image Wrapper */}
                                <div className="relative">
                                    <img
                                        src={product.img}
                                        alt={product.title}
                                        className="w-full h-64 md:h-80 object-cover transition-transform duration-300"
                                    />

                                    {/* Heart Icon */}
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button className="bg-white rounded-full p-2 shadow hover:scale-110 transition">
                                            <HeartIcon className="w-5 h-5 text-gray-600" />
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
                                        <span className="text-sm md:text-base font-semibold">₹{product.price}</span>
                                        <span className="text-xs line-through text-gray-400">₹{product.original}</span>
                                        <span className="text-xs md:text-sm text-orange-600">
                                            ({product.discount}% OFF)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}

export default Newarrival;