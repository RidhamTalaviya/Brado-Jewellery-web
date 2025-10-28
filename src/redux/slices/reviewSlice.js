import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/AxiosInterceptor';

export const fetchReviewData = createAsyncThunk(
  '/review',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/review/get');
      return response.data; 


    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch  data');
    }
  }
);

export const createReview = createAsyncThunk(
  '/review/create',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/review/create', reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create review');
    }
  }
);

const collectionsSlice = createSlice({
  name: 'review',
  initialState: {
    review: [],
    status: 'idle', 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReviewData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.review = action.payload;
      })
      .addCase(fetchReviewData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default collectionsSlice.reducer;