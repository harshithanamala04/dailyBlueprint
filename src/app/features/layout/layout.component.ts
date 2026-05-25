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

  // 📱 Tracks whether the mobile sliding navigation drawer menu is open
  isMobileMenuOpen: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // 🛡️ SECURITY GUARD: Redirect to login if user logs out
    this.authService.currentUser$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  /**
   * 🔀 TOGGLE MOBILE DRAWER PANEL
   */
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  /**
   * 🚪 CLOSES SIDEBAR DRAWER ON SELECTION
   */
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  /**
   * 🚪 SIGNOUT PIPELINE
   */
  async executeSystemSignOut() {
    try {
      this.closeMobileMenu(); 
      await this.authService.logoutCurrentUser();
      console.log('User signed out successfully.');
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error during sign out routine execution:', error);
    }
  }
}