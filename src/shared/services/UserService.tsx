// java/spring_boot/userlogin2508_vitereactts/src/shared/services/UserService.ts

import axios, { AxiosResponse } from 'axios';
import { IUser } from '@/shared/types/interfaces/models/IUser.type';

const REST_API_BASE_URL = 'http://localhost:9191/api/users';

// Get all users
export const listUsers = (): Promise<AxiosResponse<IUser[]>> =>
  axios.get<IUser[]>(REST_API_BASE_URL);

// Create single user
export const createUser = (user: IUser): Promise<AxiosResponse<IUser | string>> =>
  axios.post<IUser | string>(REST_API_BASE_URL, user);

// Create multiple users
export const createUsersBulk = (users: IUser[]): Promise<AxiosResponse<IUser[] | string>> =>
  axios.post<IUser[] | string>(`${REST_API_BASE_URL}/bulk`, users);

// Get user by ID
export const getUserById = (id: number): Promise<AxiosResponse<IUser | string>> =>
  axios.get<IUser | string>(`${REST_API_BASE_URL}/${id}`);

// Get user by Name
export const getUserByName = (name: string): Promise<AxiosResponse<IUser | string>> =>
  axios.get<IUser | string>(`${REST_API_BASE_URL}/name/${name}`);

// Get user by Email
export const getUserByEmail = (email: string): Promise<AxiosResponse<IUser | string>> =>
  axios.get<IUser | string>(`${REST_API_BASE_URL}/email/${email}`);

// Get users by Category ID
export const getUsersByCategoryId = (categoryId: number): Promise<AxiosResponse<IUser[]>> =>
  axios.get<IUser[]>(`${REST_API_BASE_URL}/category/${categoryId}`);

// Update user (requires ID in path)
export const updateUser = (id: number, user: IUser): Promise<AxiosResponse<IUser | string>> =>
  axios.put<IUser | string>(`${REST_API_BASE_URL}/${id}`, user);

// Delete user
export const deleteUser = (
  id: number
): Promise<AxiosResponse<{ message?: string; error?: string }>> =>
  axios.delete<{ message?: string; error?: string }>(`${REST_API_BASE_URL}/${id}`);
