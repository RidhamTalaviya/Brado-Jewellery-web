// src/features/carousel/carouselSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../../api/AxiosInterceptor';

// Async thunk to fetch carousel data
export const fetchCarouselData = createAsyncThunk(
  'carousel/fetchCarouselData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/carousel/get');
      return response.data; 

    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch carousel data');
    }
  }
);

const carouselSlice = createSlice({
  name: 'carousel',
  initialState: {
    slides: [],
    status: 'idle', 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarouselData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCarouselData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.slides = action.payload;
      })
      .addCase(fetchCarouselData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default carouselSlice.reducer;