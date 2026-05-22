import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCart, addItemToCart, updateCartItemQty, removeCartItem } from '../../services/cartService';

// Helper: extract items from response (supports both old flat array and new {items, notifications} format)
const extractCartData = (data) => {
    if (Array.isArray(data)) {
        return { items: data, notifications: [] };
    }
    return { items: data.items || [], notifications: data.notifications || [] };
};

// Async Thunks
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
    try {
        const response = await getCart();
        return extractCartData(response.data);
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity }, { rejectWithValue }) => {
    try {
        const response = await addItemToCart(productId, quantity);
        return extractCartData(response.data);
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ cartItemId, quantity }, { rejectWithValue }) => {
    try {
        const response = await updateCartItemQty(cartItemId, quantity);
        return extractCartData(response.data);
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
    }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (cartItemId, { rejectWithValue }) => {
    try {
        const response = await removeCartItem(cartItemId);
        return extractCartData(response.data);
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
    }
});

const initialState = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
    notifications: [], // stock-related notifications from server
    status: 'idle', // idle | loading | succeeded | failed
    error: null
};

const calculateTotals = (items) => {
    const totalQuantity = items.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0);
    const totalAmount = items.reduce((total, item) => total + (parseFloat(item.price) * parseInt(item.quantity)), 0);
    return { totalQuantity, totalAmount };
};

const handleCartResponse = (state, payload) => {
    state.items = payload.items;
    state.notifications = payload.notifications;
    const { totalQuantity, totalAmount } = calculateTotals(payload.items);
    state.totalQuantity = totalQuantity;
    state.totalAmount = totalAmount;
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCartLocal: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
            state.notifications = [];
        },
        clearNotifications: (state) => {
            state.notifications = [];
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
                handleCartResponse(state, action.payload);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Add To Cart
            .addCase(addToCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                handleCartResponse(state, action.payload);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Update Item
            .addCase(updateCartItem.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.status = 'succeeded';
                handleCartResponse(state, action.payload);
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Remove Item
            .addCase(removeFromCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                handleCartResponse(state, action.payload);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { clearCartLocal, clearNotifications } = cartSlice.actions;
export default cartSlice.reducer;
