// java/spring_boot/userlogin2508_vitereactts/src/shared/services/UserService.ts

import axios, { AxiosResponse } from 'axios';
import { IUser, IApiResponse } from '@/shared/types/interfaces';

const REST_API_BASE_URL = 'http://localhost:9191/api/users';

// ------------------ LIST / READ ------------------

// Get all users
export const listUsers = (): Promise<AxiosResponse<IApiResponse<IUser[]>>> =>
  axios.get<IApiResponse<IUser[]>>(REST_API_BASE_URL);

// Get user by ID
export const getUserById = (
  id: number
): Promise<AxiosResponse<IApiResponse<IUser | null>>> =>
  axios.get<IApiResponse<IUser | null>>(`${REST_API_BASE_URL}/${id}`);

// Get user by Name
export const getUserByName = (
  name: string
): Promise<AxiosResponse<IApiResponse<IUser | null>>> =>
  axios.get<IApiResponse<IUser | null>>(`${REST_API_BASE_URL}/name/${name}`);

// Get user by Email
export const getUserByEmail = (
  email: string
): Promise<AxiosResponse<IApiResponse<IUser | null>>> =>
  axios.get<IApiResponse<IUser | null>>(`${REST_API_BASE_URL}/email/${email}`);

// Get users by Category ID
export const getUsersByCategoryId = (
  categoryId: number
): Promise<AxiosResponse<IApiResponse<IUser[]>>> =>
  axios.get<IApiResponse<IUser[]>>(`${REST_API_BASE_URL}/category/${categoryId}`);

// ------------------ CREATE ------------------

// Create a single user
export const createUser = (
  user: IUser
): Promise<AxiosResponse<IApiResponse<IUser>>> =>
  axios.post<IApiResponse<IUser>>(REST_API_BASE_URL, user);

// Create multiple users (bulk)
export const createUsersBulk = (
  users: IUser[]
): Promise<AxiosResponse<IApiResponse<IUser[]>>> =>
  axios.post<IApiResponse<IUser[]>>(`${REST_API_BASE_URL}/bulk`, users);

// ------------------ UPDATE ------------------

// Update a user by ID
export const updateUser = (
  id: number,
  user: IUser
): Promise<AxiosResponse<IApiResponse<IUser>>> =>
  axios.put<IApiResponse<IUser>>(`${REST_API_BASE_URL}/${id}`, user);

// ------------------ DELETE ------------------

// Delete a user by ID
export const deleteUser = (
  id: number
): Promise<AxiosResponse<IApiResponse<IUser>>> =>
  axios.delete<IApiResponse<IUser>>(`${REST_API_BASE_URL}/${id}`);
