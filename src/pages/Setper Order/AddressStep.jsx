// AddressStep component (modified with nextStep, prevStep props and lifted state)
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import CheckBoxIcon from '../../assets/icons/CheckBoxIcon';
import OrderSummary from './home/OrderSummary';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchAddressData } from '../../redux/slices/addressSlice';

import Address from '../../assets/images/adress.png';

// Address Selection Modal Component
const AddressSelectionModal = ({ isOpen, onClose, onSelectAddress , formData , setFormData }) => {
  const [selectedId, setSelectedId] = useState(null);
  const dispatch = useDispatch();

  const addresses = useSelector((state) => state?.address?.addresses);
  
  useEffect(() => {
    dispatch(fetchAddressData());
  }, [dispatch]);

  useEffect(() => {
    if (isOpen && addresses?.length > 0) {
      const defaultAddress = addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedId(defaultAddress._id);
      } else {
        setSelectedId(addresses[0]._id);
      }
    }
  }, [isOpen, addresses]);

  if (!isOpen) return null;

  const handleApply = () => {
    const selected = addresses.find(addr => addr._id === selectedId);
    if (selected) {
      onSelectAddress(selected);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 ">
          <h2 className="text-[16px] font-medium">Select Delivery Address</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          {addresses?.length > 0 ? (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address._id}
                  onClick={() => setSelectedId(address._id)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedId === address._id
                      ? 'border-[#b4853e] bg-amber-50'
                      : 'border-gray-300 hover:border-[#b4853e]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedId === address._id
                            ? 'border-[#b4853e]'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedId === address._id && (
                          <div className="w-3 h-3 rounded-full bg-[#b4853e]" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">
                        {address.name}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {address.contactNumber}
                      </div>  
                      <div className="text-sm text-gray-700">
                        {address.address1}
                        {address.address2 && `, ${address.address2}`}
                        {address.landMark && `, ${address.landMark}`}
                        {`, ${address.city}, ${address.state}, ${address.pincode}, ${address.country}`}
                      </div>
                      {address.isDefault && (
                        <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          Default Address
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center flex flex-col items-center gap-1 space-y-2">
              <img src={Address} alt="" className="w-24 h-24" />
              <p className="font-medium mb-1 " style={{wordSpacing: '5px'}}>No Address yet!</p>
              <span className="text-[14px] text-gray-500" style={{wordSpacing: '3px'}}>You haven't added any address!</span>
            </div>
          )}
        </div>

        {addresses?.length > 0 && <div className="flex justify-end gap-3 px-5 pb-6 ">
         
          <button
            onClick={handleApply}
            disabled={!selectedId}
            className={`px-6 py-2 rounded-md text-[14px]  transition-colors ${
              selectedId
                ? 'bg-[#b4853e] text-white hover:bg-[#a0753a]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Apply
          </button>
          </div>}
      </div>
    </div>
  );
};

const AddressStep = ({ formData, handleInputChange, errors, setErrors , nextStep, prevStep, currentStep}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSelectAddress = (address) => {
    const updates = {
      contactName: address.name,
      contactNo: address.contactNumber,
      email: address.email || '',
      addressLine1: address.address1,
      addressLine2: address.address2 || '',
      landmark: address.landMark || '',
      city: address.city,
      state: address.state,
      pinCode: address.pincode
    };

    Object.entries(updates).forEach(([name, value]) => {
      const syntheticEvent = {
        target: { name, value, type: 'text' }
      };
      handleInputChange(syntheticEvent);
    });

    if (formData.sameAddress) {
      const billingUpdates = {
        billingName: address.name,
        billingAddress1: address.address1,
        billingAddress2: address.address2 || '',
        billingCity: address.city,
        billingPin: address.pincode,
        billingState: address.state
      };

      Object.entries(billingUpdates).forEach(([name, value]) => {
        const syntheticEvent = {
          target: { name, value, type: 'text' }
        };
        handleInputChange(syntheticEvent);
      });
    }
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Delivery Address</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-[#b4853e] px-4 py-2 flex items-center gap-1 text-[14px] cursor-pointer hover:bg-amber-50 transition-colors rounded-lg"
            >
              <CheckBoxIcon /> Select Address
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Contact Person Name */}
              <div className="relative w-full">
                <label
                  className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none ${
                    focusedField === 'contactName' || formData.contactName
                      ? '-top-2.5 text-xs text-[#b4853e] bg-white'
                      : 'top-3 text-sm text-gray-400'
                  }`}
                >
                  Contact Person Name
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName || ""}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('contactName')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-3 py-3 border rounded focus:outline-none text-sm transition-colors ${
                    focusedField === 'contactName' ? 'border-[#b4853e]' : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Contact No. with +91 prefix */}
              <div className="relative w-full">
  <input
    type="text"
    name="contactNo"
    value={formData.contactNo || ""}
    onChange={handleInputChange}
    onFocus={() => setFocusedField('contactNo')}
    onBlur={() => setFocusedField(null)}
    className={`w-full pl-16 pr-3 py-3 border rounded focus:outline-none text-sm transition-colors ${
      focusedField === 'contactNo' ? 'border-[#b4853e]' : 'border-gray-300'
    }`}
    maxLength="10"
  />
  <label
    className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none bg-white ${
      focusedField === 'contactNo' || formData.contactNo
        ? '-top-2.5 text-xs text-[#b4853e]'
        : 'top-3 text-sm text-gray-400'
    }`}
  >
    Contact No.
  </label>
  {(focusedField === 'contactNo' || formData.contactNo) && (
    <div className="absolute left-0 top-0 bottom-0 flex items-center pointer-events-none">
      <span className="pl-3 pr-2 text-gray-700 font-medium text-sm">+91</span>
      <div className="w-px h-6 bg-gray-300"></div>
    </div>
  )}
</div>
            </div>

            {/* Email */}
            <div className="relative w-full">
              <label
                className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none ${
                  focusedField === 'email' || formData.email
                    ? '-top-2.5 text-xs bg-white'
                    : 'top-3 text-sm'
                } ${
                  errors?.email ? 'text-red-500' : focusedField === 'email' || formData.email ? 'text-[#b4853e]' : 'text-gray-400'
                }`}
              >
                Email Id (Optional)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={(e) => {
                  handleInputChange(e);
                  if (errors?.email) setErrors({});
                }}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-3 py-3 border rounded focus:outline-none text-sm transition-colors ${
                  errors?.email ? 'border-red-500' : focusedField === 'email' ? 'border-[#b4853e]' : 'border-gray-300'
                }`}
              />
              {errors?.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Address line 1 */}
              <div className="relative w-full">
                <label
                  className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none ${
                    focusedField === 'addressLine1' || formData.addressLine1
                      ? '-top-2.5 text-xs text-[#b4853e] bg-white'
                      : 'top-3 text-sm text-gray-400'
                  }`}
                >
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1 || ""}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('addressLine1')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-3 py-3 border rounded focus:outline-none text-sm transition-colors ${
                    focusedField === 'addressLine1' ? 'border-[#b4853e]' : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Address line 2 */}
              <div className="relative w-full">
                <label
                  className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none ${
                    focusedField === 'addressLine2' || formData.addressLine2
                      ? '-top-2.5 text-xs text-[#b4853e] bg-white'
                      : 'top-3 text-sm text-gray-400'
                  }`}
                >
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2 || ""}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('addressLine2')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-3 py-3 border rounded focus:outline-none text-sm transition-colors ${
                    focusedField === 'addressLine2' ? 'border-[#b4853e]' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Landmark */}
              <div className="relative w-full">
                <label
                  className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none ${
                    focusedField === 'landmark' || formData.landmark
                      ? '-top-2.5 text-xs text-[#b4853e] bg-white'
                      : 'top-3 text-sm text-gray-400'
                  }`}
                >
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark || ""}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('landmark')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-3 py-3 border rounded focus:outline-none text-sm transition-colors ${
                    focusedField === 'landmark' ? 'border-[#b4853e]' : 'border-gray-300'
                  }`}
                />
              </div>

              {/* City */}
              <div className="relative w-full">
                <label
                  className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none ${
                    focusedField === 'city' || formData.city
                      ? '-top-2.5 text-xs text-[#b4853e] bg-white'
                      : 'top-3 text-sm text-gray-400'
                  }`}
                >
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city || ""}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('city')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-3 py-3 border rounded focus:outline-none text-sm transition-colors ${
                    focusedField === 'city' ? 'border-[#b4853e]' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Pin Code */}
              <div className="relative w-full">
                <label
                  className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none ${
                    focusedField === 'pinCode' || formData.pinCode
                      ? '-top-2.5 text-xs text-[#b4853e] bg-white'
                      : 'top-3 text-sm text-gray-400'
                  }`}
                >
                  Pin Code
                </label>
                <input
                  type="text"
                  name="pinCode"
                  value={formData.pinCode || ""}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('pinCode')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-3 py-3 border rounded focus:outline-none text-sm transition-colors ${
                    focusedField === 'pinCode' ? 'border-[#b4853e]' : 'border-gray-300'
                  }`}
                  maxLength="6"
                />
              </div>

              {/* State */}
              <div className="relative w-full">
                <label
                  className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none ${
                    focusedField === 'state' || formData.state
                      ? '-top-2.5 text-xs text-[#b4853e] bg-white'
                      : 'top-3 text-sm text-gray-400'
                  }`}
                >
                  State
                </label>
                <select
                  name="state"
                  value={formData.state || ""}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('state')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-3 py-3 border rounded focus:outline-none text-sm bg-white appearance-none transition-colors ${
                    focusedField === 'state' ? 'border-[#b4853e]' : 'border-gray-300'
                  }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                  }}
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
                className="mr-2 w-4 h-4"
              />
              <span className="text-sm">My delivery and billing addresses are the same.</span>
            </div>

            {!formData.sameAddress && (
              <div className="pt-6 mt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
                <div className="space-y-4">
                  {/* Billing fields with same floating label pattern */}
                  <div className="relative w-full">
                    <label
                      className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none ${
                        focusedField === 'billingName' || formData.billingName
                          ? '-top-2.5 text-xs text-[#b4853e] bg-white'
                          : 'top-3 text-sm text-gray-400'
                      }`}
                    >
                      Enter Billing / Legal name
                    </label>
                    <input
                      type="text"
                      name="billingName"
                      value={formData.billingName || ""}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('billingName')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-3 py-3 border rounded focus:outline-none text-sm transition-colors ${
                        focusedField === 'billingName' ? 'border-[#b4853e]' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  {/* Continue with other billing fields using same pattern... */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative w-full">
                      <label
                        className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none ${
                          focusedField === 'billingAddress1' || formData.billingAddress1
                            ? '-top-2.5 text-xs text-[#b4853e] bg-white'
                            : 'top-3 text-sm text-gray-400'
                        }`}
                      >
                        Address line 1
                      </label>
                      <input
                        type="text"
                        name="billingAddress1"
                        value={formData.billingAddress1 || ""}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('billingAddress1')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-3 py-3 border rounded focus:outline-none text-sm transition-colors ${
                          focusedField === 'billingAddress1' ? 'border-[#b4853e]' : 'border-gray-300'
                        }`}
                      />
                    </div>

                    <div className="relative w-full">
                      <label
                        className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none ${
                          focusedField === 'billingAddress2' || formData.billingAddress2
                            ? '-top-2.5 text-xs text-[#b4853e] bg-white'
                            : 'top-3 text-sm text-gray-400'
                        }`}
                      >
                        Address line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        name="billingAddress2"
                        value={formData.billingAddress2 || ""}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('billingAddress2')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-3 py-3 border rounded focus:outline-none text-sm transition-colors ${
                          focusedField === 'billingAddress2' ? 'border-[#b4853e]' : 'border-gray-300'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Add remaining billing fields similarly */}
                </div>
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                name="addStatutory"
                checked={formData.addStatutory}
                onChange={handleInputChange}
                className="mr-2 w-4 h-4"
              />
              <span className="text-sm">Add statutory information</span>
            </div>

            {formData.addStatutory && (
              <div className="pt-4 mt-4 border-t">
                <h3 className="text-lg font-semibold mb-4">Statutory Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Add statutory fields with floating labels */}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="rounded-lg h-fit">
          <OrderSummary nextStep={nextStep} prevStep={prevStep} currentStep={currentStep}/>
        </div>
      </div>

      <AddressSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectAddress={handleSelectAddress}
      />
    </>
  );
};

export default AddressStep;