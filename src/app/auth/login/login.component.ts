// src/app/auth/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'; // ◄ Added password reset capability

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // 💎 RESTORED ORIGINAL TEMPLATE VARIABLE BINDINGS
  loginEmail: string = '';
  loginPassword: string = '';
  
  // State control flags
  isRegisteringMode: boolean = false;
  serverErrorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Persistent Session Check: If already authorized, route straight into app dashboard modules
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.router.navigate(['/app/daily-plan']);
      }
    });
  }

  /**
   * ＋ MAPS PERFECTLY TO YOUR HTML (click)="goToNextStep()" BUTTON
   */
  async goToNextStep() {
    if (!this.loginEmail.trim() || !this.loginPassword.trim()) {
      alert('Please fill out both your email address and password credentials.');
      return;
    }

    if (this.loginPassword.length < 6) {
      alert('Security policy notice: Password must be at least 6 characters long.');
      return;
    }

    this.isLoading = true;
    this.serverErrorMessage = '';

    try {
      // 1. Try to log in the student assuming their account already exists
      await this.authService.loginExistingUser(this.loginEmail.trim(), this.loginPassword);
      console.log('User signed in successfully!');
      
    } catch (error: any) {
      
      // 2. If the user doesn't exist yet, automatically run the registration pipeline!
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        console.log('New email detected. Transitioning to secure auto-registration mode...');
        try {
          await this.authService.registerNewUser(this.loginEmail.trim(), this.loginPassword);
          alert('Welcome! Your secure account profile has been successfully created.');
          return; // The auth observer will automatically route you into the dashboard
        } catch (regError: any) {
          this.handleFirebaseErrorTranslations(regError.code);
        }
      } else {
        // Handle alternative errors (like weak passwords or malformed email strings)
        this.handleFirebaseErrorTranslations(error.code);
      }
      
    } finally {
      this.isLoading = false;
    }
  }


  /**
   * 🔄 MAPS PERFECTLY TO YOUR HTML (click)="triggerPasswordReset()" ACTION
   */
  async triggerPasswordReset() {
    if (!this.loginEmail.trim()) {
      alert('Please input your target email address into the form field box first.');
      return;
    }

    try {
      const authInstance = getAuth();
      await sendPasswordResetEmail(authInstance, this.loginEmail.trim());
      alert(`Password reset secure dispatch sequence initiated! Check your inbox at: ${this.loginEmail}`);
    } catch (error: any) {
      alert('Failed to issue account recovery message. Please check formatting accuracy.');
    }
  }

  /**
   * 🔀 Form toggle helper (can be triggered via UI if needed)
   */
  toggleFormMode(): void {
    this.isRegisteringMode = !this.isRegisteringMode;
    this.serverErrorMessage = '';
    this.loginEmail = '';
    this.loginPassword = '';
  }

  private handleFirebaseErrorTranslations(errorCode: string): void {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        this.serverErrorMessage = 'This email is already registered to an account profile.';
        alert(this.serverErrorMessage);
        break;
      case 'auth/invalid-email':
        this.serverErrorMessage = 'Please verify email structural formatting parameters.';
        alert(this.serverErrorMessage);
        break;
      case 'auth/wrong-password':
      case 'auth/user-not-found':
      case 'auth/invalid-credential':
        this.serverErrorMessage = 'Invalid identity match. Check email or password accuracy details.';
        alert(this.serverErrorMessage);
        break;
      default:
        this.serverErrorMessage = 'Authentication service threshold anomaly. Please try again.';
        alert(this.serverErrorMessage);
        break;
    }
  }
}