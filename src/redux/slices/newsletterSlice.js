import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/AxiosInterceptor";
import { Bounce, Flip, toast } from "react-toastify";

export const createNewsletter = createAsyncThunk(
  "newsletter/create",
  async (payload, { rejectWithValue }) => {
    try {
      
      const response = await axiosInstance.post("/newsletter/create", {email:payload.email});
      toast.success(response?.message || 'Newsletter created successfully', {
        transition: Flip,
      });
      console.log(response, "response")
      if(response.success)
        {
          payload.setEmail("");
        }
      return response.data;
      
      
    } catch (error) {
      console.log( error, "234567890-=")
        toast.error(error?.response?.data?.error || 'Error creating newsletter', {
            transition: Bounce,
          });
      return rejectWithValue(error.response.data.er);
    }
  }
);

const newsletterSlice = createSlice({
  name: "newsletter",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewsletter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewsletter.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createNewsletter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default newsletterSlice.reducer;
