import React from 'react';
import {
  ShoppingCart,
  MapPin,
  CreditCard,
  CheckCircle
} from 'lucide-react';

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { id: 1, title: 'Shopping Cart', icon: ShoppingCart },
    { id: 2, title: 'Address', icon: MapPin },
    { id: 3, title: 'Shipping & Payment', icon: CreditCard },
    { id: 4, title: 'Complete', icon: CheckCircle }
  ];

  return (
    <div className="my-4 bg-white z-5">
      <div className="relative flex justify-between items-start max-w-3xl mx-auto">
        {/* Background line */}
        <div
          className="absolute top-[26%] h-[2px] bg-[#f4f3ef]"
          style={{
            left: "24px",
            right: "24px",
          }}
        />

        {/* Progress line */}
        <div
          className="absolute top-6 h-[2px] bg-[#b4853e] transition-all duration-300"
          style={{
            left: "33px",
            top: "26%",
            width:
              currentStep > 1
                ? `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 44px)`
                : "0%",
          }}
        />

        {/* Step circles */}
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex flex-col items-center relative z-5 text-center"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center mb-3 text-sm font-medium ${
                currentStep > step.id
                  ? "bg-[#b4853e] text-white"
                  : currentStep === step.id
                  ? "bg-[#b4853e] text-white"
                  : "bg-[#f4f3ef] text-gray-600"
              }`}
            >
              {currentStep > step.id ? (
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  height="1.5em"
                  width="1.5em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path>
                </svg>
              ) : (
                step.id
              )}
            </div>
            <span
              className={`text-xs font-medium whitespace-nowrap ${
                currentStep >= step.id ? "text-black" : "text-gray-500"
              }`}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;