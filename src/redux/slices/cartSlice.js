import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/AxiosInterceptor';
import { Bounce, toast } from 'react-toastify';

export const fetchCartData = createAsyncThunk(
  '/fetchCartData',
  async (couponCode, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(couponCode ? `/cart/get?couponCode=${couponCode}` : '/cart/get');

    

      return response.data; 


    } catch (error) {
     
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createCartData = createAsyncThunk(
  '/createCartData',
  async (productId, { rejectWithValue , dispatch }) => {
    try {
      const response = await axiosInstance.post('/cart/add', productId);
      toast.success(response?.message || 'Cart Data Created', {
        position: 'top-right',
        autoClose: 2000,
        pauseOnHover: true,
        transition: Bounce,
      });

      if(response?.success){
        dispatch(fetchCartData());        
      }
      return response.data; 
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error Creating Cart Data', {
        position: 'top-right',
        autoClose: 5000,
        pauseOnHover: true,
        transition: Bounce,
      });
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateCartData = createAsyncThunk(
  '/updateCartData',
  async (payload, { rejectWithValue , dispatch }) => {
    try {
      const response = await axiosInstance.post('/cart/update', payload);

      if(response?.success){
        dispatch(fetchCartData());        
      }
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update  data');
    }
  }
);

export const removeCartData = createAsyncThunk(
  '/removeCartData',
  async (productId, { rejectWithValue , dispatch }) => {
    try {
      const response = await axiosInstance.delete(`/cart/remove/${productId}`);

      if(response?.success){
        dispatch(fetchCartData());        
      }
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to remove  data');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: [],
    status: 'idle', 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCartData.fulfilled, (state, action) => {
        state.status = 'succeeded';

        state.cart = action.payload;
      })
      .addCase(fetchCartData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;