import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../api/AxiosInterceptor';
import { Bounce, toast } from 'react-toastify';
import { fetchWishlist } from './wishlistSlice';
import { fetchCartData } from './cartSlice';

const initialState = {
  loading: false,
  user: null,        // store your signed-in user data here
  error: null,
  id: null
};

export const signInUser = createAsyncThunk(
  'auth/signInUser',
  async (payload , { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/signin', payload);
      toast.success(response?.message || 'Signed in');
      if(response.success)
      {
        payload.setModel("otp");
      }
      return response; 
      
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error signing in');
      return rejectWithValue(error.response?.data);
    }
  }
);
export const otpVerify = createAsyncThunk(
  'auth/otpVerify',
  async (payload, { rejectWithValue , dispatch }) => {
    try {
      const response = await axiosInstance.post('/auth/verify-otp', {id:payload.id, otp:payload.otp} , {withCredentials:true});
      localStorage.setItem("token", response?.token);

      if(response.success)
      {
        dispatch(getuserprofile());
      }

      toast.success(response?.message || 'Verified');
      if(response.success)
      {
        payload?.data();
        dispatch(fetchWishlist());
        dispatch(fetchCartData());
        
      }
      return response; 
      
    } catch (error) {
      payload?.setIsVerifying(false);
      toast.error(error?.response?.data?.message || 'Error signing in');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const resendOTP = createAsyncThunk(
  'auth/resendOTP',
  async (payload, { rejectWithValue }) => {
    try {

    const response = await axiosInstance.post('/auth/resend-otp', {id:payload.id , otp:payload.otp});
    if(response.success)
    {
      payload?.setResendTimer(120);
    }
      toast.success(response?.message || 'Resend OTP');
      return response; 
      
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error Resend OTP');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateuserprofile = createAsyncThunk(
  'auth/updateuserprofile',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/update', payload);
      toast.success(response?.message || 'Profile updated');
      return response;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error updating profile');
      return rejectWithValue(error.response?.data);
    }
  }

);

export const getuserprofile = createAsyncThunk(
  'auth/getuserprofile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/auth/getuser');
     
      return response;
    } catch (error) {
     
      return rejectWithValue(error.response?.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState:{
    profile:[]
  },
  reducers:{},
  extraReducers: (builder) => {
    builder
      .addCase(signInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload._id) {
          state.id = action.payload._id;
          state.user = action.payload;
        }
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getuserprofile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getuserprofile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getuserprofile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default authSlice.reducer;