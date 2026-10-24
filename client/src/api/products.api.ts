import axios from 'axios';
import type { Product } from '@/types/product';

export async function getAllProductsApi() {
    const data = await axios.get(`http://localhost:8000/products`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return data;
}
export async function getProductApi(id: number) {
    const data = await axios.get(`http://localhost:8000/products/${id}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return data;
}

export async function addProductApi(product: Product) {
    const data = await axios.post(`http://localhost:8000/product`, product, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return data;
}

export async function updateProductApi(id: number, product: Product) {
    const data = await axios.put(`http://localhost:8000/products/${id}`, product, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return data;
}

export async function deleteProductApi(id: number) {
    const data = await axios.delete(`http://localhost:8000/products/${id}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return data;
}
