export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface ApiErrorResponse {
  message: string;
}

export interface CitySuggestion {
  name: string;
  country: string;
  lat: number;
  lon: number;
}
