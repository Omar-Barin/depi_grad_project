import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@/types/product';
import {
    addProductApi,
    deleteProductApi,
    getAllProductsApi,
    getProductApi,
    updateProductApi,
} from '@/api/products.api';

interface ProductState {
    productList: Product[];
    product: Product;
    loading: boolean;
    error: string | null;
    isUpdate: boolean;
}

const initialState: ProductState = {
    productList: [],
    product: {
        id: null,
        name: null,
        description: null,
        price: null,
        quantity: null,
    },
    loading: false,
    error: null,
    isUpdate: false
};

export const getProducts = createAsyncThunk('product/getProducts', async () => {
    const res = await getAllProductsApi();
    return res.data as Product[];
});

export const getProduct = createAsyncThunk('product/getProduct', async (id: number) => {
    const res = await getProductApi(id);
    return res.data as Product;
});

export const createProduct = createAsyncThunk('product/createProduct', async (product: Product, thunkApi) => {
    const res = await addProductApi(product);
    const added = res.data as Product;

    // optional: reload the list after adding
    thunkApi.dispatch(getProducts());

    return added;
});

export const updateProduct = createAsyncThunk(
    'product/updateProduct',
    async (payload: { id: number; product: Product }, thunkApi) => {
        const res = await updateProductApi(payload.id, payload.product);

        thunkApi.dispatch(getProducts())
        return res.data as Product;
    }
);

export const deleteProduct = createAsyncThunk('product/deleteProduct', async (id: number) => {
    await deleteProductApi(id);

    // return id so reducer can remove from list even if API returns empty body
    return id;
});

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        editField: (state, action: PayloadAction<{ name: string; value: string | number | null }>) => {
            const { name, value } = action.payload;
            state.product = {
                ...state.product,
                [name]: value,
            };
        },
        clearForm: (state) => {
            (Object.keys(state.product) as Array<keyof Product>).forEach((k) => {
                state.product[k] = null;
            });
        },
        fillForm: (state, action: PayloadAction<{ id: number }>) => {
            const { id } = action.payload;
            const productToEdit = state.productList.find((p: Product) => p.id === id);
            if (productToEdit) {
                state.product = { ...productToEdit };
                state.isUpdate = true;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.productList = action.payload;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Failed to load products';
            })
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.productList.push(action.payload);
                state.product = action.payload;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Failed to add product';
            })
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.isUpdate = false;
                state.productList = state.productList.map((p) => (p.id === action.payload.id ? action.payload : p));
                state.product = action.payload;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Failed to update product';
            })
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.productList = state.productList.filter((p) => p.id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Failed to delete the product';
            });
    },
});

export const { editField, clearForm, fillForm } = productSlice.actions;

export default productSlice.reducer;
