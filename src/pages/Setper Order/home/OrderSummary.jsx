import React from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import CouponIcon from '../../../assets/icons/CouponIcon';

const OrderSummary = ({ nextStep, setShowCouponModal, currentStep, prevStep }) => {
  const cart = useSelector((state) => state?.cart?.cart[0]);
  const appliedCoupon = useSelector((state) => state?.cart?.coupon);


  return (
    <div className="bg-white rounded-lg p-6 h-fit">
      <div className="flex items-center justify-between mb-4 bg-[#f3f9f6] p-4 rounded">
        <div>
          <h3 className="text-[16px] flex items-center gap-2">
            <CouponIcon /> Apply Coupons
          </h3>
          <p className="text-[12px] mt-[5px] text-gray-600">
            To reveal exclusive discounts and start saving instantly.
          </p>
        </div>

        {/* Animated Apply Button */}
        <button
        
          onClick={() => setShowCouponModal(true)}
          className="apply-coupon-btn"
        >
          Apply
        </button>
      </div>

      {/* Applied Coupon Display */}
      {appliedCoupon && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-medium text-[14px]">{appliedCoupon.code}</span>
            <span className="text-green-600 text-[12px]">
              ({appliedCoupon.discountValue} OFF)
            </span>
          </div>
          <button
            className="text-gray-500 hover:text-red-600"
            onClick={() => {
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary Section */}
      <div className="pt-4">
        <h3 className="mb-4 text-[16px]">
          Order Summary{' '}
          <span className="text-[#696661] text-[14px]">
            (items {cart?.products?.length || 0})
          </span>
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-[#696661] text-[14px]">Total MRP</span>
            <span className="text-[14px]">₹{cart?.total_mrp_amount || 0}</span>
          </div>
        { cart?.total_sale_discount > 1 && <div className="flex justify-between text-green-600">
            <span className="text-[#696661] text-[14px]">Discount</span>
            <span className="text-[14px]">-₹{cart?.total_sale_discount}</span>
          </div>
}

          {cart?.total_offer_discount > 1 && (
            <div className="flex justify-between text-green-600">
              <span className="text-[#696661] text-[14px]">Offer Discount</span>
              <span className="text-[14px]">-₹{cart?.total_offer_discount}</span>
            </div>
          )}

          {cart?.coupon_discount > 1 && (
            <div className="flex justify-between text-green-600">
              <span className="text-[#696661] text-[14px]">Coupon Discount</span>
              <span className="text-[14px]">-₹{cart?.coupon_discount}</span>
            </div>
          )}
        </div>

        <div className="border-t pt-2 mb-6">
          <div className="flex justify-between text-lg">
            <span className="text-[16px] font-semibold">Total</span>
            <span className="text-[16px] font-semibold">
              ₹{cart?.grand_total || cart?.total_amount || 0}
            </span>
          </div>
        </div>

        {/* Buttons */}
        {currentStep > 1 && prevStep && (
          <button
            onClick={prevStep}
            className="w-full bg-white border border-gray-300 py-3 mb-4 rounded"
          >
            Back
          </button>
        )}

        <button
          onClick={nextStep}
          className="w-full bg-[#b4853e] text-white py-3 mb-4 rounded"
        >
          {currentStep === 3 ? 'Place Order' : 'Check Out'}
        </button>

        <button className="w-full text-[#b4853e] py-2 flex items-center justify-center gap-2 cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;