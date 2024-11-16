import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthRequest } from '../interfaces/auth-request.interface';
import { Observable } from 'rxjs';
import { AuthSuccessResponse } from '../interfaces/auth-success-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(payload: AuthRequest): Observable<AuthSuccessResponse> {
    return this.http.post<AuthSuccessResponse>('/api/login', payload);
  }
}
