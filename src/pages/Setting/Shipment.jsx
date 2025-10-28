import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axiosInstance from '../../api/AxiosInterceptor';

const Shipment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(orderData, "orderData");

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/orders/getorderbyorderid/${orderId}`);
      setOrderData(response.data[0]);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Get current order status
  const getCurrentStatus = () => {
    if (!orderData?.statusTimeline) return 'pending';
    
    const lastCompletedStatus = orderData.statusTimeline
      .filter(status => status.status === 'completed')
      .pop();
    
    if (lastCompletedStatus?.title === 'Order Cancelled') return 'cancelled';
    if (lastCompletedStatus?.title === 'Delivered') return 'delivered';
    if (lastCompletedStatus?.title === 'Out for Delivery') return 'out for delivery';
    if (lastCompletedStatus?.title === 'Shipped') return 'shipped';
    if (lastCompletedStatus?.title === 'Packed') return 'packed';
    if (lastCompletedStatus?.title === 'Order Confirmed') return 'confirmed';
    return 'pending';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading order details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">No order found</div>
      </div>
    );
  }

  const currentStatus = getCurrentStatus();

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <ArrowLeft 
          className="w-5 h-5 cursor-pointer hover:text-gray-600" 
          onClick={() => navigate(-1)} 
        />
        <h1 className="text-xl lg:text-2xl font-medium">
          Order Number <span className="text-[#b4853e]">#{orderData.OrderId}</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section - Products */}
        <div className="lg:col-span-2 space-y-4">
          {/* Shipment Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-gray-700 text-sm lg:text-base">
                Shipment #{orderData.OrderId}
              </span>
              <span className={`px-3 py-1 rounded text-xs lg:text-sm font-medium ${
                currentStatus === 'cancelled'
                  ? 'bg-red-100 text-red-600' 
                  : currentStatus === 'delivered'
                  ? 'bg-green-100 text-green-600'
                  : currentStatus === 'shipped' || currentStatus === 'out for delivery'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-yellow-100 text-yellow-600'
              }`}>
                {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
              </span>
            </div>
          </div>

          {/* Products List */}
          {orderData.items && orderData.items.map((product, index) => (
            <div key={index} className="bg-white border rounded-lg p-4">
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    src={product.imagesUrl?.[0] || 'https://via.placeholder.com/150'}
                    alt={product.title}
                    className="w-20 h-20 lg:w-24 lg:h-24 object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150';
                    }}
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-xs lg:text-sm text-gray-500 mb-1">
                        SKU: {product.sku}
                      </p>
                      <h3 className="font-medium text-sm lg:text-base text-gray-800 mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-2 lg:gap-3 mb-2 flex-wrap">
                        <span className="text-base lg:text-lg font-semibold text-gray-900">
                          ₹{product.discountPrice}
                        </span>
                        {product.price > product.discountPrice && (
                          <span className="text-xs lg:text-sm text-gray-400 line-through">
                            ₹{product.price}
                          </span>
                        )}
                        {product.discount > 0 && (
                          <span className="text-xs lg:text-sm text-green-600">
                            ({product.discount}% OFF)
                          </span>
                        )}
                      </div>
                      <p className="text-xs lg:text-sm text-gray-600">
                        Qty: {product.quantity}
                      </p>
                    </div>

                    {/* Price on Right */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-base lg:text-lg font-semibold text-gray-900">
                        ₹{product.totalPrice}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Section - Address & Summary */}
        <div className="space-y-4">
          {/* Address Card */}
          <div className="bg-white border rounded-lg p-4 lg:p-6">
            <h2 className="text-base lg:text-lg font-semibold mb-4">Address</h2>

            {/* Delivery Address */}
            {orderData.shippingAddress && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery Address</h3>
                <p className="text-sm lg:text-base text-gray-800 font-medium">
                  {orderData.shippingAddress.contactPersonName}
                </p>
                <p className="text-xs lg:text-sm text-gray-600 mt-1">
                  {orderData.shippingAddress.addressLine1}
                  {orderData.shippingAddress.addressLine2 && `, ${orderData.shippingAddress.addressLine2}`}
                </p>
                {orderData.shippingAddress.landmark && (
                  <p className="text-xs lg:text-sm text-gray-600">
                    Landmark: {orderData.shippingAddress.landmark}
                  </p>
                )}
                <p className="text-xs lg:text-sm text-gray-600">
                  {orderData.shippingAddress.city}, {orderData.shippingAddress.state} - {orderData.shippingAddress.pinCode}
                </p>
                {orderData.shippingAddress.contactNo && (
                  <p className="text-xs lg:text-sm text-gray-600 mt-1">
                    Mobile No: {orderData.shippingAddress.contactNo}
                  </p>
                )}
                {orderData.shippingAddress.email && (
                  <p className="text-xs lg:text-sm text-gray-600">
                    Email: {orderData.shippingAddress.email}
                  </p>
                )}
              </div>
            )}

            {/* Billing Address */}
            {orderData.billingAddress && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Billing Address</h3>
                {orderData.isBillingAddressSame ? (
                  <p className="text-xs lg:text-sm text-gray-600">Same as delivery address</p>
                ) : (
                  <>
                    <p className="text-sm lg:text-base text-gray-800 font-medium">
                      {orderData.billingAddress.contactPersonName}
                    </p>
                    <p className="text-xs lg:text-sm text-gray-600 mt-1">
                      {orderData.billingAddress.addressLine1}
                      {orderData.billingAddress.addressLine2 && `, ${orderData.billingAddress.addressLine2}`}
                    </p>
                    {orderData.billingAddress.landmark && (
                      <p className="text-xs lg:text-sm text-gray-600">
                        Landmark: {orderData.billingAddress.landmark}
                      </p>
                    )}
                    <p className="text-xs lg:text-sm text-gray-600">
                      {orderData.billingAddress.city}, {orderData.billingAddress.state} - {orderData.billingAddress.pinCode}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Order Summary Card */}
          <div className="bg-white border rounded-lg p-4 lg:p-6">
            <h2 className="text-base lg:text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 lg:space-y-3 mb-4">
              <div className="flex justify-between text-xs lg:text-sm">
                <span className="text-gray-600">Order Created</span>
                <span className="text-gray-800">
                  {new Date(orderData.orderDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex justify-between text-xs lg:text-sm">
                <span className="text-gray-600">Payment Method</span>
                <span className="text-gray-800">{orderData.paymentMethod}</span>
              </div>

              <div className="flex justify-between text-xs lg:text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800">₹{orderData.subtotal || 0}</span>
              </div>

              {orderData.couponDiscount > 0 && (
                <div className="flex justify-between text-xs lg:text-sm text-green-600">
                  <span className="text-gray-600">Coupon Discount</span>
                  <span>-₹{orderData.couponDiscount}</span>
                </div>
              )}

              {orderData.shippingFee > 0 && (
                <div className="flex justify-between text-xs lg:text-sm">
                  <span className="text-gray-600">Shipping Fee</span>
                  <span className="text-gray-800">₹{orderData.shippingFee}</span>
                </div>
              )}
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm lg:text-base font-semibold text-gray-800">Total</span>
                <span className="text-lg lg:text-xl font-bold text-gray-900">
                  ₹{orderData.totalAmount || 0}
                </span>
              </div>
            </div>

            {orderData.estimatedDeliveryDate && currentStatus !== 'cancelled' && currentStatus !== 'delivered' && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs lg:text-sm text-blue-800">
                  <span className="font-medium">Estimated Delivery:</span>{' '}
                  {new Date(orderData.estimatedDeliveryDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipment;