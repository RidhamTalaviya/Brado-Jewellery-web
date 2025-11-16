import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCouponData } from '../../../redux/slices/couponSlice';
import { fetchCartData } from '../../../redux/slices/cartSlice';
import Couponimg from '../../../assets/images/coupon.png';

const CouponModal = ({ showCouponModal, setShowCouponModal, appliedCoupon, setAppliedCoupon }) => {
  if (!showCouponModal) return null;

  const dispatch = useDispatch();
  const { coupon, status } = useSelector((state) => state.coupon);
  const cartState = useSelector((state) => state.cart);
  const cart = cartState?.cart?.[0];

  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);


  useEffect(() => {
    dispatch(fetchCouponData());
  }, [dispatch]);

  const currentDate = new Date();

  const validCoupons = coupon.filter((c) => {
    const start = new Date(c.startDate);
    const end = new Date(c.endDate);
    
    const isActive = c.isActive;
    const isAfterStart = currentDate >= start;
    const isBeforeEnd = currentDate <= end;
    const meetsMinAmount = cart?.total_amount >= c.minOrderAmount;
    const hasUsageLeft = c.usageLimit > 0;

    return isActive && isAfterStart && isBeforeEnd && meetsMinAmount && hasUsageLeft;
  });

  const handleApplyCoupon = async () => {
    if (selectedCoupon) {
      setApplyingCoupon(true);
      try {
        await dispatch(fetchCartData(selectedCoupon.code)).unwrap();
        
        // Set the applied coupon ID
        setAppliedCoupon(selectedCoupon._id);
        
        setShowCouponModal(false);
        setCouponInput('');
        setSelectedCoupon(null);
      } catch (error) {
        alert(error.message || 'Failed to apply coupon. Please try again.');
      } finally {
        setApplyingCoupon(false);
      }
    } else {
      alert('Please select a valid coupon!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* FIXED: Changed to flexbox layout with max-h-[90vh] */}
      <div className="bg-white rounded-lg max-w-md w-full flex flex-col max-h-[90vh]">
        {/* Modal Header - FIXED: Added flex-shrink-0 to keep header fixed */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex-1">
            <h4 className="text-xl font-semibold text-gray-900 mb-1">Save Big Today!</h4>
            <p className="text-sm text-gray-600 mt-1">
              Redeem your coupon and save big on your order today!
            </p>
          </div>
          <button
            onClick={() => setShowCouponModal(false)}
            className="text-gray-400 hover:text-gray-600 ml-4 flex-shrink-0 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - FIXED: Added overflow-y-auto and flex-1 for proper scrolling */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Coupon Input */}
          <div className="flex items-center gap-2 mb-6">
            <input
              type="text"
              id="code"
              placeholder="Enter coupon code"
              value={couponInput}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#e6e6e6] focus:border-[#e6e6e6] transition-all"
              onChange={(e) => {
                const code = e.target.value.toUpperCase();
                setCouponInput(code);
                const foundCoupon = coupon.find((c) => c.code === code && validCoupons.includes(c));
                setSelectedCoupon(foundCoupon || null);
              }}
            />
            <button
              onClick={handleApplyCoupon}
              disabled={applyingCoupon || !selectedCoupon}
              className="px-6 py-3 bg-[#b4853e] text-white rounded-lg text-sm font-medium hover:bg-[#a0753a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {applyingCoupon ? 'Applying...' : 'Apply'}
            </button>
          </div>

          {/* Coupons List - FIXED: Removed inner max-h container */}
          {status === 'succeeded' && validCoupons.length > 0 && (
            <div className="space-y-3 pr-1">
              {validCoupons.map((c) => {
                const savingsAmount = c.discountType === "percentage" 
                  ? Math.round((cart?.total_amount * c.discountpercentageValue) / 100)
                  : c.discountfixedValue;
                
                return (
                  <div
                    key={c._id}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedCoupon?._id === c._id 
                        ? 'border-[#b4853e] bg-[#fffbf5] shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                    onClick={() => {
                      setSelectedCoupon(c);
                      setCouponInput(c.code);
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900 tracking-wide">
                        {c.code}
                      </h3>
                      <span className="text-base font-bold text-[#ff8c00]">
                        {c.discountType === "percentage" 
                          ? `${c.discountpercentageValue}%` 
                          : `₹${c.discountfixedValue}`} OFF
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Min Order: ₹{c.minOrderAmount} | Valid until {new Date(c.endDate).toLocaleDateString('en-GB')}
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                      ✓ You save ₹{savingsAmount}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* No Coupons Available */}
          {status === 'succeeded' && validCoupons.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-6 py-8 text-center">
              <div className="flex justify-center">
                <img 
                  src={Couponimg} 
                  alt="No Coupons" 
                  className="w-[133px] h-[105px] object-contain"
                />
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-lg font-semibold text-gray-900">
                  We couldn't find any coupons!
                </p>
                <span className="text-sm text-gray-600 leading-relaxed max-w-[320px]">
                  No coupons are eligible for your cart. Please add something else to your cart and try again!
                </span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {status === 'loading' && (
            <p className="text-center text-sm text-gray-600 py-8">Loading process...</p>
          )}
          
          {/* Error State */}
          {status === 'failed' && (
            <p className="text-center text-sm text-red-600 py-8">Failed to load coupons. Try again!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponModal;