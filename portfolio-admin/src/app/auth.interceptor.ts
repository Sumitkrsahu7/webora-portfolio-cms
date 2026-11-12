import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AdminSessionService } from './admin-session.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(AdminSessionService);
  const isProtectedEndpoint =
    req.url.includes('/api/admin/') || req.url.includes('/api/auth/logout');

  let authReq = req;
  if (isProtectedEndpoint && !req.headers.has('Authorization')) {
    const token = session.getToken();
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }

  return next(authReq).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        req.url.includes('/api/admin/')
      ) {
        session.notifyUnauthorized();
      }
      return throwError(() => error);
    })
  );
};
