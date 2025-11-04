// CompleteStep component (modified to be dynamic with order prop)
import React from 'react';
import { Check } from 'lucide-react';
import { useSelector } from 'react-redux';
// import './CompleteStep.css'; // Import the CSS file

const CompleteStep = ({ order }) => {
  const cart = useSelector((state) => state?.cart?.cart[0]);

  if (!order) {
    return <div className="text-center py-8">Loading order details...</div>;
  }

  const addressString = `
    ${order.shippingAddress.addressLine1}${order.shippingAddress.addressLine2 ? ', ' + order.shippingAddress.addressLine2 : ''},
    ${order.shippingAddress.landmark ? order.shippingAddress.landmark + ', ' : ''}${order.shippingAddress.city},
    ${order.shippingAddress.state}, ${order.shippingAddress.pinCode}, India
  `;

  return (
    <div className="max-w-3xl mx-auto text-center w-[80%]">
      <div className="bg-[#f8f8f8] rounded-lg p-[35px] mb-8">
        <div className="grid md:grid-cols-2 gap-6 text-left">
          <div className="text-center">
            {/* Animated Success Icon */}
            <div className="relative flex items-center justify-center mx-auto mb-6 w-24 h-24">
              <span className="pulse-border"></span>
              <div className="relative z-10 bg-[#30aa71] w-full h-full rounded-full flex items-center justify-center">
                <Check className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h2 className="text-[16px] font-medium mb-6">Order Placed Successfully</h2>
            <p className="text-[14px] mb-2 text-[#696661]">
              Order No.: <span className="text-[14px] text-[#000000] font-medium">{order.OrderId}</span>
            </p>
            <p className="text-[14px] text-[#696661]">
              Order Amount: <span className="text-[14px] text-[#000000] font-medium">₹{cart?.total_amount}</span>
            </p>
          </div>
          <div className="md:border-l pl-6 border-gray-300">
            <h3 className="mb-2 font-semibold">Shipping Details</h3>
            <p className="text-[#696661] text-[14px] mb-[5px]">{order.shippingAddress.contactPersonName}</p>
            <p className="text-[#696661] text-[14px] mb-[5px]">
              {addressString}
            </p>
            <p className="text-[#696661] text-[14px] mb-[5px]">
              Mobile No. : <span>{order.shippingAddress.contactNo.replace('+91 | ', '')}</span>
            </p>
            <p className="text-[#696661] text-[14px] mb-[5px]">
              Email Id : <span>{order.shippingAddress.email}</span>
            </p>
            <h3 className="text-[16px] mb-2 mt-5 font-semibold">Payment Details</h3>
            <p className="text-[#696661] text-[14px]">
              Mode: <span className="text-[#000000] font-semibold">
                {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <button className="px-6 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
          Continue Shopping
        </button>
        <button className="px-6 py-2 bg-[#b4853e] text-white rounded hover:bg-[#a0753a] transition-colors">
          View Order
        </button>
      </div>
    </div>
  );
};

export default CompleteStep;