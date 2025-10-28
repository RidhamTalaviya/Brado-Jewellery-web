// CartItem component (unchanged)
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCartData } from '../../../redux/slices/cartSlice'; 
import { Plus, Minus, ChevronRight } from 'lucide-react';
import { addToWishlist } from '../../../redux/slices/wishlistSlice';
import { removeCartData } from '../../../redux/slices/cartSlice';

// Settings/Cog Icon Component
const SettingsCogIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6m8.66-15l-3 5.2M9.34 12.8l-3 5.2m12.66 0l-3-5.2M9.34 6.2l-3-5.2" />
  </svg>
);

const CartItem = ({ product }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(product.quantity || 1); // Initialize with product quantity

  const discountPercent = product.discountPrice
    ? ((product.discountPrice - product.price) / product.discountPrice * 100).toFixed(0)
    : 0;

  const itemTotal = product.itemTotal || (product.price * quantity);

  // Handle quantity update
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
      const payload = {
        productId: product.productId,
        quantity: newQuantity.toString(), // Match the API payload structure
      };
      dispatch(updateCartData(payload));
    }
  };

  const moveWishlist = (productId) => {
    dispatch(addToWishlist(productId));
    dispatch(removeCartData(productId));
  };

  return (
    <div className="border-b border-gray-200 py-4 md:py-6">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={product.image || '/api/placeholder/180/230'}
            alt={product.title}
            className="w-28 h-36 md:w-44 md:h-56 object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <p className="text-gray-600 text-xs md:text-sm mb-1">SKU: {product.productId}</p>
          <h3 className="text-sm md:text-base font-normal mb-2 text-gray-900 leading-snug">{product.title}</h3>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base md:text-lg font-semibold text-gray-900">₹{product.price}</span>
            {product.discountPrice && (
              <>
                <span className="text-gray-500 line-through text-sm">₹{product.discountPrice}</span>
                <span className="text-amber-600 text-xs md:text-sm">({discountPercent}% OFF)</span>
              </>
            )}
          </div>

          {/* Bulk Deal Discount */}
          {product.bulkDealDiscount && (
            <p className="text-green-600 text-xs md:text-sm font-medium mb-2 md:mb-3">
              Bulk Deal Discount: ₹{product.bulkDealDiscount.toLocaleString()}
            </p>
          )}

          {/* Offer Banners */}
          {product.offerDetails && product.offerDetails.length > 0 && (
            <div className="mt-2 md:mt-3 flex flex-wrap gap-2">
              {product.offerDetails.map((offer, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1.5 md:gap-2 bg-amber-50 border border-amber-200 rounded-md px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm"
                >
                  <SettingsCogIcon size={12} />
                  <span className="font-medium text-gray-800">{offer.title}</span>
                  <button className="cursor-pointer">
                    <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-700" strokeWidth={2.5} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Mobile Action Links and Quantity - Show below content on mobile */}
          <div className="flex md:hidden items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs">
              <span onClick={() => moveWishlist(product.productId)} className="text-gray-700 cursor-pointer">Move to Wishlist</span>
              <span className="text-gray-400">|</span>
              <span onClick={() => dispatch(removeCartData(product.productId))} className="text-red-600 cursor-pointer">Remove</span>
            </div>
          </div>
        </div>

        {/* Right Section - Desktop Only */}
        <div className="hidden md:flex flex-col items-end gap-3 ml-auto flex-shrink-0">
          {/* Action Links */}
          <div className="flex items-center gap-2 text-sm whitespace-nowrap">
            <span onClick={() => moveWishlist(product.productId)} className="text-gray-700 cursor-pointer hover:text-gray-900">Move to Wishlist</span>
            <span className="text-gray-400">|</span>
            <span onClick={() => dispatch(removeCartData(product.productId))} className="text-red-600 cursor-pointer hover:text-red-700">Remove</span>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center border border-gray-300 rounded">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-gray-600"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-12 h-9 flex items-center justify-center text-base font-medium border-x border-gray-300">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-gray-600"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Total Price */}
          <span className="text-lg font-semibold text-gray-900">₹{itemTotal.toLocaleString()}</span>
        </div>

        {/* Mobile Quantity and Price */}
        <div className="flex md:hidden items-center justify-between mt-2">
          <div className="flex items-center border border-gray-300 rounded">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-10 h-8 flex items-center justify-center text-sm font-medium border-x border-gray-300">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <span className="text-lg font-semibold text-gray-900">₹{itemTotal.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;