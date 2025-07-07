// Base interface with common fields for athletes (without ID and timestamps)
export interface AthleteBase {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    category?: string;
    height?: number;
    weight?: number;
    gender?: 'male' | 'female' | 'other';
    phone?: string;
    email?: string;
    coachId?: number;
}

// Complete athlete with ID and timestamps
export interface Athlete extends AthleteBase {
    id: number;
    createdAt?: string;
    updatedAt?: string;
}

// For creating a new athlete: all required fields without ID or timestamps
export type AthleteCreate = AthleteBase;

// For updating an athlete: all fields are optional
export type AthleteUpdate = Partial<AthleteBase> & { id: number };