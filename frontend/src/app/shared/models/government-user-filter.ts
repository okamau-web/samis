export interface GovernmentUserFilter {

  search?: string;

  role?: string;

  status?: string;

  page?: number;

  limit?: number;

  sortBy?: string;

  sortOrder?: 'asc' | 'desc';

}