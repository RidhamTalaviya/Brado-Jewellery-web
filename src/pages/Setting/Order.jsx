import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrder, editorder } from "../../redux/slices/orderSlice"; // Adjusted to match common naming
import { createReview } from "../../redux/slices/reviewSlice";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Order() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order, loading, error } = useSelector((state) => state.order); // Assuming order slice structure
  const orders = order?.data || [];
  console.log(orders, "orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState({ orderId: "", productId: "" });
  const [rating, setRating] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // Fixed typo

  useEffect(() => {
    dispatch(getOrder())
      .unwrap()
      .catch((err) => console.error("Failed to fetch orders:", err));
  }, [dispatch]);

  const getOrderStatus = (timeline) => {
    const cancelled = timeline.find((t) => t.title === "Cancelled");
    const returned = timeline.find((t) => t.title === "Returned and Refunded");
    if (cancelled?.status === "completed") return { status: "Cancelled", color: "bg-red-100 text-red-600" };
    if (returned?.status === "completed") return { status: "Returned and Refunded", color: "bg-red-100 text-red-600" };
    const lastCompleted = timeline
      .slice()
      .reverse()
      .find((item) => item.status === "completed") || timeline[0];
    const status = lastCompleted ? lastCompleted.title : "Order Placed";
    const color = status === "Delivered" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600";
    return { status, color };
  };

  const canCancel = (status) => {
    return status !== "Delivered" && status !== "Cancelled" && status !== "Returned and Refunded";
  };

  const getProductDetails = (items) => {
    if (!items || items.length === 0) return null;
    const mainItem = items[0];
    const more = items.length > 1 ? `+ ${items.length - 1} More Products` : "";
    const image = mainItem.images?.[0]
      ? `https://yourapi/images/${mainItem.images[0]}`
      : "https://via.placeholder.com/100";
    return {
      name: mainItem.title,
      variant: mainItem.sku || "N/A",
      price: `₹${mainItem.discountPrice || mainItem.price}`,
      more,
      image,
    };
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
            {order.statusTimeline.map((step, index) => (
              <div key={index} className="mb-4 ml-6">
                <div className="absolute w-3 h-3 bg-gray-300 rounded-full -left-1.5 border border-white"></div>
                {step.status === "completed" && (
                  <div className="absolute w-3 h-3 bg-[#b4853e] rounded-full -left-1.5 border border-white"></div>
                )}
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

  // Placeholder for review modal trigger (to be implemented based on your requirements)
  const openReviewModal = (orderId, productId) => {
    setSelectedReview({ orderId, productId });
    setShowReviewModal(true);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-luxury-cream min-h-screen">
      <div className="flex items-center border-b border-gray-200 pb-[10px]">
        <h2 className="text-[22px] text-gray-900">Orders</h2>
        <span className="text-sm ml-[5px] mt-[10px] text-[#b4853e]">
          [{orders.length} items]
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {loading ? (
          <p className="text-gray-600">Loading orders...</p>
        ) : error ? (
          <p className="text-red-600">Error loading orders: {error.message}</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600">No orders found.</p>
        ) : (
          orders.map((order) => {
            const { status, color } = getOrderStatus(order.statusTimeline);
            const product = getProductDetails(order.items);
            console.log(product, "product");
            if (!product) return null;

            return (
              <div
                key={order._id}
                className="bg-white border border-gray-200 sm:w-full cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/Shipment/${order.OrderId}`)}
              >
                <div className="flex justify-between items-start p-[10px] border-b border-gray-200">
                  <div>
                    <div className="flex">
                      <p className="text-[14px] text-gray-400">Order No :</p>
                      <span className="text-[14px] ml-1">{order.OrderId}</span>
                    </div>
                  </div>
                  <span
                    className={`inline-block rounded-sm text-[11px] px-[10px] py-[4px] ${color}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrder(order);
                    }}
                  >
                    {status}
                  </span>
                </div>

                <div className="flex items-center space-x-4 p-[10px]">
                  <img
                    src={product.image} // Fixed to use product.image
                    alt={product.name}
                    className="w-24 h-32 object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-[14px] text-gray-900">{product.name}</p>
                    <p className="text-gray-500 text-sm">{product.variant}</p>
                    <p className="text-[14px] text-gray-900">{product.price}</p>
                    <p className="text-gray-400 text-sm">{product.more}</p>
                    <div className="flex">
                      <p className="text-gray-400 text-sm">Shipment No :</p>
                      <span className="text-sm ml-1">{order.OrderId}</span>
                    </div>
                  </div>
                </div>

                <div className="p-[10px] border-t border-gray-200 flex justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrder(order);
                    }}
                    className="text-blue-600 text-sm hover:text-blue-800"
                  >
                    View Timeline
                  </button>
                  {canCancel(status) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(editorder({ _id: order._id, status: "Cancelled" }))
                          .unwrap()
                          .then(() => dispatch(getOrder()))
                          .catch((err) => console.error("Failed to cancel order:", err));
                      }}
                      className="text-red-600 text-sm hover:text-red-800"
                    >
                      Cancel Order
                    </button>
                  )}
                  {/* Example: Trigger review modal (adjust productId as needed) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openReviewModal(order._id, order.items[0]?._id); // Adjust productId source
                    }}
                    className="text-green-600 text-sm hover:text-green-800"
                  >
                    Write Review
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <TimelineModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />

      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-[#f8f8f6] p-6 rounded-lg w-96 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Write Your Review</h3>
            <label className="block mb-2 text-sm text-gray-600">Rating:</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border border-gray-300 p-2 w-full mb-4 rounded-md bg-white text-gray-900"
            >
              <option value={1}>1 - Poor</option>
              <option value={2}>2 - Fair</option>
              <option value={3}>3 - Good</option>
              <option value={4}>4 - Very Good</option>
              <option value={5}>5 - Excellent</option>
            </select>
            <label className="block mb-2 text-sm text-gray-600">Review Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 p-2 w-full mb-4 rounded-md bg-white text-gray-900"
              placeholder="Enter a title for your review"
            />
            <label className="block mb-2 text-sm text-gray-600">Review Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)} // Fixed typo
              className="border border-gray-300 p-2 w-full mb-4 rounded-md bg-white text-gray-900"
              placeholder="Enter your review"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                className="text-[#b4853e] px-4 py-2 rounded-md hover:bg-[#b4853e]/10"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;