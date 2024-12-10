import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }


  // Get the JWT token from localStorage or sessionStorage
  getToken(): string | null {
    return localStorage.getItem('token');  // Or sessionStorage
  }

  // Optionally set the JWT token when logging in
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Remove the token when logging out
  removeToken(): void {
    localStorage.removeItem('token');
  }

  login(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, userData);  // API endpoint to create a project
  }
}
