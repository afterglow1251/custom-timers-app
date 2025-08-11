import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, from, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import {
  AUTH_ENDPOINTS,
  AUTH_WHITELIST,
} from '../constants/auth-endpoints.const';

const urlsWithoutToken = new Set<string>(AUTH_WHITELIST);

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);

  if (urlsWithoutToken.has(req.url)) {
    return next(req);
  }

  const token = authService.getTokenSync();

  if (!token) {
    return throwError(() => new Error('No access token available'));
  }

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(null);

        return from(authService.refreshToken()).pipe(
          switchMap((newToken) => {
            isRefreshing = false;
            refreshTokenSubject.next(newToken);

            return next(
              req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              }),
            );
          }),
          catchError((refreshError) => {
            isRefreshing = false;
            authService.logout();
            return throwError(() => refreshError);
          }),
        );
      }

      return refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((newToken) =>
          next(
            req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            }),
          ),
        ),
      );
    }),
  );
}
