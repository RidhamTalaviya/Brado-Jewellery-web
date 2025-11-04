import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
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

/* ──────────────────────── DEBOUNCE ──────────────────────── */
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

/* ──────────────────────── PAGINATION ──────────────────────── */
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
      const pages = [];
      const showEllipsisStart = currentPage > 3;
      const showEllipsisEnd = currentPage < totalPages - 2;

      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        if (showEllipsisStart) pages.push('...');
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (showEllipsisEnd) pages.push('...');
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

/* ──────────────────────── MAIN COMPONENT ──────────────────────── */
const Category = () => {
  const dispatch = useDispatch();
  const { categoryName } = useParams();
  const navigate = useNavigate();

  // ───── STATE ─────
  const [page, setPage] = useState(1);
  const limit = 10;
  const [selectedFilters, setSelectedFilters] = useState({});
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 0]);
  const debouncedPriceRange = useDebounce(selectedPriceRange, 500);
  const [sortBy, setSortBy] = useState('Latest');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(null);
  const [isPriceInitialized, setIsPriceInitialized] = useState(false);

  // ───── REDUX ─────
  const productData = useSelector((state) => state?.product?.allProductData);
  const products = productData?.products || [];
  const total = productData?.total || 0;
  const availableFilters = productData?.availableFilters || [];
  const apiPriceRange = productData?.priceRange;
  const collectionsById = useSelector((state) => state?.collections?.collectionsById);
  const loading = useSelector((state) => state?.product?.loading);

  // ───── REFS ─────
  const swiperRef = useRef(null);
  const sliderRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const hasFetchedRef = useRef('');               // <-- NEW guard
  const currentCategoryRef = useRef(null);

  const sortOptions = ['Latest', 'Price Low To High', 'Price High To Low', 'Discount'];

  /* ───── CATEGORY CHANGE RESET ───── */
  useEffect(() => {
    if (currentCategoryRef.current !== categoryName) {
      currentCategoryRef.current = categoryName;
      hasFetchedRef.current = '';
      setSelectedFilters({});
      setPage(1);
      setSortBy('Latest');
      setIsPriceInitialized(false);
      setPriceRange({ min: 0, max: 0 });
      setSelectedPriceRange([0, 0]);
      if (categoryName) dispatch(fetchCollectionsDataById(categoryName));
    }
  }, [categoryName, dispatch]);

  /* ───── PRICE INITIALISATION ───── */
  useEffect(() => {
    if (apiPriceRange && apiPriceRange.max > 0 && !isPriceInitialized) {
      setPriceRange(apiPriceRange);
      setSelectedPriceRange([apiPriceRange.min, apiPriceRange.max]);
      setIsPriceInitialized(true);
    }
  }, [apiPriceRange, isPriceInitialized]);

  /* ───── MEMOISED FILTER PARAMS ───── */
  const filterParams = useMemo(() => {
    const params = {
      category: categoryName,
      page,
      limit,
      sortBy,
    };

    if (isPriceInitialized && priceRange.max > 0) {
      const [selMin, selMax] = debouncedPriceRange;
      if (selMin !== priceRange.min || selMax !== priceRange.max) {
        params.minPrice = selMin;
        params.maxPrice = selMax;
      }
    }

    Object.entries(selectedFilters).forEach(([key, vals]) => {
      if (Array.isArray(vals) && vals.length) {
        params[key] = vals.join(',');
      }
    });

    return params;
  }, [
    categoryName,
    page,
    limit,
    sortBy,
    debouncedPriceRange,
    isPriceInitialized,
    priceRange.min,
    priceRange.max,
    JSON.stringify(
      Object.entries(selectedFilters)
        .filter(([, v]) => Array.isArray(v) && v.length)
        .map(([k, v]) => [k, [...v].sort()])
    ),
  ]);

  /* ───── SINGLE API CALL ───── */
  useEffect(() => {
    if (!categoryName) return;

    const key = `${categoryName}-${JSON.stringify(filterParams)}`;
    if (hasFetchedRef.current === key) return;   // already called with this exact payload
    hasFetchedRef.current = key;

    dispatch(allProductData(filterParams));
  }, [categoryName, filterParams, dispatch]);

  const totalPages = Math.ceil(total / limit);

  /* ───── FILTER HANDLERS ───── */
  const handleFilterChange = useCallback((filterName, optionName) => {
    setSelectedFilters((prev) => {
      const cur = prev[filterName] || [];
      const exists = cur.includes(optionName);
      return {
        ...prev,
        [filterName]: exists ? cur.filter(o => o !== optionName) : [...cur, optionName],
      };
    });
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedFilters({});
    if (isPriceInitialized && priceRange.max > 0) {
      setSelectedPriceRange([priceRange.min, priceRange.max]);
    }
    setSortBy('Latest');
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [isPriceInitialized, priceRange.min, priceRange.max]);

  /* ───── PRICE SLIDER ───── */
  const getPercentage = useCallback((value) => {
    if (priceRange.max === priceRange.min) return 0;
    return ((value - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
  }, [priceRange.min, priceRange.max]);

  const handleMouseDown = useCallback((idx) => (e) => {
    e.preventDefault();
    setIsDragging(idx);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging === null || !sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const pct = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width), 1);
      const newVal = Math.round(priceRange.min + pct * (priceRange.max - priceRange.min));

      setSelectedPriceRange((prev) => {
        const next = [...prev];
        next[isDragging] = newVal;
        if (isDragging === 0 && newVal > prev[1]) next[1] = newVal;
        if (isDragging === 1 && newVal < prev[0]) next[0] = newVal;
        return next;
      });
    },
    [isDragging, priceRange.min, priceRange.max]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging !== null) {
      setIsDragging(null);
      setPage(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isDragging]);

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

  /* ───── PAGINATION / SORT / SWIPER ───── */
  const handlePageChange = useCallback((p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSortChange = useCallback((opt) => {
    setSortBy(opt);
    setIsDropdownOpen(false);
    setIsSortOpen(false);
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSlideChange = useCallback((swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  }, []);

  const activeFiltersCount = useMemo(() => {
    return Object.values(selectedFilters).reduce((s, a) => s + a.length, 0);
  }, [selectedFilters]);

  /* ───── FILTER CONTENT COMPONENT ───── */
  const FilterContent = ({ isMobile = false }) => (
    <div className={isMobile ? "p-6" : ""}>
      {/* PRICE */}
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
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="absolute w-2.5 h-5 bg-white border border-amber-600 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 shadow-md hover:shadow-lg transition-shadow"
                    style={{
                      left: `${getPercentage(selectedPriceRange[i])}%`,
                      top: "50%",
                    }}
                    onMouseDown={handleMouseDown(i)}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-3">
                <span className="text-sm font-medium text-gray-700">
                  ₹{selectedPriceRange[0].toLocaleString()}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  ₹{selectedPriceRange[1].toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC FILTERS */}
      {availableFilters.map((filter) => (
        <div key={filter.filterId} className="mb-8">
          <h3 className="text-base font-medium text-gray-900 mb-4">
            {filter.filterName}
            {selectedFilters[filter.filterName]?.length > 0 && (
              <span className="ml-2 text-xs text-amber-600">
                ({selectedFilters[filter.filterName].length})
              </span>
            )}
          </h3>
          <div className="space-y-3">
            {filter.options.map((opt) => (
              <label key={opt.optionId} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={(selectedFilters[filter.filterName] || []).includes(opt.optionName)}
                  onChange={() => handleFilterChange(filter.filterName, opt.optionName)}
                  className="mr-2 accent-amber-600"
                />
                <span className="text-sm text-gray-700">{opt.optionName}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* CLEAR ALL */}
      {(activeFiltersCount > 0 ||
        (isPriceInitialized &&
          (selectedPriceRange[0] !== priceRange.min ||
            selectedPriceRange[1] !== priceRange.max))) && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={clearAllFilters}
            className="w-full px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );

  /* ───── RENDER ───── */
  return (
    <>
      {/* BANNER */}
      {collectionsById?.bannerImage?.length > 0 && (
        <div className="flex justify-center mb-6">
          <img
            src={collectionsById.bannerImage[0]?.image}
            alt="Category banner"
            className="rounded-lg shadow-md max-h-96 object-contain"
          />
        </div>
      )}

      {/* SLIDER */}
      {collectionsById?.sliderImage?.length > 0 && (
        <div className="w-[91%] relative mx-auto mt-8">
          <Swiper
            modules={[Navigation]}
            onSwiper={(s) => (swiperRef.current = s)}
            onSlideChange={handleSlideChange}
            onInit={handleSlideChange}
            spaceBetween={20}
            slidesPerView={2}
            breakpoints={{
              480: { slidesPerView: 1.3 },
              640: { slidesPerView: 2.35 },
            }}
          >
            {collectionsById.sliderImage.map((s, i) => (
              <SwiperSlide key={s._id || i}>
                <img
                  src={s.image}
                  alt={`Slide ${i + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {!isBeginning && (
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/70 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
            >
              <ChevronDown className="w-5 h-5 rotate-90" />
            </button>
          )}
          {!isEnd && (
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/70 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
            >
              <ChevronDown className="w-5 h-5 -rotate-90" />
            </button>
          )}
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="w-[91%] max-w-6xl mx-auto flex gap-4 pt-10 pb-0 lg:py-10">
        {/* DESKTOP SIDEBAR */}
        <aside className="w-52 bg-white border-r border-gray-200 p-6 pt-0 pl-0 sticky top-10 h-screen overflow-y-auto hidden lg:block">
          <div className="mb-4 sticky top-0 bg-white z-10 pt-4">
            <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
            <div className="w-full h-px bg-gray-200 mt-3" />
          </div>
          <FilterContent />
        </aside>

        {/* PRODUCTS AREA */}
        <section className="w-full lg:w-[90%]">
          {/* DESKTOP HEADER */}
          <div className="hidden lg:flex justify-between items-center mb-6 py-4 bg-white">
            <h1 className="text-2xl font-medium text-gray-900">
              {collectionsById?.categoryName ||
                categoryName?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </h1>

            <div className="flex items-center space-x-3 border border-gray-200 rounded-md px-2">
              <span className="text-sm text-gray-600 font-medium">Sort by:</span>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen((v) => !v)}
                  className="flex items-center justify-between min-w-[100px] px-2 py-2 text-sm font-medium text-gray-900 bg-white rounded-md hover:bg-gray-50"
                >
                  <span>{sortBy}</span>
                  <ChevronDown
                    className={`ml-2 h-4 w-4 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border z-50">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSortChange(opt)}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                          sortBy === opt ? "bg-gray-50 font-medium" : ""
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* MOBILE HEADER */}
          <div className="lg:hidden mb-4 flex justify-between items-center px-4">
            <h1 className="text-xl font-medium text-gray-900">
              {collectionsById?.categoryName ||
                categoryName?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border rounded-md"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filter</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-amber-600 text-white text-xs px-1.5 rounded-full">
                    {activeFiltersCount}
                  </span>
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

          {/* LOADING */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
            </div>
          )}

          {/* NO PRODUCTS */}
          {!loading && products.length === 0 && (
            <div className="text-center py-12 flex flex-col items-center">
              <img src={cardlogo} alt="" />
              <p className="text-gray-900 text-lg">No products found</p>
              <p className="text-gray-400 text-sm mt-2">
                No products found for your search. Please try another search!
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 px-6 py-2 text-sm font-medium text-white bg-[#b4853e] rounded-md hover:bg-[#b4853e]/80"
              >
                Continue Shopping
              </button>
              {(activeFiltersCount > 0 ||
                (isPriceInitialized &&
                  (selectedPriceRange[0] !== priceRange.min ||
                    selectedPriceRange[1] !== priceRange.max))) && (
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-6 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}

          {/* PRODUCTS GRID */}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 px-4 lg:px-0">
              {products.map((p) => (
                <div
                  key={p._id}
                  onClick={() => navigate(`/showproduct/${p.slug}`)}
                  className="cursor-pointer"
                >
                  <Card product={p} />
                </div>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {!loading && totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </section>
      </div>

      {/* MOBILE FILTER MODAL */}
      {isFilterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setIsFilterOpen(false)}
          />
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
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full bg-black text-white py-3 rounded-md font-medium"
              >
                Show {total} Results
              </button>
            </div>
          </div>
        </>
      )}

      {/* MOBILE SORT MODAL */}
      {isSortOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setIsSortOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-lg shadow-lg z-50 lg:hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-lg font-semibold">Sort By</h2>
              <button onClick={() => setIsSortOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {sortOptions.map((opt) => (
                <label key={opt} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={sortBy === opt}
                    onChange={() => handleSortChange(opt)}
                    className="mr-3 accent-amber-600"
                  />
                  <span className={sortBy === opt ? "font-medium text-amber-600" : ""}>
                    {opt}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {/* DROPDOWN BACKDROP */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </>
  );
};

export default Category;