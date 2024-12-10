import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})

export class PositionService {

  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }


  // Get the JWT token from localStorage or sessionStorage

  getAllPositionByProjectId(projectId: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}` // Add the token to the Authorization header
    });
        let params = new HttpParams();
    params = params.append('project_id', projectId);
    return this.http.get(`${this.apiUrl}/position`, { params: params, headers: headers });  // API endpoint to create a project
  }
  
  deletePosition(positionId: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}` // Add the token to the Authorization header
    });
  
    // Use positionId in the URL
    return this.http.delete(`${this.apiUrl}/delete-position/${positionId}`, { headers: headers });
  }


  getAllDepartments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/departments`);
}
 
  createPosition(positionData: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}` // Add the token to the Authorization header
    });
  return this.http.post(`${this.apiUrl}/position/create`, positionData ,{ headers: headers });
}
    
}
