// java/spring_boot/userlogin2508_vitereactts/src/shared/services/CategoryService.tsx

import axios, { AxiosResponse } from 'axios';
import { ICategory } from '@/shared/types/interfaces/models/ICategory.type';

const REST_API_BASE_URL = 'http://localhost:9191/api/categories';

// Generic API response type
export type ApiResponse<T> = T | { error: string } | string;

// List all categories
export const listCategories = (): Promise<AxiosResponse<ApiResponse<ICategory[]>>> =>
  axios.get<ApiResponse<ICategory[]>>(REST_API_BASE_URL);

// Create a new category
export const createCategory = (
  category: ICategory
): Promise<AxiosResponse<ApiResponse<ICategory>>> =>
  axios.post<ApiResponse<ICategory>>(REST_API_BASE_URL, category);

// Create multiple categories (bulk)
export const createCategoriesBulk = (
  categories: ICategory[]
): Promise<AxiosResponse<ApiResponse<ICategory[]>>> =>
  axios.post<ApiResponse<ICategory[]>>(`${REST_API_BASE_URL}/bulk`, categories);

// Get category by ID
export const getCategoryById = (
  id: number
): Promise<AxiosResponse<ApiResponse<ICategory | null>>> =>
  axios.get<ApiResponse<ICategory | null>>(`${REST_API_BASE_URL}/${id}`);

// Get category by Name
export const getCategoryByName = (
  name: string
): Promise<AxiosResponse<ApiResponse<ICategory | null>>> =>
  axios.get<ApiResponse<ICategory | null>>(`${REST_API_BASE_URL}/name/${name}`);

// Update category
export const updateCategory = (
  id: number,
  category: ICategory
): Promise<AxiosResponse<ApiResponse<ICategory>>> =>
  axios.put<ApiResponse<ICategory>>(`${REST_API_BASE_URL}/${id}`, category);

// Delete category
export const deleteCategory = (
  id: number
): Promise<AxiosResponse<{ message?: string; error?: string }>> =>
  axios.delete<{ message?: string; error?: string }>(`${REST_API_BASE_URL}/${id}`);
