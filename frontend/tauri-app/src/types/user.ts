
export interface UserCore {
    id: string;
    
    name: string;
    email: string;
    password: string;
    role: string;

    createdAt?: string | Date;
    updatedAt?: string | Date;
}

export interface User extends UserCore {
    id: string;
    token?: string;
} 

export type UserCreate = UserCore;
export type UserUpdate = Partial<UserCore>;