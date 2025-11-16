import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import add from "../../assets/images/adress.png";
import {
  fetchAddressData,
  createAddressData,
  removeAddressData,
  updateAddressData,
} from "../../redux/slices/addressSlice";
import { indianStateList } from "../../utils/indian_state_list";

export default function AddressManager() {
  const dispatch = useDispatch();
  const { addresses, status, error } = useSelector((state) => state.address);

  
  const [INDIAN_STATES] = useState(indianStateList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [values, setValues] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const dropdownRefs = useRef({});

  // Ensure addresses is always an array
  const addressList = Array.isArray(addresses) ? addresses : [];

  // Fetch addresses on mount
  useEffect(() => {
    dispatch(fetchAddressData());
  }, [dispatch]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openId !== null) {
        const dropdownEl = dropdownRefs.current[openId];
        if (dropdownEl && !dropdownEl.contains(event.target)) {
          setOpenId(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openId]);

  const handleInputChange = (field, value) => {
    setValues({ ...values, [field]: value });
  };

  // Fetch city and state from pincode
  const fetchPincodeData = async (pincode) => {
    if (pincode.length !== 6) return;

    setPincodeLoading(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice[0];
        setValues((prevValues) => ({
          ...prevValues,
          pincode: pincode,
          city: postOffice.District || prevValues.city || "",
          state: postOffice.State || prevValues.state || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching pincode data:", error);
    } finally {
      setPincodeLoading(false);
    }
  };

  // Handle pincode change with auto-fill
  const handlePincodeChange = (value) => {
    handleInputChange("pincode", value);
    if (value.length === 6) {
      fetchPincodeData(value);
    }
  };

  // Reset form data when modal closes
  const closeModal = () => {
    setIsModalOpen(false);
    setValues({});
    setEditingId(null);
    setFocusedField(null);
  };

  // Open modal for editing
  const handleEdit = (addr) => {
    setEditingId(addr._id || addr.id);
    setValues({
      name: addr.name || "",
      contactNumber: addr.contactNumber || addr.contact || "",
      email: addr.email || "",
      address1: addr.address1 || "",
      address2: addr.address2 || "",
      landMark: addr.landMark || addr.landmark || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      country: addr.country || "India",
      isDefault: addr.isDefault || false,
    });
    setIsModalOpen(true);
    setOpenId(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const addressData = {
      name: values.name || "",
      contactNumber: values.contactNumber || "",
      email: values.email || "",
      address1: values.address1 || "",
      address2: values.address2 || "",
      landMark: values.landMark || "",
      city: values.city || "",
      state: values.state || "",
      pincode: values.pincode || "",
      country: values.country || "India",
      isDefault: values.isDefault || false,
    };

    if (editingId) {
      await dispatch(updateAddressData({ id: editingId, addressData }));
    } else {
      await dispatch(createAddressData(addressData));
    }

    closeModal();
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      await dispatch(removeAddressData(id));
      setOpenId(null);
    }
  };

  return (
    <div className="space-y-6">
      

      

      {/* If no addresses → Empty State */}
      {addressList.length === 0 && status !== "loading" ? (
        <div className="bg-white p-12 text-center rounded-lg ">
          <div className="mb-6">
            <div className="mx-auto w-40 h-30 flex items-center justify-center mb-4">
              <img src={add} alt="No Address" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No Address yet!</h3>
            <p className="text-gray-500">You haven't added any address!</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#b4853e] text-white px-8 py-3 rounded-md cursor-pointer  hover:bg-[#9a6f32] transition"
          >
            Add New Address
          </button>
        </div>
      ) : (
        // If addresses exist → Show address list
        addressList.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-normal text-gray-800">Address Book</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-[#b4853e] hover:text-[#9a6f32] font-normal transition"
              >
                + Add New Address
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addressList.map((addr) => {
                const addressId = addr._id || addr.id;
                return (
                  <div
                    key={addressId}
                    className="bg-white p-4 border border-gray-200 rounded relative"
                  >
                    {/* 3-dot menu */}
                    <div
                      className="absolute peer px-1 top-4 right-4"
                      ref={(el) => (dropdownRefs.current[addressId] = el)}
                    >
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenId(openId === addressId ? null : addressId);
                          }}
                          className="text-gray-600 px-1 cursor-pointer hover:text-gray-800"
                        >
                          <svg width="4" height="16" viewBox="0 0 4 16" fill="currentColor">
                            <circle cx="2" cy="2" r="2"/>
                            <circle cx="2" cy="8" r="2"/>
                            <circle cx="2" cy="14" r="2"/>
                          </svg>
                        </button>

                        {/* Dropdown menu */}
                        {openId === addressId && (
                          <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded border border-gray-200 z-10">
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(addr);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(addressId);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Address details */}
                    <div className="pr-8">
                      <h3 className="text-gray-900 font-medium mb-2">{addr.name || "Unknown"}</h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {addr.contactNumber || addr.contact || "No contact"}
                      </p>
                      {addr.email && (
                        <p className="text-sm text-gray-600 mb-2">{addr.email}</p>
                      )}
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {addr.address1 || ""}
                        {addr.address2 && `, ${addr.address2}`}
                        {(addr.landMark || addr.landmark) && `, ${addr.landMark || addr.landmark}`}
                        {addr.city && addr.pincode && addr.state && 
                          `, ${addr.city}-${addr.pincode}, ${addr.state}, India`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-2 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-normal text-gray-900">
                {editingId ? "Edit Address" : "Add New Address"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* FORM */}
            <form className="p-6 space-y-4 z-0" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="relative w-full">
                <label
                  className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none ${
                    focusedField === 'name' || values.name
                      ? '-top-2.5 text-xs text-[#b4853e] bg-white'
                      : 'top-3 text-sm text-gray-400'
                  }`}
                >
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={values.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-3 py-3 border rounded focus:outline-none text-sm transition-colors ${
                    focusedField === 'name' ? 'border-[#b4853e]' : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Contact */}
              <div className="relative w-full">
                <label
                  className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none ${
                    focusedField === 'contactNumber' || values.contactNumber
                      ? '-top-2.5 text-xs text-[#b4853e] bg-white'
                      : 'top-3 text-sm text-gray-400'
                  }`}
                >
                  Contact No.
                </label>
                <input
                  type="tel"
                  required
                  maxLength="10"
                  pattern="[0-9]{10}"
                  value={values.contactNumber || ""}
                  onChange={(e) => handleInputChange("contactNumber", e.target.value.replace(/\D/g, ''))}
                  onFocus={() => setFocusedField('contactNumber')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-3 py-3 border rounded focus:outline-none text-sm transition-colors ${
                    focusedField === 'contactNumber' ? 'border-[#b4853e]' : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Email */}
              <div className="relative w-full">
                <label
                  className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none ${
                    focusedField === 'email' || values.email
                      ? '-top-2.5 text-xs text-[#b4853e] bg-white'
                      : 'top-3 text-sm text-gray-400'
                  }`}
                >
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={values.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-3 py-3 border rounded focus:outline-none text-sm transition-colors ${
                    focusedField === 'email' ? 'border-[#b4853e]' : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Address Line 1 */}
              <div className="relative w-full">
                <label
                  className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none ${
                    focusedField === 'address1' || values.address1
                      ? '-top-2.5 text-xs text-[#b4853e] bg-white'
                      : 'top-3 text-sm text-gray-400'
                  }`}
                >
                  Address Line 1
                </label>
                <input
                  type="text"
                  required
                  value={values.address1 || ""}
                  onChange={(e) => handleInputChange("address1", e.target.value)}
                  onFocus={() => setFocusedField('address1')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-3 py-3 border rounded focus:outline-none text-sm transition-colors ${
                    focusedField === 'address1' ? 'border-[#b4853e]' : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Address Line 2 */}
              <div className="relative w-full">
                <label
                  className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none ${
                    focusedField === 'address2' || values.address2
                      ? '-top-2.5 text-xs text-[#b4853e] bg-white'
                      : 'top-3 text-sm text-gray-400'
                  }`}
                >
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  value={values.address2 || ""}
                  onChange={(e) => handleInputChange("address2", e.target.value)}
                  onFocus={() => setFocusedField('address2')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-3 py-3 border rounded focus:outline-none text-sm transition-colors ${
                    focusedField === 'address2' ? 'border-[#b4853e]' : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Landmark */}
              <div className="relative w-full">
                <label
                  className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none ${
                    focusedField === 'landMark' || values.landMark
                      ? '-top-2.5 text-xs text-[#b4853e] bg-white'
                      : 'top-3 text-sm text-gray-400'
                  }`}
                >
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={values.landMark || ""}
                  onChange={(e) => handleInputChange("landMark", e.target.value)}
                  onFocus={() => setFocusedField('landMark')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-3 py-3 border rounded focus:outline-none text-sm transition-colors ${
                    focusedField === 'landMark' ? 'border-[#b4853e]' : 'border-gray-300'
                  }`}
                />
              </div>

              {/* City */}
              <div className="relative w-full">
                <label
                  className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none ${
                    focusedField === 'city' || values.city
                      ? '-top-2.5 text-xs text-[#b4853e] bg-white'
                      : 'top-3 text-sm text-gray-400'
                  }`}
                >
                  City
                </label>
                <input
                  type="text"
                  required
                  value={values.city || ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  onFocus={() => setFocusedField('city')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-3 py-3 border rounded focus:outline-none text-sm transition-colors ${
                    focusedField === 'city' ? 'border-[#b4853e]' : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Pincode */}
              <div className="relative w-full">
                <label
                  className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none ${
                    focusedField === 'pincode' || values.pincode
                      ? '-top-2.5 text-xs text-[#b4853e] bg-white'
                      : 'top-3 text-sm text-gray-400'
                  }`}
                >
                  Pin Code
                </label>
                <input
                  type="text"
                  required
                  maxLength="6"
                  pattern="[0-9]{6}"
                  value={values.pincode || ""}
                  onChange={(e) => handlePincodeChange(e.target.value.replace(/\D/g, ''))}
                  onFocus={() => setFocusedField('pincode')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-3 py-3 border rounded focus:outline-none text-sm transition-colors ${
                    focusedField === 'pincode' ? 'border-[#b4853e]' : 'border-gray-300'
                  }`}
                />
                {pincodeLoading && (
                  <span className="absolute right-3 top-3 text-xs text-gray-400">
                    Loading...
                  </span>
                )}
              </div>

              {/* State */}
              <div className="relative w-full">
                <label
                  className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none ${
                    focusedField === 'state' || values.state
                      ? '-top-2.5 text-xs text-[#b4853e] bg-white'
                      : 'top-3 text-sm text-gray-400'
                  }`}
                >
                  State
                </label>
                <select
                  required
                  value={values.state || ""}
                  onChange={(e) => handleInputChange("state", e.target.value)}
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
                  <option value="" disabled hidden></option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="px-6 py-2 bg-[#b4853e] text-white rounded disabled:opacity-50 hover:bg-[#9a6f32] transition text-sm"
                >
                  {status === "loading" ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}