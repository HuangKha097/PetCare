import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

// Async Thunks
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
    try {
        const response = await API.get('/cart');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity }, { rejectWithValue }) => {
    try {
        const response = await API.post('/cart', { productId, quantity });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ cartItemId, quantity }, { rejectWithValue }) => {
    try {
        const response = await API.put(`/cart/${cartItemId}`, { quantity });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
    }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (cartItemId, { rejectWithValue }) => {
    try {
        const response = await API.delete(`/cart/${cartItemId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
    }
});

const initialState = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
    status: 'idle', // idle | loading | succeeded | failed
    error: null
};

const calculateTotals = (items) => {
    const totalQuantity = items.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0);
    const totalAmount = items.reduce((total, item) => total + (parseFloat(item.price) * parseInt(item.quantity)), 0);
    return { totalQuantity, totalAmount };
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCartLocal: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Cart
            .addCase(fetchCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
                const { totalQuantity, totalAmount } = calculateTotals(action.payload);
                state.totalQuantity = totalQuantity;
                state.totalAmount = totalAmount;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Add To Cart
            .addCase(addToCart.fulfilled, (state, action) => {
                state.items = action.payload;
                const { totalQuantity, totalAmount } = calculateTotals(action.payload);
                state.totalQuantity = totalQuantity;
                state.totalAmount = totalAmount;
            })
            // Update Item
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.items = action.payload;
                const { totalQuantity, totalAmount } = calculateTotals(action.payload);
                state.totalQuantity = totalQuantity;
                state.totalAmount = totalAmount;
            })
            // Remove Item
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = action.payload;
                const { totalQuantity, totalAmount } = calculateTotals(action.payload);
                state.totalQuantity = totalQuantity;
                state.totalAmount = totalAmount;
            });
    }
});

export const { clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
