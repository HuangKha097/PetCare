import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getWishlist, toggleWishlistItem } from '../../services/wishlistService';

export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, { rejectWithValue }) => {
    try {
        const response = await getWishlist();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
});

export const toggleWishlist = createAsyncThunk('wishlist/toggleWishlist', async (productId, { rejectWithValue }) => {
    try {
        const response = await toggleWishlistItem(productId);
        return { productId, action: response.data.action };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update wishlist');
    }
});

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(toggleWishlist.fulfilled, (state, action) => {
                // If added, we might need a full product object, but for toggle usually we just re-fetch
                // or handle it locally if we have the product info.
                // For simplicity, let's just mark as succeeded and we'll re-fetch in components if needed
                // or filter out if removed.
                if (action.payload.action === 'removed') {
                    state.items = state.items.filter(item => item.id !== action.payload.productId);
                }
            });
    },
});

export default wishlistSlice.reducer;
