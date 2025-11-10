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
import { useDispatch, useSelector } from "react-redux";
import { fetchNecklacesetData } from "../../redux/slices/product/Necklaceset";
import Card from "../../components/common/Card";

function Newarrival() {
    const [canSlidePrev, setCanSlidePrev] = useState(false);
    const [canSlideNext, setCanSlideNext] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const swiperRef = useRef(null);

      const dispatch = useDispatch();

  const newarrival = useSelector((state) => state?.necklaceset?.necklaceset?.products);

  useEffect(() => {
    dispatch(fetchNecklacesetData());
  }, [dispatch]);

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

                    {newarrival?.map((product, index) => (
                        <SwiperSlide key={index}>
                            <Card product={product} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}

export default Newarrival;