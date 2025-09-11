import { ICategory } from './ICategory.type';

export interface IUser {
    id?: number;
    name: string;
    email: string;
    hashedPassword?: string; // stored password (optional on frontend)
    rawPassword?: string;    // input password (optional)
    category: ICategory;     // reference to category
    categoryId: number;     // reference to categoryId
    domain?: string;
    age?: number;
    experience?: number;
    salary?: number;
    imagePath?: string;
    imageName?: string;
}
