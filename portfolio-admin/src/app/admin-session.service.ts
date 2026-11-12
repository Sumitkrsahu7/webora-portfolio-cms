import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export const ADMIN_TOKEN_KEY = 'webora_admin_token';

@Injectable({ providedIn: 'root' })
export class AdminSessionService {
  private readonly unauthorizedSubject = new Subject<string>();
  readonly unauthorized$ = this.unauthorizedSubject.asObservable();

  getToken(): string {
    return localStorage.getItem(ADMIN_TOKEN_KEY) || '';
  }

  setToken(token: string): void {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  }

  clearToken(): void {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  }

  notifyUnauthorized(message = 'Your session expired or access was denied. Please sign in again.'): void {
    this.unauthorizedSubject.next(message);
  }

  extractErrorMessage(err: any, fallback: string): string {
    const fieldErrors = err?.error?.fieldErrors;
    if (fieldErrors && typeof fieldErrors === 'object') {
      const firstKey = Object.keys(fieldErrors)[0];
      if (firstKey && fieldErrors[firstKey]) {
        return `${firstKey}: ${fieldErrors[firstKey]}`;
      }
    }
    return (
      err?.error?.message ||
      err?.error?.detail ||
      err?.message ||
      fallback
    );
  }
}
