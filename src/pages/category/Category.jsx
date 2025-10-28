import React, { useRef, useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "swiper/modules";
import { Filter, SlidersHorizontal, X, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { allProductData } from "../../redux/slices/product/productSlice";
import { fetchCollectionsDataById } from "../../redux/slices/collections";
import cardlogo from "../../assets/images/product.png";
import Card from "../../components/common/Card";
import "swiper/css";
import "swiper/css/navigation";

// Custom Debounce Hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (showEllipsisStart) {
        pages.push('...');
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (showEllipsisEnd) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-12 h-12 rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:border-gray-400"
        style={{ borderColor: '#D1D5DB', backgroundColor: '#FFFFFF' }}
      >
        <ChevronLeft className="w-5 h-5" style={{ color: '#6B7280' }} />
      </button>
      {pageNumbers.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <div className="flex items-center justify-center w-12 h-12 text-gray-500">...</div>
          ) : (
            <button
              onClick={() => onPageChange(page)}
              className={`flex items-center justify-center w-12 h-12 rounded-lg border transition-all font-medium ${
                currentPage === page ? 'text-white shadow-md' : 'hover:border-gray-400'
              }`}
              style={{
                borderColor: currentPage === page ? '#b4853e' : '#D1D5DB',
                backgroundColor: currentPage === page ? '#b4853e' : '#FFFFFF',
                color: currentPage === page ? '#FFFFFF' : '#374151',
              }}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-12 h-12 rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:border-gray-400"
        style={{ borderColor: '#D1D5DB', backgroundColor: '#FFFFFF' }}
      >
        <ChevronRight className="w-5 h-5" style={{ color: '#6B7280' }} />
      </button>
    </div>
  );
};

const Category = () => {
  const dispatch = useDispatch();
  const { categoryName } = useParams();
  const navigate = useNavigate();

  // States
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 0]);
  const debouncedPriceRange = useDebounce(selectedPriceRange, 500); // Debounce price range
  const [sortBy, setSortBy] = useState('Latest');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(null);
  const [isPriceInitialized, setIsPriceInitialized] = useState(false);

  // Redux selectors
  const productData = useSelector((state) => state?.product?.allProductData);
  const products = productData?.products || [];
  const total = productData?.total || 0;
  const availableFilters = productData?.availableFilters || [];
  const apiPriceRange = productData?.priceRange;
  const collectionsById = useSelector((state) => state?.collections?.collectionsById);
  console.log(productData, "collectionsById");
  const loading = useSelector((state) => state?.product?.loading);

  // Refs
  const swiperRef = useRef(null);
  const sliderRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const sortOptions = ['Latest', 'Price Low To High', 'Price High To Low', 'Discount'];

  // Initialize price range from API ONCE
  useEffect(() => {
    if (apiPriceRange && !isPriceInitialized) {
      console.log('Initializing price range:', apiPriceRange);
      setPriceRange(apiPriceRange);
      setSelectedPriceRange([apiPriceRange.min, apiPriceRange.max]);
      setIsPriceInitialized(true);
    }
  }, [apiPriceRange, isPriceInitialized]);

  // Fetch collections
  useEffect(() => {
    dispatch(fetchCollectionsDataById(categoryName));
  }, [dispatch, categoryName]);

  // Reset states when category changes
  useEffect(() => {
    setSelectedFilters({});
    setPage(1);
    setSortBy('Latest');
    setIsPriceInitialized(false);
  }, [categoryName]);

  // Fetch products with debounced price range
  useEffect(() => {
    const filterParams = {
      category: categoryName,
      page,
      limit,
      sortBy,
    };

    if (isPriceInitialized && (debouncedPriceRange[0] !== priceRange.min || debouncedPriceRange[1] !== priceRange.max)) {
      filterParams.minPrice = debouncedPriceRange[0];
      filterParams.maxPrice = debouncedPriceRange[1];
    }

    Object.keys(selectedFilters).forEach((filterName) => {
      if (selectedFilters[filterName].length > 0) {
        filterParams[filterName] = selectedFilters[filterName].join(',');
      }
    });

    console.log('🔍 Fetching products with params:', filterParams);
    dispatch(allProductData(filterParams));
  }, [dispatch, categoryName, page, limit, selectedFilters, debouncedPriceRange, sortBy, isPriceInitialized, priceRange.min, priceRange.max]);

  // Calculate total pages
  const totalPages = Math.ceil(total / limit);

  // Filter handlers
  const handleFilterChange = (filterName, optionName) => {
    setSelectedFilters((prev) => {
      const currentOptions = prev[filterName] || [];
      const isSelected = currentOptions.includes(optionName);
      const newFilters = {
        ...prev,
        [filterName]: isSelected ? currentOptions.filter((opt) => opt !== optionName) : [...currentOptions, optionName],
      };
      console.log('Filter changed:', filterName, optionName, newFilters);
      return newFilters;
    });
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
  };

  const clearAllFilters = () => {
    console.log('Clearing all filters');
    setSelectedFilters({});
    if (isPriceInitialized) {
      setSelectedPriceRange([priceRange.min, priceRange.max]);
    }
    setSortBy('Latest');
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
  };

  // Price range handlers
  const getPercentage = (value) => {
    if (priceRange.max === priceRange.min) return 0;
    return ((value - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
  };

  const handleMouseDown = (index) => (e) => {
    e.preventDefault();
    setIsDragging(index);
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging === null || !sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width), 1);
      const newValue = Math.round(priceRange.min + percentage * (priceRange.max - priceRange.min));

      setSelectedPriceRange((prev) => {
        const newRange = [...prev];
        newRange[isDragging] = newValue;
        if (isDragging === 0 && newValue > prev[1]) {
          newRange[1] = newValue;
        } else if (isDragging === 1 && newValue < prev[0]) {
          newRange[0] = newValue;
        }
        return newRange;
      });
    },
    [isDragging, priceRange.min, priceRange.max]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging !== null) {
      console.log('Price range changed:', selectedPriceRange);
      setIsDragging(null);
      setPage(1);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
    }
  }, [isDragging, selectedPriceRange]);

  useEffect(() => {
    if (isDragging !== null) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Pagination handlers
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sort handlers
  const handleSortChange = (option) => {
    console.log('Sort changed to:', option);
    setSortBy(option);
    setIsDropdownOpen(false);
    setIsSortOpen(false);
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
  };

  // Swiper handlers
  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  // Count active filters
  const activeFiltersCount = Object.values(selectedFilters).reduce((sum, options) => sum + options.length, 0);

  // Debug log
  useEffect(() => {
    console.log('📊 Component state:', {
      products: products.length,
      total,
      availableFilters: availableFilters.length,
      selectedFilters,
      priceRange,
      selectedPriceRange,
      isPriceInitialized,
      loading,
    });
  }, [products, total, availableFilters, selectedFilters, priceRange, selectedPriceRange, isPriceInitialized, loading]);

  // Filter Content Component
  const FilterContent = ({ isMobile = false }) => (
    <div className={isMobile ? "p-6" : ""}>
      {/* Price Filter */}
      {isPriceInitialized && priceRange.max > 0 && (
        <div className="mb-8">
          <h3 className="text-base font-medium text-gray-900 mb-4">Price</h3>
          <div className="py-2">
            <div ref={sliderRef} className="relative px-2">
              <div className="relative h-2 bg-gray-200 rounded-lg cursor-pointer">
                <div
                  className="absolute h-2 bg-amber-600 rounded-lg"
                  style={{
                    left: `${getPercentage(selectedPriceRange[0])}%`,
                    right: `${100 - getPercentage(selectedPriceRange[1])}%`,
                  }}
                />
                <div
                  className="absolute w-2.5 h-5 bg-white border border-amber-600 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 shadow-md hover:shadow-lg transition-shadow"
                  style={{
                    left: `${getPercentage(selectedPriceRange[0])}%`,
                    top: "50%",
                  }}
                  onMouseDown={handleMouseDown(0)}
                />
                <div
                  className="absolute w-2.5 h-5 bg-white border border-amber-600 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 shadow-md hover:shadow-lg transition-shadow"
                  style={{
                    left: `${getPercentage(selectedPriceRange[1])}%`,
                    top: "50%",
                  }}
                  onMouseDown={handleMouseDown(1)}
                />
              </div>
              <div className="flex justify-between mt-3">
                <span className="text-sm font-medium text-gray-700">₹{selectedPriceRange[0].toLocaleString()}</span>
                <span className="text-sm font-medium text-gray-700">₹{selectedPriceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Filters */}
      {availableFilters.map((filter) => (
        <div key={filter.filterId} className="mb-8">
          <h3 className="text-base font-medium text-gray-900 mb-4">
            {filter.filterName}
            {selectedFilters[filter.filterName]?.length > 0 && (
              <span className="ml-2 text-xs text-amber-600">({selectedFilters[filter.filterName].length})</span>
            )}
          </h3>
          <div className="space-y-3">
            {filter.options.map((option) => (
              <label key={option.optionId} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={(selectedFilters[filter.filterName] || []).includes(option.optionName)}
                  onChange={() => handleFilterChange(filter.filterName, option.optionName)}
                  className="mr-2 accent-amber-600"
                />
                <span className="text-sm text-gray-700">{option.optionName}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Clear Filters Button */}
      {(activeFiltersCount > 0 || (isPriceInitialized && (selectedPriceRange[0] !== priceRange.min || selectedPriceRange[1] !== priceRange.max))) && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={clearAllFilters}
            className="w-full px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Active Filters:</h4>
          <div className="space-y-1 text-xs text-gray-600">
            {Object.entries(selectedFilters).map(([filterName, options]) =>
              options.length > 0 ? (
                <div key={filterName}>
                  {filterName}: {options.join(', ')}
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Banner Image */}
      {collectionsById?.bannerImage?.length > 0 && (
        <div className="flex justify-center mb-6">
          <img
            src={collectionsById.bannerImage[0]?.image}
            alt="Category banner"
            className="rounded-lg shadow-md max-h-96 object-contain"
          />
        </div>
      )}

      {/* Slider */}
      {collectionsById?.sliderImage?.length > 0 && (
        <div className="w-[91%] relative mx-auto mt-8">
          <Swiper
            modules={[Navigation]}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={handleSlideChange}
            onInit={handleSlideChange}
            spaceBetween={20}
            slidesPerView={2}
            breakpoints={{
              480: { slidesPerView: 1.3 },
              640: { slidesPerView: 2.35 },
            }}
          >
            {collectionsById.sliderImage.map((slide, index) => (
              <SwiperSlide key={slide._id || index}>
                <img
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {!isBeginning && (
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/70 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
            >
              <ChevronDown className="w-5 h-5 rotate-90" />
            </button>
          )}

          {!isEnd && (
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/70 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
            >
              <ChevronDown className="w-5 h-5 -rotate-90" />
            </button>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="w-[91%] max-w-6xl mx-auto flex gap-4 pt-10 pb-0 lg:py-10">
        {/* Desktop Sidebar */}
        <div className="w-52 bg-white border-r border-gray-200 p-6 pt-0 pl-0 sticky top-10 h-screen overflow-y-auto hidden lg:block">
          <div className="mb-4 sticky top-0 bg-white z-10 pt-4">
            <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
            <div className="w-full h-px bg-gray-200 mt-3"></div>
          </div>
          <FilterContent />
        </div>

        {/* Products Section */}
        <div className="w-full lg:w-[90%]">
          {/* Desktop Header */}
          <div className="hidden lg:flex justify-between w-full items-center mb-6 py-4 bg-white">
            <h1 className="text-2xl font-medium text-gray-900">
              {collectionsById?.categoryName || categoryName?.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </h1>

            <div className="flex items-center space-x-3 border border-gray-200 rounded-md px-2">
              <span className="text-sm text-gray-600 font-medium">Sort by:</span>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between min-w-[100px] px-2 py-2 text-sm font-medium text-gray-900 bg-white rounded-md hover:bg-gray-50"
                >
                  <span>{sortBy}</span>
                  <ChevronDown
                    className={`ml-2 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md z-50 shadow-lg border">
                    {sortOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleSortChange(option)}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                          sortBy === option ? 'bg-gray-50 font-medium' : ''
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden mb-4 flex justify-between items-center px-4">
            <h1 className="text-xl font-medium text-gray-900">
              {collectionsById?.categoryName || categoryName?.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border rounded-md"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filter</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-amber-600 text-white text-xs px-1.5 rounded-full">{activeFiltersCount}</span>
                )}
              </button>
              <button
                onClick={() => setIsSortOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border rounded-md"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-sm">Sort</span>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          )}

          {/* Products Grid */}
          {!loading && products.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center">
              <img src={cardlogo} alt="" />
              <p className="text-gray-900 text-lg">No products found</p>
              <p className="text-gray-400 text-sm mt-2">No products found for your search. Please try another search!</p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 px-6 py-2 text-sm font-medium text-white bg-[#b4853e] rounded-md hover:bg-[#b4853e]/80"
              >
                Continue Shopping
              </button>
              {(activeFiltersCount > 0 || (isPriceInitialized && (selectedPriceRange[0] !== priceRange.min || selectedPriceRange[1] !== priceRange.max))) && (
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-6 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            !loading && (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 px-4 lg:px-0">
                {products.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/showproduct/${product.slug}`)}
                    className="cursor-pointer"
                  >
                    <Card product={product} />
                  </div>
                ))}
              </div>
            )
          )}

          {/* Custom Pagination */}
          {!loading && totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isFilterOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setIsFilterOpen(false)} />
          <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-lg z-50 lg:hidden overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterContent isMobile />
            <div className="p-6 border-t sticky bottom-0 bg-white">
              <button
                onClick={() => {
                  setIsFilterOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
                }}
                className="w-full bg-black text-white py-3 rounded-md font-medium"
              >
                Show {total} Results
              </button>
            </div>
          </div>
        </>
      )}

      {/* Mobile Sort Modal */}
      {isSortOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setIsSortOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-lg shadow-lg z-50 lg:hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-lg font-semibold">Sort By</h2>
              <button onClick={() => setIsSortOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {sortOptions.map((option) => (
                <label key={option} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={sortBy === option}
                    onChange={() => handleSortChange(option)}
                    className="mr-3 accent-amber-600"
                  />
                  <span className={sortBy === option ? 'font-medium text-amber-600' : ''}>{option}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Dropdown Backdrop */}
      {isDropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />}
    </>
  );
};

export default Category;