export type SwimStyle = 'freestyle' | 'backstroke' | 'breaststroke' | 'butterfly' | 'medley' | 'other';

// TrainingDetail AKA Exercise
export interface TrainingDetailCore {
  id?: string | number;
  trainingId?: number;

  distance?: number;
  swimStyle?: SwimStyle;
  timeSeconds?: number;
  seriesNumber?: number;
  repetitionNumber?: number;
  restIntervalSeconds?: number;
  strokeCount?: number;
  efficiency?: number;
  notes?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface TrainingDetail extends TrainingDetailCore {
  id: string | number;

}

export type TrainingDetailCreate = TrainingDetailCore;
export type TrainingDetailUpdate = Partial<TrainingDetailCore>;