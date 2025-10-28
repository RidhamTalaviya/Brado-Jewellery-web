import React, { useState } from 'react';
import img1 from '../../assets/images/Juda/img1.jpeg'

import {
  ShoppingCart,
  MapPin,
  CreditCard,
  CheckCircle,
  Plus,
  Minus,
  Heart,
  Trash2,
  ArrowLeft,
  Tag,
  X,
  Home,
  ChevronRight,
  BadgePercent,
  Check
} from 'lucide-react';
import CheckBoxIcon from '../../assets/icons/CheckBoxIcon';

const CheckoutFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState({});
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
    gstNo: ''
  });

  const steps = [
    { id: 1, title: 'Shopping Cart', icon: ShoppingCart },
    { id: 2, title: 'Address', icon: MapPin },
    { id: 3, title: 'Shipping & Payment', icon: CreditCard },
    { id: 4, title: 'Complete', icon: CheckCircle }
  ];

  const product = {
    sku: 'ER - Botad - Mendi Gold - Green',
    name: 'Craftsmanship Elegance Mendi Gold Plated Kundan Sto...',
    price: 279,
    mrp: 544,
    discount: 265,
    discountPercent: 48,
    image: '/api/placeholder/150/150'
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const StepIndicator = () => (
    <div className="my-4 bg-white">
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
            className="flex flex-col items-center relative z-10 text-center"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center mb-3 text-sm font-medium ${
                currentStep >= step.id
                  ? "bg-[#b4853e] text-white"
                  : "bg-[#f4f3ef] text-gray-600"
              }`}
            >
              {step.id}
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

  const CouponModal = () => (
    showCouponModal && (
      <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Save Big Today!</h3>
            <button onClick={() => setShowCouponModal(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600 mb-4">Redeem your coupon and save big on your order today!</p>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Enter coupon code"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
              Apply
            </button>
          </div>
          <div className="text-center">
            <div className="w-20 h-16 mx-auto mb-4 border-2 border-dashed border-amber-400 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-amber-600">0%</span>
            </div>
            <p className="text-gray-600 font-medium">We couldn't find any coupons!</p>
            <p className="text-sm text-gray-500 mt-2">
              No coupons are eligible for your cart. Please add something else to your cart and try again!
            </p>
          </div>
        </div>
      </div>
    )
  );

  const ShoppingCartStep = () => (
    <div className="grid lg:grid-cols-3 gap-8 w-[90%] mx-auto">
      <div className="lg:col-span-2">
        <h2 className="mb-6 text-[23px]">Shopping Cart <span className="text-[#b4853e] text-[14px] ml-[10px]">1 Items</span></h2>

        <div className="border-b border-gray-300 pb-[15px] relative"> {/* relative is required */}
          {/* Top-right buttons */}
          <div className="absolute top-2 right-2 md:flex space-x-2 hidden">
            <div className="text-[13px] text-gray-900 cursor-pointer">Move to wishlist</div>
            <div className="w-px h-4 bg-gray-300" />
            <div className="text-[13px] text-red-800 cursor-pointer">Remove</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <img
                src={img1}
                alt="Product"
                className="w-27 h-35 object-cover"
              />
              <div className="flex-1">
                <p className="text-[#696661] text-[12px]">SKU: Delmoro - Brick Brown</p>
                <h4 className="text-[14px]">Stylish Boho Print Tote Bag for Women – Ethnic Shoulder Handbag</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-[14px]">₹469</span>
                  <span className="text-gray-600 line-through text-[14px]">₹1,004</span>
                  <span className="text-[#b4853e] text-[12px]">(53% OFF)</span>
                </div>
                <div className="space-y-3">
                  {/* Special Deal Card */}
                  <div className="bg-[#e6f3ed] border border-green-200 rounded-sm p-3 relative w-[70%] mt-[10px]">
                    {/* Ribbon */}
                    <div className="absolute -top-0 left-0">
                      <div className="bg-green-600 text-white text-xs px-3 py-1 relative font-medium">
                        Special Deal
                        {/* angled / shape */}
                        <span className="absolute top-0 right-0 w-2 h-full bg-[#e6f3ed] [clip-path:polygon(0_0,100%_0,100%_100%)]"></span>
                      </div>
                    </div>

                    <div className="flex items-start justify-between mt-4">
                      <div>
                        <h2 className="text-green-900  text-sm">
                          Get this ₹1
                        </h2>
                        <p className="text-xs text-gray-600 mt-1">
                          On orders of 1 items or more, valid only on selected collection.
                        </p>
                      </div>
                      <ChevronRight className="text-green-600 w-6 h-6 mt-1" />
                    </div>
                  </div>

                  {/* Buy any 3 Deal */}
                  <div className="bg-[#f7f3eb] border border-[#b4853e5c] rounded-sm p-3 flex items-center justify-between w-[75%]">
                    <div className="flex items-center gap-2">
                      <BadgePercent className="text-amber-600 w-5 h-5" />
                      <span className="text-amber-800 text-sm font-medium">
                        Buy any 3 & Get @ ₹119
                      </span>
                    </div>
                    <ChevronRight className="text-amber-600 w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex border border-gray-200 p-[2px]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="mx-4 font-[8px]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
            <span className="ml-4 text-lg font-bold">₹{product.price * quantity}</span>
          </div>
        </div>

      </div>

      <div className="bg-white rounded-lg p-6 h-fit">
        <div className="flex items-center justify-between mb-4 bg-[#f3f9f6] p-4">
          <div>
          <h3 className="text-[16px]">🎫 Apply Coupons</h3>
          <p className="text-[12px] mt-[5px] text-gray-600">To reveal exclusive discounts and start saving instantly.</p>
          </div>
          <button
            onClick={() => setShowCouponModal(true)}
            className="px-3 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700 text-[14px]"
          >
            Apply
          </button>
        </div>
        

        <div className="pt-4">
          <h3 className="mb-4 text-[16px]">Order Summary <span className='text-[#696661] text-[14px]'>(items 1)</span></h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className='text-[#696661] text-[14px]'>Total MRP</span>
              <span className='text-[14px]'>₹{product.mrp}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span className='text-[#696661] text-[14px]'>Discount</span>
              <span className='text-[14px]'>-₹{product.discount}</span>
            </div>
          </div>
          <div className="border-t pt-2 mb-6">
            <div className="flex justify-between text-lg">
              <span className='text-[16px]'>Total</span>
              <span className='text-[16px]'>₹{product.price}</span>
            </div>
          </div>
          <button
            onClick={nextStep}
            className="w-full bg-[#b4853e] text-white py-3 mb-4"
          >
            Check Out
          </button>
          <button className="w-full text-[#b4853e] py-2 flex items-center gap-2 cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );


// Updated AddressStep Component
// The billing address fields will auto-populate when "same address" checkbox is checked
// When unchecked, users can edit the billing fields independently

const AddressStep = ({ formData, handleInputChange, errors, setErrors }) => (
  <div className="grid lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Delivery Address</h2>
        <button className="text-[#b4853e] px-4 py-2 flex items-center gap-1 text-[14px] cursor-pointer">
        <CheckBoxIcon /> Select Address
        </button>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person Name</label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact No.</label>
            <input
              type="text"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="relative mb-3">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => {
              handleInputChange(e);
              if (errors?.email) setErrors({});
            }}
            className={`peer w-full border rounded-md py-3 px-3 text-sm focus:outline-none transition-all duration-200 ${
              errors?.email ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-[#b4853e]"
            }`}
            placeholder=" "
          />
          <label
            htmlFor="email"
            className={`absolute outline-none transition-all duration-200 bg-white px-1 pointer-events-none ${
              formData.email || errors?.email ? "-top-2 left-2 text-xs" : "top-3 left-3 text-sm peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs"
            } ${
              errors?.email ? "text-red-500" : formData.email ? "text-[#b4853e]" : "text-gray-500 peer-focus:text-[#b4853e]"
            }`}
          >
            Email Id (Optional)
          </label>
          {errors?.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address line 1</label>
            <input
              type="text"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address line 2 (Optional)</label>
            <input
              type="text"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Landmark (Optional)</label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pin Code</label>
            <input
              type="text"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select State</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Rajasthan">Rajasthan</option>
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="sameAddress"
            checked={formData.sameAddress}
            onChange={handleInputChange}
            className="mr-2"
          />
          <span className="text-sm">My delivery and billing addresses are the same.</span>
        </div>

        {/* Billing Address Section - Only show when sameAddress is false */}
        {!formData.sameAddress && (
          <div className="pt-6 mt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
            <div className="space-y-4">
              <input
                type="text"
                name="billingName"
                placeholder="Enter Billing / Legal name"
                value={formData.billingName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="billingAddress1"
                  placeholder="Address line 1"
                  value={formData.billingAddress1}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="text"
                  name="billingAddress2"
                  placeholder="Address line 2 (Optional)"
                  value={formData.billingAddress2}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="billingCity"
                  placeholder="City"
                  value={formData.billingCity}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="text"
                  name="billingPin"
                  placeholder="Pin Code"
                  value={formData.billingPin}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <select
                  name="billingState"
                  value={formData.billingState}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">State</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Rajasthan">Rajasthan</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            name="addStatutory"
            checked={formData.addStatutory}
            onChange={handleInputChange}
            className="mr-2"
          />
          <span className="text-sm">Add statutory information</span>
        </div>

        {formData.addStatutory && (
          <div className="pt-4 mt-4 border-t">
            <h3 className="text-lg font-semibold mb-4">Statutory Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <input
                type="text"
                name="gstNo"
                placeholder="GST No."
                value={formData.gstNo}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>

    <div className="rounded-lg h-fit">
      <h3 className="mb-4">Order Summary <span className='text-[#696661] text-[14px]'>(items 1)</span></h3>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className='text-[#696661] text-[14px]'>Total MRP</span>
          <span className='text-[14px]'>₹544</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span className='text-[#696661] text-[14px]'>Discount</span>
          <span className='text-[14px]'>-₹265</span>
        </div>
      </div>
      <div className="border-t pt-2 mb-6">
        <div className="flex justify-between">
          <span className='text-[#1f1f1d] text-[16px]'>Total</span>
          <span className='text-[#1f1f1d] text-[16px]'>₹279</span>
        </div>
      </div>

      <button
        onClick={nextStep}
        className="w-full bg-[#b4853e] text-white py-3 mb-4 rounded-lg hover:bg-[#a0753a] transition-colors"
      >
        Next
      </button>

      <p className="text-xs text-gray-500 mb-4">
        Note: Shipping & COD Charges will be calculated at the next step if applicable.
      </p>

      <button
        onClick={prevStep}
        className="flex items-center text-[#b4853e] cursor-pointer hover:text-[#a0753a] transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>
    </div>
  </div>
);

  const PaymentStep = () => (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-semibold mb-6">Shipping Method</h2>
        <div className="bg-whit border rounded-lg p-4 border-gray-300 w-[60%] flex justify-between">
          <div className="space-y-3">
            <label className="flex items-center   cursor-pointer hover:bg-gray-50">
              <input type="radio" name="payment" className="mr-3" defaultChecked />
              <span>Cash on Delivery (COD)</span>
            </label>
          <p className='mt-[10px] ml-[25px] text-[#696661]'>3-5 Days Delivery</p>
          </div>
        <div>
          70
        </div>
        </div>
      </div>
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-semibold mb-6">Payment & Shipping</h2>
        <div className="bg-white">
          <div className="space-y-3">
            <div className='border border-gray-200 p-4 w-[60%]'>
              <label className="flex items-center   rounded-lg cursor-pointer ">
              <input type="radio" name="payment" className="mr-3" defaultChecked />
              <span>Cash on Delivery (COD)</span>
            </label>
            <p className='mt-[10px] ml-[25px] text-[#696661]'>Pay using Credit card, Debit card, UPI</p>
            </div>
            <div className='border border-gray-200 p-4 w-[60%]'>
            <label className="flex items-cente rounded-lg cursor-pointer w-[60%]">
              <input type="radio" name="payment" className="mr-3" />
              <span>online payment</span>
            </label>
              <p className='mt-[10px] ml-[25px] text-[#696661]'>Pay at door steps</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 h-fit">
        <h3 className="mb-4">Order Summary <span className='text-[#696661]'>(item2)</span></h3>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span  className='text-[#696661] text-[14px]'>Total MRP</span>
            <span className='text-[14px]'>₹279</span>
          </div>
          <div className="flex justify-between">
            <span  className='text-[#696661] text-[14px]'>Discount</span>
            <span className='text-[14px] text-green-500'>-₹100</span>
          </div>
          <div className="flex justify-between">
            <span  className='text-[#696661] text-[14px]'>COD Charges</span>
            <span className='text-[14px]'>₹25</span>
          </div>
          <div className="flex justify-between">
            <span  className='text-[#696661] text-[14px]'>Shipping Charges</span>
            <span className='text-[14px]'>₹25</span>
          </div>
        </div>
        <div className="border-t pt-2 mb-6 border-gray-400">
          <div className="flex justify-between text-lg">
            <span  className='text-[#1b1917] text-[16px]'>Total</span>
            <span className='text-[16px]'>₹404</span>
          </div>
        </div>

        <button
          onClick={nextStep}
          className="w-full bg-[#b4853e] text-white py-3 mb-4"
        >
          Place Order
        </button>

        <button
          onClick={prevStep}
          className="w-full text-[#b4853e] py-2 flex items-center gap-"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>
    </div>
  );

  const CompleteStep = () => (
  <div className="max-w-3xl mx-auto text-center w-[80%]">

    {/* Order Summary Card */}
    <div className="bg-[#f8f8f8] rounded-lg p-[35px] mb-8">
      <div className="grid md:grid-cols-2 gap-6 text-left">
        {/* Left Section - Order Details */}
        <div className='text-center'>
    <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
      <Check className="w-12 h-12 text-green-600" />
    </div>

    {/* Success Message */}
    <h2 className="text-[16px] font-medium mb-6">Order Placed Successfully</h2>
          <p className="text-[14px] mb-2 text-[#696661]">
            Order No.: <span className="text-[14px] text-[#000000]">250900053</span>
          </p>
          <p className="text-[14px] text-[#696661]">
            Order Amount: <span className="text-[14px] text-[#000000]">₹612.4</span>
          </p>
        </div>

        {/* Right Section - Shipping & Payment */}
        <div className="border-l pl-6 border-gray-300">
          <h3 className="mb-2">Shipping Details</h3>
          <p className="text-[#696661] text-[14px] mb-[5px]">Julian Wallace</p>
          <p className="text-[#696661] text-[14px] mb-[5px]">
            324 Rocky New Street, Consequatur et ut s, Optio reprehenderit,
            Dolore id magna et i-453540, Puducherry, India
          </p>
          <p className="text-[#696661] text-[14px] mb-[5px]">Mobile No. : 1515151515</p>
          <p className="text-[#696661] text-[14px] mb-[5px]">Email Id : cutifeno@mailinator.com</p>

          <h3 className="text-[16px] mb-2 mt-5">Payment Details</h3>
          <p className="text-[#696661] text-[14px]">Mode: <span className='text-[#000000]'>COD</span></p>
        </div>
      </div>
    </div>

    {/* Buttons */}
    <div className="flex justify-center gap-4">
      <button className="px-6 py-2 bg-white border border-gray-300  ">
        Continue Shopping
      </button>
      <button className="px-6 py-2 bg-[#b4853e] text-white ">
        View Order
      </button>
    </div>
  </div>
);

const renderStep = () => {
  switch (currentStep) {
    case 1:
      return <ShoppingCartStep />;
    case 2:
      return (
        <AddressStep
          formData={formData}
          handleInputChange={handleInputChange}
          errors={errors}
          setErrors={setErrors}
        />
      );
    case 3:
      return <PaymentStep />;
    case 4:
      return <CompleteStep />;
    default:
      return <ShoppingCartStep />;
  }
};


  return (
    <div className="min-h-screen ">
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

      <div className="container mx-auto px-4 py-8">
        <StepIndicator />
        {renderStep()}
      </div>

      <CouponModal />
      {/* <Specialdeal /> */}

    </div>
  );
};

export default CheckoutFlow;