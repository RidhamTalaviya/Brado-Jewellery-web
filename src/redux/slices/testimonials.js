// src/features/carousel/carouselSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/AxiosInterceptor';

// Async thunk to fetch carousel data
export const fetchTestimonialsData = createAsyncThunk(
  'testimonials/fetchTestimonialsData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/testimonials/customertestimonials');
      return response.data; 

    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch testimonials data');
    }
  }
);

const testimonialsSlice = createSlice({
  name: 'testimonials',
  initialState: {
    testimonials: [],
    status: 'idle', 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonialsData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTestimonialsData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.testimonials = action.payload;
      })
      .addCase(fetchTestimonialsData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default testimonialsSlice.reducer;