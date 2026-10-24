import axios from 'axios';
import type { Product } from '@/types/product';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function getAllProductsApi() {
    const data = await axios.get(`${BASE_URL}/products`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return data;
}

export async function getProductApi(id: number) {
    const data = await axios.get(`${BASE_URL}/products/${id}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return data;
}

export async function addProductApi(product: Product) {
    const data = await axios.post(`${BASE_URL}/product`, product, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return data;
}

export async function updateProductApi(id: number, product: Product) {
    const data = await axios.put(`${BASE_URL}/products/${id}`, product, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return data;
}

export async function deleteProductApi(id: number) {
    const data = await axios.delete(`${BASE_URL}/products/${id}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return data;
}
