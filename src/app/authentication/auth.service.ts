import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';

interface AuthResponse {
  token: string;
  expiresIn: number;
  userId: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  
  CreateUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    
    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe(response => {
        console.log(response);  
      });
  }

  
  loginUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    
    this.http
      .post<AuthResponse>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        console.log(response);  

        
        if (response && response.token) {
          localStorage.setItem('token', response.token);  
          localStorage.setItem('userId', response.userId);  
        }
      });
  }
}
