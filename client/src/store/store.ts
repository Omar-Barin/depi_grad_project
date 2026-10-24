import { configureStore } from '@reduxjs/toolkit';
import productReducer from '@/store/product.slice';

const store = configureStore({
    reducer: {
        products: productReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
