export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface BMIResult {
  bmi: number;
  category: string;
  advice: string;
}

export interface MenstruationResult {
  nextPeriodStart: Date;
  ovulationDate: Date;
  fertileWindowStart: Date;
  fertileWindowEnd: Date;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}