import React, { useState } from "react";
import OrderSummary from "./home/OrderSummary";

const PaymentStep = ({
  nextStep,
  prevStep,
  currentStep,
  setShowCouponModal,
}) => {
  // ✅ Local state to control selection (or use props if managed by parent)
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("prepaid");

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Left Section */}
      <div className="lg:col-span-2">
        {/* Shipping Method */}
        <div className="mb-8">
          <h2 className="text-[23px] font-semibold mb-6">Shipping Method</h2>
          <div className="bg-white border rounded-lg border-gray-300 w-full lg:w-[70%]">
            <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="shipping"
                  value="standard"
                  checked={shippingMethod === "standard"}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="mr-4 accent-[#b4853e] w-4 h-4"
                />
                <div>
                  <span className="text-[16px] font-medium">
                    Standard Shipping
                  </span>
                  <p className="text-[14px] text-[#696661] mt-1">
                    2-3 Days Delivery
                  </p>
                </div>
              </div>
              <span className="text-green-600 font-semibold">Free</span>
            </label>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h2 className="text-[23px] font-semibold mb-6">Payment Method</h2>
          <div className="space-y-4 w-full lg:w-[70%]">
            {/* Online Payment */}
            <div className="border border-gray-300 rounded-lg">
              <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    value="prepaid"
                    checked={paymentMethod === "prepaid"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-4 accent-[#b4853e] w-4 h-4"
                  />
                  <div>
                    <span className="text-[16px] font-medium">
                      Online Payment
                    </span>
                    <p className="text-[14px] text-[#696661] mt-1">
                      Pay using Credit card, Debit card, UPI
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {/* Cash on Delivery */}
            <div className="border border-gray-300 rounded-lg">
              <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-4 accent-[#b4853e] w-4 h-4"
                  />
                  <div>
                    <span className="text-[16px] font-medium">
                      Cash on Delivery
                    </span>
                    <p className="text-[14px] text-[#696661] mt-1">
                      Pay at door steps
                    </p>
                  </div>
                </div>
                <span className="text-[#b4853e] font-semibold">₹55</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Order Summary */}
      <div className="lg:col-span-1">
        <OrderSummary
          nextStep={nextStep}
          prevStep={prevStep}
          currentStep={currentStep}
          setShowCouponModal={setShowCouponModal}
        />
      </div>
    </div>
  );
};

export default PaymentStep;
