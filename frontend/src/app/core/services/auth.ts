import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  logout(): void {
    localStorage.clear();
     
  }

  getUsername() {
    const user = this.getUser();
    return user?.username;
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  /**
 * Returns the complete logged in user
 */
getCurrentUser(): any {

  return this.getUser();

}

/**
 * Returns the officer's full name
 */
getFullName(): string {

  return this.getCurrentUser()?.profile?.fullName ?? '';

}

/**
 * Returns the officer's designation
 */
getDesignation(): string {

  return this.getCurrentUser()?.profile?.designation ?? '';

}

/**
 * Returns the officer's initials
 * Example:
 * Onesmus Kamau -> OK
 * Steve Biko -> SB
 */
getInitials(): string {

  const fullName = this.getFullName();

  if (!fullName) {

    return this.getUsername()?.charAt(0).toUpperCase() ?? '';

  }

  return fullName
    .trim()
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();

}
}
