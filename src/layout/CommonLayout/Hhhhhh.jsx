import React, { useState, useMemo } from 'react';
import ChevronDown from '../../assets/icons/ArrowDownIcon';
import { category } from "../../constant/constant";
import SVGHaert from "../../assets/icons/HeartIcon";
import Cart from "../../assets/icons/Cart";
import OfferBadge from './OfferBadge';
import StarRating from '../../assets/icons/startRating';
import CheckBadgeIcon from "../../assets/icons/CheckBadgeIcon";
import { useNavigate } from "react-router-dom";

const EarringsHeader = ({ categoryName, filters }) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('Latest');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sortOptions = [
    'Latest',
    'Price Low To High',
    'Price High To Low',
    'Discount'
  ];

  const handleSortChange = (option) => {
    setSortBy(option);
    setIsDropdownOpen(false);
  };

  const offerColors = {
    "New Launch": "bg-[#533d99]",
    "Special Deal": "bg-[#198754]",
    "Extra 10% Off": "bg-[#d3ac0a]",
    "Extra 15% Off": "bg-[#8db600]",
  };

  // Filter products based on the selected filters
  const filteredProducts = useMemo(() => {
    let products = category.filter((product) => product.category === categoryName);

    // Apply price filter
    if (filters?.priceRange) {
      products = products.filter((product) => {
        const price = parseInt(product.price);
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }

    // Apply polish filter
    if (filters?.selectedPolish && filters.selectedPolish.length > 0) {
      products = products.filter((product) => {
        // Assuming product has a 'polish' property
        return filters.selectedPolish.some(polish => 
          product.polish?.toLowerCase().includes(polish.toLowerCase())
        );
      });
    }

    // Apply metal filter
    if (filters?.selectedMetal && filters.selectedMetal.length > 0) {
      products = products.filter((product) => {
        // Assuming product has a 'metal' property
        return filters.selectedMetal.some(metal => 
          product.metal?.toLowerCase().includes(metal.toLowerCase())
        );
      });
    }

    // Apply earring type filter
    if (filters?.selectedEarringType && filters.selectedEarringType.length > 0) {
      products = products.filter((product) => {
        // Assuming product has a 'type' or 'subType' property
        return filters.selectedEarringType.some(type => 
          product.type?.toLowerCase().includes(type.toLowerCase()) ||
          product.subType?.toLowerCase().includes(type.toLowerCase())
        );
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'Price Low To High':
        return products.sort((a, b) => parseInt(a.price) - parseInt(b.price));
      case 'Price High To Low':
        return products.sort((a, b) => parseInt(b.price) - parseInt(a.price));
      case 'Discount':
        return products.sort((a, b) => parseInt(b.discount || 0) - parseInt(a.discount || 0));
      case 'Latest':
      default:
        return products; // Keep original order for 'Latest'
    }
  }, [categoryName, filters, sortBy]);

  return (
    <>  
      <div className="flex justify-between w-full items-center mb-6 px-6 py-4 bg-white">
        {/* Page Title */}
        <h1 className="text-3xl font-medium text-gray-900">
          {categoryName} ({filteredProducts.length} products)
        </h1>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-3 border border-gray-200 rounded-md px-2">
          <span className="text-sm text-gray-600 font-medium">Sort by :</span>
          
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between min-w-[100px] px-2 py-2 text-sm font-medium text-gray-900 bg-white rounded-md hover:bg-gray-50 focus:outline-none"
            >
              <span>{sortBy}</span>
              <ChevronDown 
                className={`ml-2 h-4 w-4 -rotate-90 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-90' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md z-50 shadow-lg border">
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSortChange(option)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                        sortBy === option 
                          ? 'bg-gray-50 text-gray-900 font-medium' 
                          : 'text-gray-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Click outside to close dropdown */}
        {isDropdownOpen && (
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </div>

      {/* No products found message */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your filters.</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filter criteria.</p>
        </div>
      )}

      {/* Products Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {filteredProducts.map((product, index) => (
          <a key={index} href={`/showproduct/${product?.id}`} target="_blank">
            <div className="bg-white overflow-hidden relative group hover:transition duration-300">
              {/* Image */}
              <div className="relative">
                <img
                  src={product.img}
                  alt={product.title}
                  className="w-full h-64 md:h-76 object-cover rounded-lg transition-transform duration-300"
                />
                {product.offer && (
                  <div className="absolute top-3 left-3">
                    <span className={`text-white px-2 py-1 flex items-center gap-1 rounded-md text-xs font-medium ${offerColors[product.offer]}`}>
                      {product.offer === "Special Deal" && <CheckBadgeIcon size={16} />} 
                      {product.offer}
                    </span>
                  </div>
                )}
                {/* Heart Icon */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-black/40 rounded-full p-2 shadow hover:scale-110 transition">
                    <SVGHaert className="w-5 h-5 text-white" />
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
                {product.rating && (
                  <StarRating rating={product.rating} size={16} />
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm md:text-base font-semibold">
                    ₹{product.price}
                  </span>
                  <span className="text-xs line-through text-gray-400">
                    ₹{product.original}
                  </span>
                  <span className="text-xs md:text-sm text-orange-600">
                    ({product.discount}% OFF)
                  </span>
                </div>
                {product.offerText && (
                  <OfferBadge text={product.offerText} />
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </>
  );
};

export default EarringsHeader;