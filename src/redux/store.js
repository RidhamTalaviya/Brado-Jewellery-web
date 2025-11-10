import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import carouselReducer from './slices/carouselSlice';
import collectionsReducer from './slices/collections';
import necklacesetReducer from './slices/product/Necklaceset';
import wishlistReducer from './slices/wishlistSlice';
import productReducer from './slices/product/productSlice';
import addressReducer from './slices/addressSlice';
import cartReducer from './slices/cartSlice';
import couponReducer from './slices/couponSlice';
import orderReducer from './slices/orderSlice';
import testimonialsReducer from './slices/testimonials';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        carousel: carouselReducer,
        collections: collectionsReducer,
        necklaceset: necklacesetReducer,
        wishlist: wishlistReducer,
        product: productReducer,
        address: addressReducer,
        cart: cartReducer,
        coupon: couponReducer,
        order: orderReducer,
        testimonials: testimonialsReducer,
    },
});
