import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../../../core/constants/api.constants';
import { GovernmentUserRegistration } from '../../../core/models/user-registration';
import { ApiResponse } from '../../../core/models/api.response';
import { GovernmentUser } from '../models/government-user';

@Injectable({
  providedIn: 'root',
})
export class GovernmentUserService {
  private http = inject(HttpClient);

  private authUrl = `${API.BASE_URL}${API.AUTH}`;

  private governmentUserUrl = `${API.BASE_URL}/government-users`;

  register(data: GovernmentUserRegistration): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.authUrl}/register`, data);
  }

  getAll(filters?: {
    search?: string;

    role?: string;

    status?: string;

    page?: number;

    limit?: number;
  }) {
    let params: any = {};

    if (filters?.search) params.search = filters.search;

    if (filters?.role) params.role = filters.role;

    if (filters?.status) params.status = filters.status;

    params.page = filters?.page ?? 1;

    params.limit = filters?.limit ?? 10;

    return this.http.get<ApiResponse<GovernmentUser[]>>(
      this.governmentUserUrl,

      { params },
    );
  }

  getById(userId: string) {
    return this.http.get<ApiResponse<GovernmentUser>>(`${API.BASE_URL}/government-users/${userId}`);
  }

  update(userId: string, data: GovernmentUserRegistration): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.governmentUserUrl}/${userId}`, data);
  }
  toggleStatus(userId: string) {
    return this.http.patch<ApiResponse<any>>(`${this.governmentUserUrl}/${userId}/status`, {});
  }
}
