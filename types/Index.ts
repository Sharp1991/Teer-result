// types/index.ts

export interface TeerResult {
  id: string;
  date: string;
  resultDate: string; // Display date
  firstRound: number;
  secondRound: number;
  venue?: string;
  time?: string;
}

export interface ApiResponse {
  success: boolean;
  data: TeerResult[] | TeerResult;
  message?: string;
  timestamp?: string;
}

export interface SearchFilters {
  fromDate?: string;
  toDate?: string;
  venue?: string;
}

// For form inputs
export interface ResultFormData {
  date: string;
  firstRound: string;
  secondRound: string;
  venue: string;
}

// For API error responses
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

// For pagination
export interface PaginatedResponse {
  results: TeerResult[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// For calendar dates with results
export interface CalendarDate {
  date: string;
  hasResult: boolean;
  result?: TeerResult;
}
