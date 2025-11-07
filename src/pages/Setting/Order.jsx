import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrder, editorder } from "../../redux/slices/orderSlice";
import { createReview } from "../../redux/slices/reviewSlice";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import order from "../../assets/images/order.png";


function Order() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order: orderData, loading, error } = useSelector((state) => state.order);
  const orders = orderData?.data || [];
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState({ orderId: "", productId: "" });
  const [rating, setRating] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    dispatch(getOrder())
      .unwrap()
      .catch((err) => console.error("Failed to fetch orders:", err));
  }, [dispatch]);

  const getOrderStatus = (timeline) => {
    const cancelled = timeline.find((t) => t.title === "Order Cancelled" || t.title === "Cancelled");
    const returned = timeline.find((t) => t.title === "Returned and Refunded");
    
    if (cancelled?.status === "completed") return { status: "Cancelled", color: "bg-red-50 text-red-600" };
    if (returned?.status === "completed") return { status: "Returned and Refunded", color: "bg-red-50 text-red-600" };
    
    const lastCompleted = timeline
      .slice()
      .reverse()
      .find((item) => item.status === "completed" && item.title !== "Order Cancelled") || timeline[0];
    
    const status = lastCompleted ? lastCompleted.title : "Order Placed";
    const color = status === "Delivered" ? "bg-green-50 text-green-600" : "bg-[#fef6e7] text-[#d4a72c]";
    return { status, color };
  };

  const canCancel = (status) => {
    return status !== "Delivered" && status !== "Cancelled" && status !== "Returned and Refunded";
  };

  const handleReviewSubmit = () => {
    dispatch(
      createReview({
        productId: selectedReview.productId,
        orderId: selectedReview.orderId,
        rating,
        title,
        description,
      })
    )
      .unwrap()
      .then(() => {
        setShowReviewModal(false);
        setRating(1);
        setTitle("");
        setDescription("");
      })
      .catch((err) => console.error("Failed to submit review:", err));
  };

  const TimelineModal = ({ order, onClose }) => {
    if (!order) return null;
    
    const cancelledStep = order.statusTimeline.find(
      (step) => (step.title === "Order Cancelled" || step.title === "Cancelled") && step.status === "completed"
    );
    
    const orderConfirmedStep = order.statusTimeline.find(
      (step) => step.title === "Order Confirmed" && step.status === "completed"
    );
    
    const filteredTimeline = order.statusTimeline.filter((step) => {
      if (cancelledStep) {
        if (step.title === "Order Placed") return true;
        if (step.title === "Order Cancelled" || step.title === "Cancelled") {
          return step.status === "completed";
        }
        if (!orderConfirmedStep) {
          return false;
        }
        return step.status === "completed";
      }
      return true;
    });
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Order Timeline - {order.OrderId}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close timeline modal">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="relative border-l border-gray-300 ml-4">
            {filteredTimeline.map((step, index) => (
              <div key={index} className="mb-4 ml-6">
                <div className={`absolute w-3 h-3 rounded-full -left-1.5 border border-white ${
                  step.status === "completed" ? "bg-[#b4853e]" : "bg-gray-300"
                }`}></div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{step.title}</span>
                  <span className="text-sm text-gray-500 capitalize">{step.status}</span>
                  {step.timestamp && (
                    <span className="text-sm text-gray-400">
                      {new Date(step.timestamp).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const openReviewModal = (orderId, productId) => {
    setSelectedReview({ orderId, productId });
    setShowReviewModal(true);
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 mb-6">
        <h2 className="text-2xl font-normal text-gray-900">Order</h2>
        <span className="text-base text-[#b4853e]">
          [{orders.length} Items]
        </span>
      </div>

      {/* Orders Grid or Empty State */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col justify-center items-center gap-6 py-16">
          <div className="flex justify-center">
            <img 
              alt="No Orders" 
              loading="lazy" 
              width="239" 
              height="152" 
              src={order}
              className="max-w-full h-auto"
            />
          </div>
          <div className="flex flex-col items-center gap-2 text-center max-w-md">
            <h6 className="text-xl font-medium text-gray-900 mb-1">You haven't placed any order yet!</h6>
            <p className="text-gray-600 mb-4">Order section is empty. After placing order, You can track them from here!</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-[#b4853e] text-white px-8 py-3 rounded hover:bg-[#9a6f35] transition-colors font-medium"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {orders.map((orderItem) => {
            const { status, color } = getOrderStatus(orderItem.statusTimeline);
            const firstItem = orderItem.items[0];
            const remainingCount = orderItem.items.length - 1;

            if (!firstItem) return null;

            return (
              <div
                key={orderItem._id}
                className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                onClick={() => navigate(`/orders/${orderItem.OrderId}`)}
              >
                {/* Card Header */}
                <div className="flex justify-between items-center px-5 py-4 bg-[#fafaf8] border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Order No.:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {orderItem.OrderId.split('-')[1] || orderItem.OrderId}
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold ${color}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrder(orderItem);
                    }}
                  >
                    {status}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={firstItem.image || "https://via.placeholder.com/100"}
                        alt={firstItem.title}
                        className="w-24 h-28 object-cover rounded border border-gray-200"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">{firstItem.sku}</p>
                      <h3 className="text-sm font-normal text-gray-900 mb-2 line-clamp-2 leading-relaxed">
                        {firstItem.title}
                      </h3>
                      
                      {orderItem?.total_quantity > 1 && (
                        <p className="text-sm text-gray-700 mb-3 font-medium">
                          + {orderItem?.total_quantity -1 } More Product{remainingCount > 1 ? 's' : ''}
                        </p>
                      )}

                      {/* Price */}
                      <div className="text-right mt-2">
                        <p className="text-lg font-semibold text-gray-900">
                          ₹{orderItem.net_payable?.toLocaleString('en-IN') || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Shipment Number */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Shipment No.</span>
                      <span className="text-xs text-gray-600 font-medium">
                        {orderItem.OrderId.split('-')[1] || orderItem.OrderId}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer - Action Buttons */}
                <div className="px-5 pb-4 flex gap-3 justify-end border-t border-gray-100 pt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrder(orderItem);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 px-4 py-2 hover:bg-blue-50 rounded-md transition-colors font-medium"
                  >
                    View Timeline
                  </button>
                  
                  
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Timeline Modal */}
      <TimelineModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Write Your Review</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Rating:</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="border border-gray-300 p-2 w-full rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-[#b4853e] focus:border-transparent"
                >
                  <option value={1}>1 - Poor</option>
                  <option value={2}>2 - Fair</option>
                  <option value={3}>3 - Good</option>
                  <option value={4}>4 - Very Good</option>
                  <option value={5}>5 - Excellent</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Review Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-[#b4853e] focus:border-transparent"
                  placeholder="Enter a title for your review"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Review Description:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-[#b4853e] focus:border-transparent min-h-[100px]"
                  placeholder="Enter your review"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReviewSubmit}
                  className="px-4 py-2 bg-[#b4853e] text-white rounded-md hover:bg-[#9a6f35] transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;