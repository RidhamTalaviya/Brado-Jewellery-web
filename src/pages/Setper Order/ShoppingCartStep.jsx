import React from 'react';
import { useDispatch } from 'react-redux';
import CartItem from './home/CartItem';
import OrderSummary from './home/OrderSummary';
// import { updateCartData } from '../../../redux/slices/cartSlice';

const ShoppingCartStep = ({ cart, nextStep, currentStep, setShowCouponModal }) => {
  const dispatch = useDispatch();

  // Handle quantity update for CartItem
  const handleQuantityUpdate = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      const payload = {
        productId,
        quantity: newQuantity.toString(),
      };
      dispatch(updateCartData(payload));
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 w-[90%] mx-auto">
      <div className="lg:col-span-2">
        <h2 className="mb-6 text-[23px]">
          Shopping Cart <span className="text-[#b4853e] text-[14px] ml-[10px]">{cart?.products?.length || 0} Items</span>
        </h2>
        {cart?.products?.length > 0 ? (
          cart.products.map((product) => (
            <CartItem
              key={product._id}
              product={product}
              quantity={product.quantity}
              setQuantity={(newQuantity) => handleQuantityUpdate(product._id, newQuantity)}
            />
          ))
        ) : (
          <p className="text-gray-600">Your cart is empty.</p>
        )}
      </div>
      <OrderSummary
        cart={cart}
        nextStep={nextStep}
        setShowCouponModal={setShowCouponModal}
        currentStep={currentStep}
      />
    </div>
  );
};

export default ShoppingCartStep;