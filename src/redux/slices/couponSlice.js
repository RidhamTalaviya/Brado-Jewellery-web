import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/AxiosInterceptor';

export const fetchCouponData = createAsyncThunk(
  '/fetchCouponData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/coupon/get');
      console.log(response , "response");

      return response; 


    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch  data');
    }
  }
);

const couponSlice = createSlice({
  name: 'coupon',
  initialState: {
    coupon: [],
    status: 'idle', 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCouponData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCouponData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.coupon = action.payload;
      })
      .addCase(fetchCouponData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default couponSlice.reducer;