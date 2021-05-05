import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http'
import {Router} from '@angular/router'
import { Observable,throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ToastService } from '../common_Provider/toast-service/toast.service';

@Injectable()
export class InterceptorsService implements HttpInterceptor{

  constructor(private toastService:ToastService,private router:Router) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('user_token');
  
    if (token) {
      request = request.clone({
        setHeaders: {
          // 'Authorization': 'emis_dev'
        //   'Authorization' : 'emis_dev',
        // 'Content-Type'  : 'application/json',
        'Token' 		  : token 	
        }
      });
    }
    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        setHeaders: {
          'Authorization': 'emis_dev',
          'Content-type': 'application/json'
        }
      });
    }
    request = request.clone({
      headers: request.headers.set('Accept', 'application/json')
    });
  
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
         // console.log('event--->>>', event);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          if (error.error.success === false) {
            this.toastService.presentToast('Login failed','');
          } else {
            this.router.navigate(['/']);
          }
        }
        return throwError(error);
      }));
  }
  
}
