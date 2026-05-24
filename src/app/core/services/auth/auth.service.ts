// src/app/core/services/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = getAuth();
  
  // 💎 Tracks sign-in status changes across your whole application
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor() {
    // 📡 Monitors logins, logouts, or page refreshes automatically
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  /**
   * 🆕 REGISTER: Creates a shiny new user account profile
   */
  async registerNewUser(email: string, pass: string): Promise<User> {
    try {
      const credentials = await createUserWithEmailAndPassword(this.auth, email, pass);
      return credentials.user;
    } catch (error: any) {
      console.error('Firebase Registration Error:', error);
      throw error;
    }
  }

  /**
   * 🔑 SIGN IN: Validates credentials and logs the user in
   */
  async loginExistingUser(email: string, pass: string): Promise<User> {
    try {
      const credentials = await signInWithEmailAndPassword(this.auth, email, pass);
      return credentials.user;
    } catch (error: any) {
      console.error('Firebase Login Failure:', error);
      throw error;
    }
  }

  /**
   * 🚪 LOGOUT: Clears out active session keys instantly
   */
  async logoutCurrentUser(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Logout Exception:', error);
    }
  }

  /**
   * 🔍 GET UID: Grabs the active user's secure ID string
   */
  getCurrentUserId(): string | null {
    const user = this.auth.currentUser;
    return user ? user.uid : null;
  }
}