// file to grab token!
import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  intercept(req, next) {
    var authRequest = req.clone({
      headers: req.headers.set('Authorization', 'token' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1YjBjYTQ5MmJmNzYzNjBlM2JjYTViMTUifQ.Yp8-FTf0xXabP5R9_j3NN97M8Ijf-sAroOWr6dFAAxc'),
    });
    return next.handle(authRequest);
  }
}