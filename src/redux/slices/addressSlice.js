import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/AxiosInterceptor';

export const fetchAddressData = createAsyncThunk(
  'address/get',
  async (_, { rejectWithValue }) => {
    try {   
      const response = await axiosInstance.get('/address/get');

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch data');
    }
  }
); 

export const createAddressData = createAsyncThunk(
  'address/create',
  async (addressData, { rejectWithValue, dispatch }) => {
    try {   
      const response = await axiosInstance.post('/address/create', addressData);
      if(response?.success){
        dispatch(fetchAddressData());
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create address');
    }
  }
);

export const removeAddressData = createAsyncThunk(
  'address/remove',
  async (addressId, { rejectWithValue, dispatch }) => {
    try {   
      const response = await axiosInstance.put(`/address/delete/${addressId}`);
      if(response?.success){
        dispatch(fetchAddressData());
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete address');
    }
  }
);

export const updateAddressData = createAsyncThunk(
  'address/update',
  async ({ id, addressData }, { rejectWithValue, dispatch }) => {
    try {   
      const response = await axiosInstance.put(`/address/update/${id}`, addressData);
      if(response?.success){
        dispatch(fetchAddressData());
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update address');
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    addresses: [],
    status: 'idle', 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddressData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAddressData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.addresses = action.payload || [];
      })
      .addCase(fetchAddressData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createAddressData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createAddressData.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(createAddressData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateAddressData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateAddressData.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(updateAddressData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(removeAddressData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeAddressData.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(removeAddressData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default addressSlice.reducer;