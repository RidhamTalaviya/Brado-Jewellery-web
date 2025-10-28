import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/AxiosInterceptor';

export const fetchCollectionsData = createAsyncThunk(
  '/fetchCollectionsData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/category/getActive');
      return response.data; 


    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch  data');
    }
  }
);

export const fetchCollectionsDataById = createAsyncThunk(
  '/fetchCollectionsDataById',
  async (categoryName, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/category/getone?slug=${categoryName}`);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data );
    }
  }
);

const collectionsSlice = createSlice({
  name: 'collections',
  initialState: {
    collections: [],
    collectionsById: [],
    status: 'idle', 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollectionsData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCollectionsData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.collections = action.payload;
      })
      .addCase(fetchCollectionsData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

      builder
      .addCase(fetchCollectionsDataById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCollectionsDataById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.collectionsById = action.payload;
      })
      .addCase(fetchCollectionsDataById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default collectionsSlice.reducer;