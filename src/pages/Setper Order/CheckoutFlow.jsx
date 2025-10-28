// src/components/checkout/CheckoutFlow.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Home } from 'lucide-react';

import StepIndicator from './StepIndicator';
import CouponModal from './home/CouponModal';
import ShoppingCartStep from './ShoppingCartStep';
import AddressStep from './AddressStep';
import PaymentStep from './PaymentStep';
import CompleteStep from './CompleteStep';

import { createOrder } from '../../redux/slices/orderSlice'; // <-- adjust path if needed

const CheckoutFlow = () => {
  const dispatch = useDispatch();

  /* ---------- Redux data ---------- */
  const cart = useSelector((state) => state?.cart?.cart[0]);  
  const [appliedCoupon , setAppliedCoupon] = useState(null)             // cart object
  // coupon object (or null)

  /* ---------- UI state ---------- */
  const [currentStep, setCurrentStep] = useState(1);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [errors, setErrors] = useState({});

  /* ---------- Address form state (lifted from AddressStep) ---------- */
  const [formData, setFormData] = useState({
    contactName: '',
    email: '',
    contactNo: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    pinCode: '',
    billingName: '',
    billingAddress1: '',
    billingAddress2: '',
    billingCity: '',
    billingState: '',
    billingPin: '',
    sameAddress: true,
    addStatutory: false,
    companyName: '',
    gstNo: '',
  });

  /* ---------- Payment & shipping selection (lifted from PaymentStep) ---------- */
  const [paymentMethod, setPaymentMethod] = useState('prepaid'); // 'prepaid' | 'cod'
  const [shippingMethod] = useState('standard');                // not used in payload

  /* ---------- Handlers ---------- */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const nextStep = async () => {
    console.log(appliedCoupon , "appliedCoupon")
    // --------------------------------------------------------------
    // STEP 3 → place order (API call)
    // --------------------------------------------------------------
    if (currentStep === 3) {
      /* ---- 1. Build items array (productId + quantity) ---- */
      const items = cart?.products?.map((p) => ({
        productId: p.productId,          // <-- MongoDB ObjectId from cart
        quantity: p.quantity,
      })) || [];

      console.log(items , "items")

      /* ---- 2. Coupon (id only, null if none) ---- */
      const couponcode = appliedCoupon || null;

      /* ---- 3. Payment method (API expects "COD" or "PREPAID") ---- */
      const formattedPaymentMethod = paymentMethod === 'prepaid' ? 'PREPAID' : 'COD';

      /* ---- 4. Shipping address (always required) ---- */
      const shippingAddress = {
        contactPersonName: formData.contactName,
        contactNo: `+91 | ${formData.contactNo}`,
        email: formData.email || '',
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || '',
        landmark: formData.landmark || '',
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
      };

      /* ---- 5. Billing address (same as shipping if checkbox true) ---- */
      let billingAddress = shippingAddress;
      const isBillingAddressSame = formData.sameAddress;

      if (!isBillingAddressSame) {
        billingAddress = {
          contactPersonName: formData.billingName,
          contactNo: shippingAddress.contactNo,
          email: shippingAddress.email,
          addressLine1: formData.billingAddress1,
          addressLine2: formData.billingAddress2 || '',
          landmark: '',
          city: formData.billingCity,
          state: formData.billingState,
          pinCode: formData.billingPin,
        };
      }

      /* ---- 6. Final payload (exactly matches the API contract) ---- */
      const orderPayload = {
        items,
        couponcode,
        paymentMethod: formattedPaymentMethod,
        shippingAddress,
        billingAddress,
        isBillingAddressSame,
      };

      try {
        const result = await dispatch(createOrder(orderPayload)).unwrap();
        // result contains { success: true, order: {...} }
        setCreatedOrder(result.order);
        setCurrentStep(4); // move to completion step
      } catch (err) {
        console.error('Order creation failed:', err);
        alert(err?.message || 'Failed to place order. Please try again.');
      }
      return;
    }

    // --------------------------------------------------------------
    // Normal step progression (1 → 2 → 3)
    // --------------------------------------------------------------
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  /* ---------- Render the current step ---------- */
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ShoppingCartStep
            cart={cart}
            nextStep={nextStep}
            currentStep={currentStep}
            setShowCouponModal={setShowCouponModal}
          />
        );
      case 2:
        return (
          <AddressStep
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
            setErrors={setErrors}
            nextStep={nextStep}
            prevStep={prevStep}
            currentStep={currentStep}
          />
        );
      case 3:
        return (
          <PaymentStep
            nextStep={nextStep}
            prevStep={prevStep}
            currentStep={currentStep}
            setShowCouponModal={setShowCouponModal}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        );
      case 4:
        return <CompleteStep order={createdOrder} />;
      default:
        return null;
    }
  };

  /* ---------- JSX ---------- */
  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Home className="w-4 h-4" />
            <span>Home</span>
            <span>›</span>
            <span>Shopping Cart</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <StepIndicator currentStep={currentStep} />
        {renderStep()}
      </div>

      {/* Coupon modal – rendered once at the root */}
      <CouponModal
        showCouponModal={showCouponModal}
        setShowCouponModal={setShowCouponModal}
        appliedCoupon={appliedCoupon}
      />
    </div>
  );
};

export default CheckoutFlow;