import React, { useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const showToast = (message, type = 'success') => {
    const toastEl = document.createElement('div');
    toastEl.className = `fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 animate-slide-in ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toastEl.style.animation = 'slideIn 0.3s ease-out';
    toastEl.textContent = message;
    document.body.appendChild(toastEl);
    setTimeout(() => {
      toastEl.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => toastEl.remove(), 300);
    }, 2000);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber.replace(/\s/g, ''))) {
      newErrors.contactNumber = 'Contact number must be 10 digits';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fill in all required fields correctly', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/contactusmessages/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          contactNumber: formData.contactNumber,
          message: formData.message
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      showToast(data?.message || 'Message sent successfully!', 'success');
      
      setFormData({
        name: '',
        email: '',
        contactNumber: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      showToast(error.message || 'Failed to send message. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
      
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-[13px] text-gray-600">
            <span className="cursor-pointer hover:text-gray-900">Home</span>
            <span>›</span>
            <span className="text-gray-900">Contact Us</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <div className="mb-10">
              <h2 className="text-[20px] font-semibold mb-4">Call & WhatsApp Us</h2>
              <div className="flex items-center gap-3 mb-3">
                <Phone className="w-5 h-5 text-[#b4853e]" />
                <a href="tel:+919016905077" className="text-[16px] hover:text-[#b4853e]">
                  +91 9016905077
                </a>
              </div>
              <p className="text-[14px] text-gray-600 mb-2">Store hours: 09:00AM - 07:00 PM</p>
              <p className="text-[14px] text-gray-600 mb-4">
                Call us for any kind of support. We will provide you effective resolution for any query you have.
              </p>
              <a 
                href="tel:+919016905077" 
                className="inline-block text-[#b4853e] text-[15px] font-semibold hover:underline"
              >
                Call Us
              </a>
            </div>

            <div className="mb-10">
              <h2 className="text-[20px] font-semibold mb-4">Send us a email</h2>
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-5 h-5 text-[#b4853e]" />
                <a href="mailto:care@bradojewellery.com" className="text-[16px] hover:text-[#b4853e]">
                  care@bradojewellery.com
                </a>
              </div>
              <p className="text-[14px] text-gray-600 mb-2">Average response time: 30Min</p>
              <p className="text-[14px] text-gray-600 mb-4">
                Email us for any kind of support. We will provide you direct support for all service.
              </p>
              <a 
                href="mailto:care@bradojewellery.com" 
                className="inline-block text-[#b4853e] text-[15px] font-semibold hover:underline"
              >
                Email Us
              </a>
            </div>

            <div>
              <h2 className="text-[20px] font-semibold mb-4">Meet us our store</h2>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#b4853e] mt-1 flex-shrink-0" />
                <p className="text-[14px] text-gray-600">
                  301, 3rd Floor Ganesh Bhuvan Apartment, Near Ganesh Collony, Opp Arihant Jewelrs,
                  Main Road Varachha, Surat - 395006, Gujarat, India
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-[20px] font-semibold mb-2">Have Something in mind?</h2>
            <p className="text-[14px] text-gray-600 mb-6">
              Send us a message and we will get back to you as soon as possible!
            </p>

            <div>
              <div className="mb-5">
                <div className="relative w-full">
                  <label
                    className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none ${
                      focusedField === 'name' || formData.name
                        ? '-top-2.5 text-[12px] text-[#b4853e] bg-white'
                        : 'top-3 text-[14px] text-gray-400'
                    }`}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-3 py-3 border rounded focus:outline-none text-[14px] transition-colors ${
                      errors.name ? 'border-red-500' : focusedField === 'name' ? 'border-[#b4853e]' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-[12px] mt-1">{errors.name}</p>}
              </div>

              <div className="mb-5">
                <div className="relative w-full">
                  <label
                    className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none ${
                      focusedField === 'email' || formData.email
                        ? '-top-2.5 text-[12px] text-[#b4853e] bg-white'
                        : 'top-3 text-[14px] text-gray-400'
                    }`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-3 py-3 border rounded focus:outline-none text-[14px] transition-colors ${
                      errors.email ? 'border-red-500' : focusedField === 'email' ? 'border-[#b4853e]' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-[12px] mt-1">{errors.email}</p>}
              </div>

              <div className="mb-5">
                <div className="relative w-full">
                  <label
                    className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none ${
                      focusedField === 'contactNumber' || formData.contactNumber
                        ? '-top-2.5 text-[12px] text-[#b4853e] bg-white'
                        : 'top-3 text-[14px] text-gray-400'
                    }`}
                  >
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('contactNumber')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-3 py-3 border rounded focus:outline-none text-[14px] transition-colors ${
                      errors.contactNumber ? 'border-red-500' : focusedField === 'contactNumber' ? 'border-[#b4853e]' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.contactNumber && <p className="text-red-500 text-[12px] mt-1">{errors.contactNumber}</p>}
              </div>

              <div className="mb-6">
                <div className="relative w-full">
                  <label
                    className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none ${
                      focusedField === 'message' || formData.message
                        ? '-top-2.5 text-[12px] text-[#b4853e] bg-white'
                        : 'top-3 text-[14px] text-gray-400'
                    }`}
                  >
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-3 py-3 border rounded focus:outline-none text-[14px] transition-colors resize-none ${
                      errors.message ? 'border-red-500' : focusedField === 'message' ? 'border-[#b4853e]' : 'border-gray-300'
                    }`}
                  ></textarea>
                </div>
                {errors.message && <p className="text-red-500 text-[12px] mt-1">{errors.message}</p>}
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full bg-[#b4853e] text-white py-3 rounded text-[15px] font-semibold hover:bg-[#a07535] transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;