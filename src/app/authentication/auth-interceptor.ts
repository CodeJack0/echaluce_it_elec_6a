
import { Injectable } from '@angular/core';
import {HttpInterceptor,HttpRequest,HttpHandler,HttpEvent} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    if (token) {
      const authRequest = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });
      console.log('Token added to request:', token); 
      return next.handle(authRequest);
    }
    return next.handle(req);
  }
}
