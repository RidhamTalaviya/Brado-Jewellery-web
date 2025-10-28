import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../api/AxiosInterceptor';

const initialState = {
    loading: true,
    users: [],
    user: {},
    editId: '',
    isCreating: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        getUsers: (state, action) => {
            state.users = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setIsCreating: (state, action) => {
            state.isCreating = action.payload;
        },
        setIseditId: (state, action) => {
            state.editId = action.payload;
        },
    }
});

export const getUserLists = createAsyncThunk('getUserLists', async (_, { dispatch }) => {
    dispatch(setLoading(true));
    try {
        const response = await axiosInstance.get('user/get');

        if (response?.success) {
            dispatch(getUsers(response.data));
            dispatch(setLoading(false));
        }
        else {
            dispatch(getUsers([]));
            dispatch(setLoading(false));
        }
    } catch (error) {
        dispatch(getUsers([]));
        dispatch(setLoading(false));
    }
});

export const createUser = createAsyncThunk('createUser', async (payload, { dispatch }) => {
    dispatch(setIsCreating(true));
    try {
        const response = await axiosInstance.put('user/create', payload);

        if (response?.success) {
            dispatch(setIsCreating(false));
            dispatch(getUserLists());
            // toast
        }
        else {
            dispatch(setIsCreating(false));
            // toast
        }
    } catch (error) {
        dispatch(setIsCreating(false));
        // toast
    }
});

export const updateUser = createAsyncThunk('updateUser', async (payload, { dispatch }) => {
    dispatch(setIsCreating(true));
    try {
        const response = await axiosInstance.put('user/update', payload);

        if (response?.success) {
            dispatch(setIsCreating(false));
            dispatch(getUserLists());
            dispatch(setIseditId(''));
            // toast
        }
        else {
            dispatch(setIsCreating(false));
            // toast
        }
    } catch (error) {
        dispatch(setIsCreating(false));
        // toast
    }
});

export const getUser = createAsyncThunk('getUser', async (userId, { dispatch }) => {
    try {
        const response = await axiosInstance.get(`user/get/${userId}`);

        if (response?.success) {
            const data = response.data;
            dispatch(setIseditId(data?._id));
            dispatch(setUser(data));
        }
        else {
            // toast
        }
    } catch (error) {
        // toast
    }
});

export const deleteUser = createAsyncThunk('deleteUser', async (deleteId, { dispatch }) => {
    try {
        const response = await axiosInstance.delete(`user/delete/${deleteId}`);

        if (response?.success) {
            dispatch(getUserLists());
            // toast
        }
        else {
            // toast
        }
    } catch (error) {
        // toast
    }
});

export const { getUsers, setUser, setLoading, setIseditId, setIsCreating } = userSlice.actions;

export default userSlice.reducer;
