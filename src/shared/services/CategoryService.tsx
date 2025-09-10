// java/spring_boot/userlogin2508_vitereactts/src/shared/services/CategoryService.tsx

import axios, { AxiosResponse } from 'axios';
import { ICategory, IApiResponse } from '@/shared/types/interfaces';

const REST_API_BASE_URL = 'http://localhost:9191/api/categories';

// ------------------ LIST / READ ------------------

// List all categories
export const listCategories = (): Promise<AxiosResponse<IApiResponse<ICategory[]>>> =>
  axios.get<IApiResponse<ICategory[]>>(REST_API_BASE_URL);

// Get category by ID
export const getCategoryById = (
  id: number
): Promise<AxiosResponse<IApiResponse<ICategory | null>>> =>
  axios.get<IApiResponse<ICategory | null>>(`${REST_API_BASE_URL}/${id}`);

// Get category by Name
export const getCategoryByName = (
  name: string
): Promise<AxiosResponse<IApiResponse<ICategory | null>>> =>
  axios.get<IApiResponse<ICategory | null>>(`${REST_API_BASE_URL}/name/${name}`);

// ------------------ CREATE ------------------

// Create a single category
export const createCategory = (
  category: ICategory
): Promise<AxiosResponse<IApiResponse<ICategory>>> =>
  axios.post<IApiResponse<ICategory>>(REST_API_BASE_URL, category);

// Create multiple categories (bulk)
export const createCategoriesBulk = (
  categories: ICategory[]
): Promise<AxiosResponse<IApiResponse<ICategory[]>>> =>
  axios.post<IApiResponse<ICategory[]>>(`${REST_API_BASE_URL}/bulk`, categories);

// ------------------ UPDATE ------------------

// Update a category by ID
export const updateCategory = (
  id: number,
  category: ICategory
): Promise<AxiosResponse<IApiResponse<ICategory>>> =>
  axios.put<IApiResponse<ICategory>>(`${REST_API_BASE_URL}/${id}`, category);

// ------------------ DELETE ------------------

// Delete a category by ID
export const deleteCategory = (
  id: number
): Promise<AxiosResponse<IApiResponse<ICategory>>> =>
  axios.delete<IApiResponse<ICategory>>(`${REST_API_BASE_URL}/${id}`);
