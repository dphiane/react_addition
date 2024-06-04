import axios from 'axios';
import { ProductsInterface, TvaInterface, CategoryInterface } from './types';

const API_URL = 'https://localhost:8000/api';

export const fetchTvas = async (): Promise<TvaInterface[]> => {
  const response = await axios.get(`${API_URL}/tvas`);
  return response.data["hydra:member"];
};

export const fetchCategories = async (): Promise<CategoryInterface[]> => {
  const response = await axios.get(`${API_URL}/categories`);
  return response.data["hydra:member"];
};

export const fetchProducts = async (): Promise<ProductsInterface[]> => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data["hydra:member"];
};

export const deleteProduct = async (productId: number): Promise<void> => {
  await axios.delete(`${API_URL}/products/${productId}`);
};

export const addProduct = async (newProduct: ProductsInterface): Promise<ProductsInterface> => {
  const response = await axios.post(`${API_URL}/products`, newProduct, {
    headers: { 'Content-Type': 'application/ld+json' },
  });
  return response.data;
};

export const updateProduct = async (productId: number, updatedProduct: ProductsInterface): Promise<ProductsInterface> => {
  const response = await axios.put(`${API_URL}/products/${productId}`, updatedProduct, {
    headers: { 'Content-Type': 'application/ld+json' },
  });
  return response.data;
};
