import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/AxiosInterceptor';

export const fetchNecklacesetData = createAsyncThunk(
  '/necklaceset',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/product/get');
      return response.data; 


    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch  data');
    }
  }
);

const collectionsSlice = createSlice({
  name: 'necklaceset',
  initialState: {
    necklaceset: [],
    status: 'idle', 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNecklacesetData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNecklacesetData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.necklaceset = action.payload;
      })
      .addCase(fetchNecklacesetData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default collectionsSlice.reducer;