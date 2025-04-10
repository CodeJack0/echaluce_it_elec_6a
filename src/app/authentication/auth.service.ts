import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';

// Define an interface for the response expected from the login request
interface AuthResponse {
  token: string;
  expiresIn: number;
  userId: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  // Method to create a user (sign up)
  CreateUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };

    // Send a POST request to the signup route of the backend
    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe(response => {
        console.log(response);  // Log the response to see if the signup was successful
      });
  }

  // Method to log in a user
  loginUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };

    // Send a POST request to the login route of the backend
    this.http
      .post<AuthResponse>('http://localhost:3000/api/user/login', authData)  // Specify the type of the response
      .subscribe(response => {
        console.log(response);  // Log the response to see the token and user data

        // If the response contains the token, save it in localStorage
        if (response && response.token) {
          localStorage.setItem('token', response.token);  // Store the token
          localStorage.setItem('userId', response.userId);  // Optionally store the userId
          // Optionally store token expiration time
        }
      });
  }
}
