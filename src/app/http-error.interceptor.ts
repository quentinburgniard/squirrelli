import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

const LOGIN_URL = new URL('https://id.digitalleman.com');
LOGIN_URL.searchParams.set('r', 'true');
const HANDLED_HTTP_ERRORS = [401, 403];

export const httpErrorInterceptor: HttpInterceptorFn = (request, next) =>
  next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && HANDLED_HTTP_ERRORS.includes(error.status)) {
        window.location.assign(LOGIN_URL);
      }

      return throwError(() => error);
    }),
  );
