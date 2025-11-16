// src/components/checkout/CheckoutFlow.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Home, ShoppingCart } from 'lucide-react';

import StepIndicator from './StepIndicator';
import CouponModal from './home/CouponModal';
import ShoppingCartStep from './ShoppingCartStep';
import AddressStep from './AddressStep';
import PaymentStep from './PaymentStep';
import CompleteStep from './CompleteStep';
import emptyCartImg from '../../assets/images/cart.png'; // <-- your image
import { createOrder } from '../../redux/slices/orderSlice';
import Breadcrumb from '../../components/common/Breadcrumb';

const CheckoutFlow = () => {
  const dispatch = useDispatch();

  /* ---------- Redux data ---------- */
  const cart = useSelector((state) => state?.cart?.cart[0]); // cart object
  
  const [appliedCoupon, setAppliedCoupon] = useState(null); // coupon object (or null)

  const getStepLabel = (step) => {
  switch (step) {
    case 1:
      return 'Shopping Cart';
    case 2:
      return 'Address Summary';
    case 3:
      return 'Shipping & Payment Summary';
    case 4:
      return 'Complete';
    default:
      return 'Shopping Cart';
  }
};



  /* ---------- UI state ---------- */
  const [currentStep, setCurrentStep] = useState(1);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [errors, setErrors] = useState({});

  /* ---------- Address form state ---------- */
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


  /* ---------- Payment & shipping ---------- */
  const [paymentMethod, setPaymentMethod] = useState('prepaid'); // 'prepaid' | 'cod'

  /* ---------- Handlers ---------- */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const nextStep = async () => {
    if (currentStep === 3) {
      const items = cart?.products?.map((p) => ({
        productId: p.productId,
        quantity: p.quantity,
      })) || [];

      const couponcode = appliedCoupon || null;
      const formattedPaymentMethod = paymentMethod === 'prepaid' ? 'PREPAID' : 'COD';

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
        setCreatedOrder(result.order);
        setCurrentStep(4);
      } catch (err) {
        console.error('Order creation failed:', err);
        alert(err?.message || 'Failed to place order. Please try again.');
      }
      return;
    }

    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  /* ---------- Empty Cart UI ---------- */
  const EmptyCartUI = () => (
    <section className="container mx-auto px-4 py-12 min-h-[70vh] flex flex-col justify-center items-center gap-6 text-center">
      <div className="relative">
        <img
          src={emptyCartImg}
          alt="Empty Cart"
          width={289}
          height={200}
          className="mx-auto"
          loading="lazy"
        />
      </div>
      <div className="space-y-2">
        <h6 className="text-2xl font-semibold text-gray-800">Your cart is empty!</h6>
        <p className="text-gray-600 max-w-md mx-auto">
          There is nothing in your cart. Let’s add some items.
        </p>
        <a
          href="/"
          className="inline-block mt-4 px-8 py-3 bg-[#b4853e] text-white font-medium rounded-full hover:bg-[#a07734] transition-colors"
        >
          Continue Shopping
        </a>
      </div>
    </section>
  );

  /* ---------- Render Step ---------- */
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

  /* ---------- Early Return: Empty Cart ---------- */
  if (!cart || !cart.products || cart.products.length === 0 ) {
    return <EmptyCartUI />;
  }

  /* ---------- Normal Checkout Flow ---------- */
  return (
    <div className="min-h-screen ">
      {/* Breadcrumb */}
      {/* <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Home className="w-4 h-4" />
            <span>Home</span>
            <span>›</span>
            <span className="font-medium text-gray-900">Shopping Cart</span>
          </div>
        </div>
      </div> */}
<Breadcrumb label={getStepLabel(currentStep)}/>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <StepIndicator currentStep={currentStep} />
        <div className="mt-8">{renderStep()}</div>
      </div>

      {/* Coupon Modal */}
      <CouponModal
        showCouponModal={showCouponModal}
        setShowCouponModal={setShowCouponModal}
        appliedCoupon={appliedCoupon}
        setAppliedCoupon={setAppliedCoupon} // pass setter if needed
      />
    </div>
  );
};

export default CheckoutFlow;