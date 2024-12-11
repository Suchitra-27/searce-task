import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})

export class ProjectService {

  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient,
    private authService: AuthService
  ) { }


  // Get the JWT token from localStorage or sessionStorage

    getAllProject(): Observable<any> {
      const token = this.authService.getToken();
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}` // Add the token to the Authorization header
      });
    return this.http.get(`${this.apiUrl}/projects`, { headers });  // API endpoint to create a project
    }
    
  getCoPlanners(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}` // Add the token to the Authorization header
    });
        return this.http.get(`${this.apiUrl}/cfo-list`, { headers });
    }
  createProject(projectData: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}` // Add the token to the Authorization header
    });
        return this.http.post(`${this.apiUrl}/projects/create`, projectData, { headers });
      }
}
