import { Athlete } from "./athlete";
import { ExternalFactor } from "./externalFactor";
import { TrainingDetail } from "./trainingDetail";

export type TrainingIntensity = 'baja' | 'media' | 'alta';
export type TrainingStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
export type TrainingType = 'resistance' | 'speed' | 'technique' | 'mixed' | 'other';
export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'other';

export type SwimStyle = 'freestyle' | 'backstroke' | 'breaststroke' | 'butterfly' | 'medley' | 'other';

export interface TrainingCore {
  id: number;

  title: string;
  description: string;
  location: string;
  status: TrainingStatus;

  date: string;
  trainingType: TrainingType;

  // Training details
  durationMinutes: number;

  // Weather Data
  isOutdoor: boolean;
  temperature: number;
  humidity: number;
  weatherCondition: WeatherCondition | null;

  athleteId: number;
  coachId: number;

  // Heart Rate data
  heartRateRest: number | null;
  heartRateDuring: number | null;
  heartRateAfter: number | null;

  // Weight data
  weightBefore: number | null;
  weightAfter: number | null;

  // Breathing data
  breathingPattern: string | null;

  // Physical state data
  physicalStateRating: number | null;
  painReported: string | null;

  // Equipment data
  swimsuitType: string | null;
  equipmentUsed: string | null;

  // Notes
  notes: string | null;

  // Time data
  startTime: string;
  endTime: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface Training extends TrainingCore {
  id: number;

  athlete?: Athlete | null;

  details?: TrainingDetail[];

  externalFactors?: ExternalFactor[];
}

export interface TrainingCreate extends TrainingCore {
  details?: TrainingDetail[];
  externalFactors?: ExternalFactor[];
}
export type TrainingUpdate = Partial<TrainingCore>;

