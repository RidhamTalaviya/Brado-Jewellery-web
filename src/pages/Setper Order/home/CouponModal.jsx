import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCouponData } from '../../../redux/slices/couponSlice';
import { fetchCartData } from '../../../redux/slices/cartSlice';

const CouponModal = ({ showCouponModal, setShowCouponModal , appliedCoupon}) => {
  if (!showCouponModal) return null;

  const dispatch = useDispatch();
  const { coupon, status } = useSelector((state) => state.coupon);
  const cartState = useSelector((state) => state.cart);
  const cart = cartState?.cart?.[0];

  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState('');

  console.log(appliedCoupon , "appliedCoupon  CouponModal");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  useEffect(() => {
    dispatch(fetchCouponData());
  }, [dispatch]);

  // Use actual current date instead of hardcoded date
  const currentDate = new Date();

  const validCoupons = coupon.filter((c) => {
    const start = new Date(c.startDate);
    const end = new Date(c.endDate);
    
    // All validation conditions
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={() => setShowCouponModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Save Big Today!</h3>
          <p className="text-gray-600 text-sm">
            Redeem your coupon and save big on your order today!
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponInput}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
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
              className="px-6 py-3 bg-[#b4853e] text-white rounded-lg hover:bg-[#a0753a] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {applyingCoupon ? 'Applying...' : 'Apply'}
            </button>
          </div>

          {status === 'succeeded' && validCoupons.length > 0 && (
            <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
              {validCoupons.map((c) => {
                const savingsAmount = Math.round((cart?.total_amount * c.discountpercentageValue) / 100);
                
                return (
                  <div
                    key={c._id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedCoupon?._id === c._id 
                        ? 'border-amber-500 bg-amber-50 shadow-sm' 
                        : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedCoupon(c);
                      setCouponInput(c.code);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-800">{c.code}</span>
                      <span className="text-sm font-semibold text-amber-600">
                        {c.discountpercentageValue}% OFF
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Min Order: ₹{c.minOrderAmount} | Valid until {new Date(c.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      ✓ You save ₹{savingsAmount}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {status === 'succeeded' && validCoupons.length === 0 && (
            <div className="text-center py-4">
              <div className="relative inline-block mb-6">
                <div className="absolute -top-2 -left-2 text-amber-300 text-2xl">✦</div>
                <div className="absolute -top-1 -right-3 text-amber-400 text-lg">✦</div>
                <div className="absolute -bottom-2 left-1/2 text-amber-300 text-xl">✦</div>

                <div className="relative bg-white border-2 border-dashed border-amber-400 rounded-lg p-6 w-32 h-24 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-amber-600">%</div>
                  </div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-gray-50 rounded-full"></div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-gray-50 rounded-full"></div>
                </div>
              </div>

              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                No coupons available right now!
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                No coupons match your cart requirements. Try adding more items or check back later!
              </p>
            </div>
          )}

          {status === 'loading' && (
            <p className="text-center text-sm text-gray-600">Loading coupons...</p>
          )}
          
          {status === 'failed' && (
            <p className="text-center text-sm text-red-600">Failed to load coupons. Try again!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponModal;