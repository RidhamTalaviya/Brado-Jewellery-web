

import React, { useState, useEffect, useRef } from "react";
import StarRating from "../../assets/icons/startRating";
import logo from "../../assets/images/testimonial.jpg";

const CustomerTestimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState(1);
  const sliderRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      text: "I love the look of real jewellery, but I can't afford it. Imitation jewellery is a great way to get the look of real jewellery without breaking the bank. I've been wearing imitation jewellery for years, and I've never had anyone tell me that it's not real.",
      name: "Priya Sharma",
      rating: 5,
    },
    {
      id: 2,
      text: "I'm always on the lookout for new and interesting jewellery. I recently came across Brado Jewellery website, and I was really impressed with their selection of imitation jewellery. They have a wide variety of styles to choose from, and the prices are very reasonable.",
      name: "Nidhi Patel",
      rating: 5,
    },
    {
      id: 3,
      text: "I'm always on the lookout for unique and affordable jewellery, and I was so happy to find your shop. I love the selection of imitation jewellery you have, and I've already purchased several pieces. The quality is excellent, and the prices are very reasonable. I would definitely recommend your shop to anyone looking for beautiful and affordable jewellery.",
      name: "Keyur Mishra",
      rating: 5,
    },
  ];

  // Get visible slides based on screen size
  const getVisibleSlides = () => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth >= 1024) return 3; // lg and up - show 3 (no slider)
    if (window.innerWidth >= 768) return 2;  // md - show 2 (slider)
    return 1; // sm and below - show 1 (slider)
  };

  useEffect(() => {
    const updateVisibleSlides = () => {
      setVisibleSlides(getVisibleSlides());
      setCurrentSlide(0); // Reset to first slide when screen size changes
    };

    updateVisibleSlides();
    window.addEventListener('resize', updateVisibleSlides);
    return () => window.removeEventListener('resize', updateVisibleSlides);
  }, []);

  // Touch handlers for mobile swipe (only when slider is needed)
  const handleTouchStart = (e) => {
    if (visibleSlides >= 3) return; // No touch for desktop
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (visibleSlides >= 3) return; // No touch for desktop
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (visibleSlides >= 3 || !touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  const nextSlide = () => {
    if (visibleSlides >= 3) return; // No sliding for desktop
    const maxSlide = testimonials.length - visibleSlides;
    setCurrentSlide((prev) => (prev >= maxSlide ? prev : prev + 1));
  };

  const prevSlide = () => {
    if (visibleSlides >= 3) return; // No sliding for desktop
    setCurrentSlide((prev) => (prev <= 0 ? prev : prev - 1));
  };

  // Check if slider is needed
  const needsSlider = visibleSlides < 3;

  return (
    <section
      className="relative py-10 bg-cover bg-center mb-10"
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
                <div className="bg-white backdrop-blur-sm rounded-lg p-6 md:p-7 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full mx-auto">
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 flex items-center justify-center group"
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

              {currentSlide < testimonials.length - visibleSlides && (
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 flex items-center justify-center group"
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