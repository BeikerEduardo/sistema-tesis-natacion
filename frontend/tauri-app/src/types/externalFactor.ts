export interface ExternalFactorCore {
    id: number;
    athleteId: number;
    trainingId: number;

    factorType: string;
    description: string;
    severity: number;

    startDate: string;
    endDate: string;

    performanceImpact: number;

    notes?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ExternalFactor extends ExternalFactorCore {
    id: number;  
}

export type ExternalFactorCreate = Omit<ExternalFactorCore, 'id'>;
export type ExternalFactorUpdate = Partial<ExternalFactorCore>;