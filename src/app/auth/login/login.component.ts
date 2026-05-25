// src/app/auth/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  // Form input bindings
  email: string = '';
  password: string = '';
  
  // State toggles
  isRegisterMode: boolean = false; 
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Session Guard: If a user session already exists, skip login entirely
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.router.navigate(['/app/daily-plan']);
      }
    });
  }

  /**
   * 🔀 TOGGLE INTERFACE MODE
   */
  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = ''; 
  }

  /**
   * 🚀 SUBMIT ENTRY TRIGGER (Handles both standard Login and new Registration)
   */
  async onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please complete all required input credentials.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      if (this.isRegisterMode) {
        // 🚀 SUCCESS: Connected to your exact service function
        await this.authService.registerNewUser(this.email, this.password); 
        console.log('Registration complete! Moving to workspace routing...');
        this.router.navigate(['/name-setup']); 
      } else {
        // 🔑 SUCCESS: Fixed to your exact service function name
        await this.authService.loginExistingUser(this.email, this.password);
        console.log('Session authorized.');
        this.router.navigate(['/app/daily-plan']);
      }
    } catch (error: any) {
      console.error('Authentication anomaly caught:', error);
      this.errorMessage = error.message || 'An authentication error occurred.';
    } finally {
      this.loading = false;
    }
  }
}