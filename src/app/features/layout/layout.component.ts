// src/app/features/layout/layout.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  // 🔑 Injected both Router and AuthService inside your constructor parameters
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // 🛡️ SECURITY SESSION GUARD: If a user signs out, bounce them back to login instantly
    this.authService.currentUser$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  /**
   * 🚪 TERMINATES ACTIVE SECTIONS & REDIRECTS TO LOGIN LANDING
   */
  async executeSystemSignOut() {
    try {
      // 1. Wipe active login session tokens from Firebase cloud servers
      await this.authService.logoutCurrentUser();
      console.log('User signed out successfully.');

      // 2. Force browser redirect back to your login route path
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error during sign out routine execution:', error);
    }
  }
}