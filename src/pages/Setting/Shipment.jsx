import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, data } from 'react-router-dom';
import { ArrowLeft, Star, X, Upload, AlertTriangle } from 'lucide-react';
import axiosInstance from '../../api/AxiosInterceptor';
import cancel from '../../assets/images/cancel.png';
import { editorder, getOrder } from '../../redux/slices/orderSlice';
import { useDispatch } from 'react-redux';

const Shipment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewEligibility, setReviewEligibility] = useState({});


  console.log(reviewEligibility , "reviewEligibility");
  const [reviewData, setReviewData] = useState({
    title: '',
    comment: '',
    review: '',
    rating: 0
  });
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const dispatch = useDispatch();
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/orders/getorderbyorderid/${orderId}`);

      console.log(response.data , "response.data");
      setOrderData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  const checkAllProducts = async () => {
    if (orderData && isDelivered()) {
      const eligibilityChecks = {};
      
      for (const item of orderData.items) {

        console.log(item.productId , "item.productId");
        const result = await checkReviewEligibility(item.productId);


        eligibilityChecks[item.productId] = result;

        
      }
      
      console.log(eligibilityChecks , "eligibilityChecks");
      setReviewEligibility(eligibilityChecks);
    }
  };
  useEffect(() => {
  
  checkAllProducts();
}, [orderData]);


const checkReviewEligibility = async (productId) => {
  try {
    const response = await axiosInstance.get('/review/check-eligibility', {
      params: {
        productId: productId,
        orderId: orderData._id
      }
    });
    console.log(response.reviewData , "response.reviewData");
    return response;
  } catch (err) {
    console.error('Error checking review eligibility:', err);
    return { canReview: false, reason: 'Error checking eligibility' };
  }
};
 


  const getCurrentStatus = () => {
    if (!orderData?.statusTimeline) return { text: 'pending', color: 'bg-yellow-50 text-yellow-600' };
    
    const cancelled = orderData.statusTimeline.find(s => s.title === 'Cancelled' && s.status === 'completed');
    if (cancelled) return { text: 'Cancelled', color: 'bg-red-50 text-red-600' };
    
    const returned = orderData.statusTimeline.find(s => s.title === 'Returned and Refunded' && s.status === 'completed');
    if (returned) return { text: 'Returned and Refunded', color: 'bg-red-50 text-red-600' };
    
    const lastCompleted = orderData.statusTimeline
      .filter(status => status.status === 'completed')
      .pop();
    
    if (!lastCompleted) return { text: 'Order Placed', color: 'bg-yellow-50 text-yellow-600' };
    
    const statusMap = {
      'Delivered': { text: 'Delivered', color: 'bg-green-50 text-green-600' },
      'Out for Delivery': { text: 'Out for Delivery', color: 'bg-blue-50 text-blue-600' },
      'Shipped': { text: 'Shipped', color: 'bg-blue-50 text-blue-600' },
      'Packed': { text: 'Packed', color: 'bg-yellow-50 text-yellow-600' },
      'Order Confirmed': { text: 'Order Confirmed', color: 'bg-yellow-50 text-yellow-600' },
    };
    
    return statusMap[lastCompleted.title] || { text: lastCompleted.title, color: 'bg-yellow-50 text-yellow-600' };
  };

  const isDelivered = () => {
    if (!orderData?.statusTimeline) return false;
    const delivered = orderData.statusTimeline.find(s => s.title === 'Delivered' && s.status === 'completed');
    return !!delivered;
  };

  // const handleWriteReview = (product) => {
  //   setSelectedProduct(product);
  //   setShowReviewModal(true);
  //   setReviewData({
  //     title: '',
  //     comment: '',
  //     review: '',
  //     rating: 0
  //   });
  // };

  const handleWriteReview = async (product) => {
  const eligibility = reviewEligibility[product.productId];
  
  if (!eligibility?.canReview) {
    if (eligibility?.reviewData) {
      alert('You have already reviewed this product');
      // Optionally show existing review
      return;
    }
    alert(eligibility?.reason || 'Cannot write review at this time');
    return;
  }
  
  setSelectedProduct(product);
  setShowReviewModal(true);
  setReviewData({
    title: '',
    comment: '',
    rating: 0
  });
};

   const canCancel = (status) => {
    return status !== "Delivered" && status !== "Cancelled" && status !== "Returned and Refunded";
  };

  const handleRatingClick = (rating) => {
    setReviewData(prev => ({ ...prev, rating }));
  };

  const handleSubmitReview = async () => {
    if (!reviewData.rating || !reviewData.title || !reviewData.comment ) {
      alert('Please fill all fields and select a rating');
      return;
    }

    try {
      setReviewLoading(true);
      const payload = {
        productId: selectedProduct.productId,
        orderId: orderData._id,
        title: reviewData.title,
        comment: reviewData.comment,
        rating: reviewData.rating.toString()
      };

      const response = await axiosInstance.post('/review/create', payload);
      
      if (response.success) {
        setShowReviewModal(false);
        setSelectedProduct(null);
        checkAllProducts();
      }
    } catch (err) {
      alert('Failed to submit review: ' + err.message);
    } finally {
      setReviewLoading(false);
    }
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
  const showReviewButton = isDelivered();

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <ArrowLeft 
            className="w-5 h-5 cursor-pointer hover:text-gray-600" 
            onClick={() => navigate(-1)} 
          />
          <h1 className="text-lg lg:text-xl font-normal text-gray-900">
            Order Number <span className="text-[#b4853e] font-medium">#{orderData.OrderId.split('-')[1]}</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Products */}
          <div className="lg:col-span-2 space-y-4">
            {/* Shipment Status */}
            <div className="bg-gray-50 p-4 rounded">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-gray-700 text-sm">
                  Shipment <span className="text-[#b4853e]">#{orderData.OrderId.split('-')[1]}</span>
                </span>
                <span className={`px-3 py-1 rounded text-xs font-medium ${currentStatus.color}`}>
                  {currentStatus.text}
                </span>
              </div>
            </div>

            {/* Products List */}
            {orderData.items && orderData.items.map((product, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={product.image || 'https://via.placeholder.com/150'}
                      alt={product.title}
                      className="w-24 h-28 object-cover rounded"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150';
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">
                          SKU: {product.sku}
                        </p>
                        <h3 className="font-normal text-sm text-gray-900 mb-3 line-clamp-2">
                          {product.title}
                        </h3>
                        
                        {/* Price */}
                        <div className="mb-2">
                          <span className="text-lg font-normal text-gray-900">
                            ₹{product.discountPrice?.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Bulk Deal/Offer Discount */}
                        {product.applicableOffer && (
                          <p className="text-xs text-green-600 mb-2">
                            Bulk Deal Discount: ₹{product.itemOfferDiscount?.toLocaleString('en-IN')}
                          </p>
                        )}

                        {/* Quantity */}
                        <p className="text-sm text-gray-600 mb-3">
                          Qty: {product.quantity}
                        </p>

                        {/* Write Review Button */}
                        {/* {showReviewButton && (
                          <button
                            onClick={() => handleWriteReview(product)}
                            className="flex cursor-pointer items-center text-[12px] gap-2 px-4 py-2 bg-[#b4853e] text-white text-sm rounded hover:bg-[#9a6f35] transition-colors"
                          >
                            Write Review
                          </button>
                        )} */}

                        {showReviewButton && (
  <>
    {reviewEligibility[product.productId]?.canReview ? (
      <button
        onClick={() => handleWriteReview(product)}
        className="flex cursor-pointer items-center text-[12px] gap-2 px-4 py-2 bg-[#b4853e] text-white text-sm rounded hover:bg-[#9a6f35] transition-colors"
      >
        Write Review
      </button>
    ) : reviewEligibility[product.productId]?.reviewData ? (
      <p className="text-xs font-medium text-green-600 flex items-center gap-1">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        Already reviewed
      </p>
    ) : (
      <p className="text-xs text-gray-500">
        {reviewEligibility[product.productId]?.reason || 'Review not available'}
      </p>
    )}
  </>
)}
                      </div>

                      {/* Total Price on Right */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-normal text-gray-900">
                          ₹{(product.itemMRP - product.itemDiscount - (product.itemOfferDiscount || 0))?.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* {canCancel(status) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Are you sure you want to cancel this order?')) {
                          dispatch(editorder({ OrderId: orderItem._id, status: "Cancelled" }))
                            .unwrap()
                            .then(() => dispatch(getOrder()))
                            .catch((err) => console.error("Failed to cancel order:", err));
                        }
                      }}
                      className="text-sm text-red-600 hover:text-red-800 px-4 py-2 hover:bg-red-50 rounded-md transition-colors font-medium"
                    >
                      Cancel Order
                    </button>
                  )} */}

    <button onClick={() => setIsModalOpen(true)} className="text-[13px] cursor-pointer text-gray-700 border border-gray-200 px-4 py-2 rounded">Cancel Order</button>
          </div>

          {/* Right Section - Address & Summary */}
          <div className="space-y-4">
            {/* Address Card */}
            <div className="bg-white border border-gray-200 rounded p-5">
              <h2 className="text-base font-semibold mb-4 text-gray-900">Address</h2>

              {/* Delivery Address */}
              {orderData.shippingAddress && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Delivery Address</h3>
                  <p className="text-sm text-gray-900 font-medium mb-1">
                    {orderData.shippingAddress.contactPersonName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {orderData.shippingAddress.addressLine1}
                    {orderData.shippingAddress.addressLine2 && `, ${orderData.shippingAddress.addressLine2}`}
                    {orderData.shippingAddress.landmark && `, ${orderData.shippingAddress.landmark}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {orderData.shippingAddress.city}, {orderData.shippingAddress.state} - {orderData.shippingAddress.pinCode}
                  </p>
                  {orderData.shippingAddress.contactNo && (
                    <p className="text-sm text-gray-600 mt-1">
                      Mobile No: {orderData.shippingAddress.contactNo}
                    </p>
                  )}
                </div>
              )}

              {/* Billing Address */}
              {orderData.billingAddress && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Billing Address</h3>
                  {orderData.isBillingAddressSame ? (
                    <p className="text-sm text-gray-600">Same as delivery address</p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600">
                        {orderData.billingAddress.addressLine1}
                        {orderData.billingAddress.addressLine2 && `, ${orderData.billingAddress.addressLine2}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {orderData.billingAddress.city}, {orderData.billingAddress.state} - {orderData.billingAddress.pinCode}
                      </p>
                      {orderData.billingAddress.gstNo && (
                        <p className="text-sm text-gray-600">
                          GST No: {orderData.billingAddress.gstNo}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Order Summary Card */}
            <div className="bg-white border border-gray-200 rounded p-5">
              <h2 className="text-base font-semibold mb-4 text-gray-900">Order Summary</h2>

              <div className="space-y-3">
                {/* Order Created */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order Created</span>
                  <span className="text-gray-900">
                    {new Date(orderData.orderDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                {/* Total MRP */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total MRP</span>
                  <span className="text-gray-900">₹{orderData.total_mrp?.toLocaleString('en-IN')}</span>
                </div>

                {/* Product Discount */}
                {orderData.total_product_discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Product Discount</span>
                    <span className="text-green-600">-₹{orderData.total_product_discount?.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {/* Offer Discount */}
                {orderData.total_offer_discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Offer Discount</span>
                    <span className="text-green-600">-₹{orderData.total_offer_discount?.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {/* Coupon Discount */}
                {orderData.couponDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Coupon Discount</span>
                    <span className="text-green-600">-₹{orderData.couponDiscount?.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {/* Shipping Fee */}
                {orderData.shippingFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{orderData.paymentMethod === 'COD' ? 'COD Charge' : 'Shipping Fee'}</span>
                    <span className="text-gray-900">₹{orderData.shippingFee?.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    ₹{orderData.net_payable?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Estimated Delivery */}
              {orderData.estimatedDeliveryDate && currentStatus.text !== 'Cancelled' && currentStatus.text !== 'Delivered' && (
                <div className="mt-4 p-3 bg-blue-50 rounded">
                  <p className="text-xs text-blue-800">
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
 {isModalOpen && (
        <div className="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center p-4 z-50">
          {/* Modal Container */}
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Modal Content */}
            <div className="p-6 text-center flex flex-col items-center">
              {/* Icon */}
              <img src={cancel} alt="" />

              {/* Title */}
              <h4 style={{wordSpacing:"2px"}} className="text-[16px] font-medium text-gray-900 mb-1 pt-4">
                Cancel Confirmation
              </h4>

              {/* Description */}
              <p style={{wordSpacing:"2px"}} className="text-gray-600 mb-6 text-[14px]">
                Are you sure to cancel your order?
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border cursor-pointer border-gray-200 text-[13px] text-gray-600 rounded hover:bg-gray-50 transition-colors"
                >
                  Keep Order
                </button>
                <button
                  onClick={(e) => {
                        e.stopPropagation();
                          dispatch(editorder({ OrderId: orderData._id, status: "Cancelled" }))
                            .unwrap()
                            navigate('/orders')
                      }}
                  className="px-4 py-2 bg-[#b5853b] cursor-pointer text-[13px] text-white rounded hover:bg-[#b5843bde] transition-colors"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Write a Review</h2>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Product Info */}
              {selectedProduct && (
                <div className="flex gap-4 p-4 bg-gray-50 rounded">
                  <img
                    src={selectedProduct.image || 'https://via.placeholder.com/150'}
                    alt={selectedProduct.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedProduct.title}</h3>
                    <p className="text-sm text-gray-600">SKU: {selectedProduct.sku}</p>
                  </div>
                </div>
              )}

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-8 h-8 cursor-pointer transition-colors ${
                        star <= reviewData.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      onClick={() => handleRatingClick(star)}
                    />
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Review Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={reviewData.title}
                  onChange={(e) => setReviewData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter review title"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#b4853e]"
                />
              </div>

              

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Detailed Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your experience with this product..."
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#b4853e] resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={reviewLoading}
                className="flex-1 px-4 py-2 bg-[#b4853e] text-white rounded hover:bg-[#9a6f35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shipment;