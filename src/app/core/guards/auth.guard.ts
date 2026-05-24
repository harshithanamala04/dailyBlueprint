// Once you are standing outside on the login screen, clear out your browser URL address box, manually type in http://localhost:4200/app/daily-plan, and hit Enter.
// Instead of letting you pass, your app will immediately flash a security warning in the background terminal, intercept the transition, and lock you out right on the login screen page!

// src/app/core/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * 🛡️ ROUTE INTERCEPTION GATEWAY
   */
  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.currentUser$.pipe(
      take(1), // Grab the immediate active session snapshot token
      map(user => {
        if (user) {
          return true; // ✅ User identity verified. Allow entry to dashboard modules!
        } else {
          console.warn('Access Denied: Unauthorized route attempt intercepted. Redirecting to login wall.');
          return this.router.createUrlTree(['/login']); // 🛑 Boot user back to login page
        }
      })
    );
  }
}