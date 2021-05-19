import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export const whitelist = ['https://bypass.this.domain.com'];

@Injectable()
export class InterceptorService implements HttpInterceptor {
  // Interceptor
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.requestHandler(request)).pipe(
      retry(2),
      catchError((error: HttpErrorResponse) => {
        let errorCode = 0;
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = error.error.message;
        } else {
          // Server-side error
          errorCode = error.status;
          errorMessage = error.statusText;
        }
        this.MatSnackBar.open(`Error${errorCode ? ' ' + errorCode + ': ' : ': '} ${errorMessage}`, 'DISMISS', {
          duration: 10000
        });
        return throwError(errorMessage);
      })
    );
  }

  // Request Handler - Handle as-is if header has "skip" / matches url in whitelist, modify if not
  requestHandler(origRequest: HttpRequest<any>): HttpRequest<any> {
    let modRequest = origRequest;
    if (origRequest.headers.has('skip') || this.skipList(origRequest)) {
      // Bypass Modifications
      modRequest = origRequest.clone({ headers: origRequest.headers.delete('skip') });
      return modRequest;
    } else {
      // Modify Requests
      modRequest = origRequest.clone({
        setHeaders: {
          'X-Example-Header': 'applied-from-interceptor'
        }
      });
      return modRequest;
    }
  }

  // Skip List - to process urls from whitelist
  skipList(request: HttpRequest<any>): boolean {
    return whitelist.includes(request.url);
  }

  constructor(private MatSnackBar: MatSnackBar) {}
}
