import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/AxiosInterceptor';
import { clearCartData } from '../slices/cartSlice';

export const createOrder = createAsyncThunk(
  '/createOrder',
  async (orderData, { rejectWithValue , dispatch }) => {
    try {
      const response = await axiosInstance.post('/orders/create', orderData);

      console.log(response.data , "response");

      if(response?.success){
        dispatch(clearCartData());        
      }
      return response; 


    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch  data');
    }
  }
);

export const getOrder = createAsyncThunk(
  '/getOrder',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/orders/getorderbyuser');

      console.log(response.data , "response");
      return response; 


    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch  data');
    }
  }
);


export const editorder = createAsyncThunk(
  '/editorder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/orders/changeOrderStatus', orderData);

      console.log(response.data , "response");
      return response; 


    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch  data');
    }
  }
);
export const getorderbyorderid = createAsyncThunk(
  '/getorderbyorderid',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/orders/getorderbyid/${orderId}`);

      console.log(response.data , "response");
      return response; 


    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch  data');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    order: [],
    orderbyid: [],
    status: 'idle', 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.order = action.payload;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

      builder
      .addCase(getorderbyorderid.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getorderbyorderid.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orderbyid = action.payload;
      })
      .addCase(getorderbyorderid.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;