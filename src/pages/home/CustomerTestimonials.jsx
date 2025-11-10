import React, { useState, useEffect, useRef } from "react";
import StarRating from "../../assets/icons/startRating";
import logo from "../../assets/images/testimonial.jpg";
import { useDispatch, useSelector } from "react-redux";
import { fetchTestimonialsData } from "../../redux/slices/testimonials";

const CustomerTestimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState(1);
  const sliderRef = useRef(null);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchTestimonialsData());
  }, [dispatch]);

  const testimonialsData = useSelector((state) => state.testimonials.testimonials);
  
  // Extract testimonials from API response
  // Filter only featured testimonials and map to required format
  const testimonials = testimonialsData
    ? testimonialsData
        .filter(item => item.featured)
        .map(item => ({
          id: item._id,
          text: item.testimonialText,
          name: item.name,
          rating: item.rating,
        }))
    : [];

  // Get visible slides based on screen size
  const getVisibleSlides = () => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };

  useEffect(() => {
    const updateVisibleSlides = () => {
      const newVisibleSlides = getVisibleSlides();
      setVisibleSlides(newVisibleSlides);
      setCurrentSlide(0);
    };

    updateVisibleSlides();
    window.addEventListener('resize', updateVisibleSlides);
    return () => window.removeEventListener('resize', updateVisibleSlides);
  }, []);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    if (testimonials.length <= visibleSlides) return;
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (testimonials.length <= visibleSlides) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (testimonials.length <= visibleSlides || !touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const nextSlide = () => {
    if (testimonials.length <= visibleSlides) return;
    const maxSlide = testimonials.length - visibleSlides;
    setCurrentSlide((prev) => (prev >= maxSlide ? maxSlide : prev + 1));
  };

  const prevSlide = () => {
    if (testimonials.length <= visibleSlides) return;
    setCurrentSlide((prev) => (prev <= 0 ? 0 : prev - 1));
  };

  // Check if slider is needed (more testimonials than visible slides)
  const needsSlider = testimonials.length > visibleSlides;
  const maxSlide = testimonials.length - visibleSlides;

  // Show loading state if no testimonials yet
  if (!testimonials || testimonials.length === 0) {
    return (
      <section
        className="relative py-10 bg-cover bg-center mb-10 z-2"
        style={{ backgroundImage: `url(${logo})` }}
      >
        <div className="max-w-[90%] mx-auto relative z-10">
          <h2 className="text-2xl md:text-3xl font-medium text-center mb-8 text-gray-800">
            Customer Testimonials
            <div className="w-16 h-0.5 bg-[#b4853e] mx-auto mt-2"></div>
          </h2>
          <div className="text-center text-gray-600">Loading testimonials...</div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative py-10 bg-cover bg-center mb-10 z-2"
      style={{ backgroundImage: `url(${logo})` }}
    >
      <div className="max-w-[90%] mx-auto relative z-10">
        {/* Section Header */}
        <h2 className="text-2xl md:text-3xl font-medium text-center mb-8 text-gray-800">
          Customer Testimonials
          <div className="w-16 h-0.5 bg-[#b4853e] mx-auto mt-2"></div>
        </h2>

        {/* Testimonials Container */}
        <div className="relative overflow-hidden">
          
          {/* Slider/Grid */}
          <div
            ref={sliderRef}
            className={`flex ${needsSlider ? 'transition-transform duration-500 ease-in-out' : 'items-stretch'}`}
            style={needsSlider ? {
              transform: `translateX(-${(currentSlide * 100) / visibleSlides}%)`,
            } : {}}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`flex-shrink-0 px-2.5 flex ${
                  visibleSlides === 1 ? 'w-full' :
                  visibleSlides === 2 ? 'w-1/2' : 'w-1/3'
                }`}
              >
                <div className="bg-white backdrop-blur-sm rounded-lg p-6 md:p-7 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full w-full">
                  {/* Testimonial Text */}
                  <div className="flex-grow mb-6">
                    <p 
                      style={{wordSpacing:"3px"}} 
                      className="text-gray-700 text-sm md:text-[13px] leading-relaxed text-justify font-medium"
                    >
                      "{testimonial.text}"
                    </p>
                  </div>

                  {/* Bottom section → Stars + Name */}
                  <div className="flex flex-col items-center mt-auto border-t border-gray-200 pt-5">
                    {/* Star Rating */}
                    <div className="mb-3">
                      <StarRating
                        rating={testimonial.rating}
                        size={16}
                      />
                    </div>

                    {/* Customer Name */}
                    <p 
                      style={{wordSpacing:"3px"}} 
                      className="text-gray-800 font-medium text-sm md:text-base text-center"
                    >
                      {testimonial.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows - Only show when slider is needed */}
          {needsSlider && (
            <>
              {/* Left Arrow - Only show if not on first slide */}
              {currentSlide > 0 && (
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 flex items-center justify-center group z-10"
                  aria-label="Previous testimonial"
                >
                  <svg 
                    className="w-5 h-5 text-gray-600 group-hover:text-[#b4853e] transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Right Arrow - Only show if not on last slide */}
              {currentSlide < maxSlide && (
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 flex items-center justify-center group z-10"
                  aria-label="Next testimonial"
                >
                  <svg 
                    className="w-5 h-5 text-gray-600 group-hover:text-[#b4853e] transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </>
          )}
          
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;