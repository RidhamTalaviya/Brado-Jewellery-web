// src/components/HeroSlider.js
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import 'swiper/css';
import 'swiper/css/navigation';
import { fetchCarouselData } from '../../redux/slices/carouselSlice';

// Custom Arrow Component
const CustomArrow = ({ direction, onClick, className }) => (
  <button
    onClick={onClick}
    className={`absolute top-1/2 -translate-y-1/2 z-10 ps-2 w-10 h-10 bg-white/80 cursor-pointer rounded-full shadow-lg ${className}`}
  >
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-[#000] ${direction === 'next' ? 'rotate-180' : ''}`}
    >
      <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

export default function HeroSlider() {
  const videoRef = useRef(null);
  const swiperRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoSlide, setIsVideoSlide] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024); // lg breakpoint

  const dispatch = useDispatch();
  const state = useSelector((state) => state.carousel);

  // Fetch carousel data on component mount
  useEffect(() => {
      dispatch(fetchCarouselData());
    }
  , [dispatch]);

  // Handle window resize to toggle between desktop and mobile images
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSlideChange = (swiper) => {
    const realIndex = swiper.realIndex;
    setCurrentSlide(realIndex);

    if (realIndex === 1) {
      // Video slide index
      setIsVideoSlide(true);
      swiper.autoplay.stop();
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    } else {
      setIsVideoSlide(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      swiper.autoplay.start();
    }
  };

  const handleVideoEnded = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
      swiperRef.current.autoplay.start();
    }
  };

  const goToPrevSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const goToNextSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  // Render loading or error states
  if (state.status === 'loading') {
    return <div>Loading...</div>;
  }

  if (state.status === 'failed') {
    return <div>Error: {state.error}</div>;
  }

  return (
    <div className="relative">
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className="w-full h-[220px] md:h-[320px] lg:h-[420px]"
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        modules={[Navigation, Autoplay]}
        navigation={false}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
      >
        {/* Map all slides from API data */}
        {state.slides && state.slides.length > 0 && state.slides.map((slide) => (
          <SwiperSlide key={slide._id || slide.slug}>
            <img
              src={isDesktop ? slide.desktopImage : slide.mobileImage}
              className="w-full h-full object-cover"
              alt={slide.slug || `Slide ${slide._id}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows */}
      <CustomArrow
        direction="prev"
        onClick={goToPrevSlide}
        className="left-4 hidden lg:block"
      />
      <CustomArrow
        direction="next"
        onClick={goToNextSlide}
        className="right-4 hidden lg:block"
      />
    </div>
  );
}