import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/AxiosInterceptor';

export const showProductData = createAsyncThunk(
  '/product',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/product/getproduct/${slug}`);

      return response.data;
      
      
      
      
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch  data');
    }
  }
);

export const allProductData = createAsyncThunk(
  '/allProductData',
  async (params, { rejectWithValue }) => {
    try {
      // Build query string from all params
      const queryString = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = String(value);
          }
          return acc;
        }, {})
      ).toString();
      
      const response = await axiosInstance.get(`/product/get?${queryString}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch data');
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    showProductData: [],
    allProductData: [],
    status: 'idle', 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(showProductData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(showProductData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.showProductData = action.payload;
      })
      .addCase(showProductData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

      builder
      .addCase(allProductData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(allProductData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allProductData = action.payload;
      })
      .addCase(allProductData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;