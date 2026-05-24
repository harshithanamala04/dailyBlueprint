// src/app/core/services/firebase.service.ts
import { Injectable } from '@angular/core';
import { getDatabase, ref, set, get, child } from 'firebase/database';
import { AuthService } from './auth/auth.service';

// Add this import line right at the very top of src/app/core/services/firebase.service.ts if it isn't there:
import { onValue } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private db = getDatabase();

  constructor(private authService: AuthService) { }

  /**
   * 🔍 SMART UTILITY: Safely calculates the best available user directory node string.
   */
  private resolveUserNode(passedId?: string): string {
    if (passedId && passedId.trim().length > 0) {
      return passedId;
    }
    const realUid = this.authService.getCurrentUserId();
    return realUid ? realUid : 'student_user_123';
  }

  // ==========================================
  // 📅 DAILY PLAN LOGIC (getUserData / saveUserData)
  // ==========================================

  async saveUserData(firstParam: any, secondParam?: any): Promise<void> {
    const targetData = secondParam !== undefined ? secondParam : firstParam;
    const fallbackId = secondParam !== undefined ? firstParam : undefined;
    const nodeKey = this.resolveUserNode(fallbackId);
    
    await set(ref(this.db, `daily_plans/${nodeKey}`), targetData);
  }

  async getUserData(optionalId?: string): Promise<any> {
    const nodeKey = this.resolveUserNode(optionalId);
    const snapshot = await get(child(ref(this.db), `daily_plans/${nodeKey}`));
    return snapshot.exists() ? snapshot.val() : null;
  }

  // ==========================================
  // 📝 DAILY NOTES LOGIC (getNotesData / saveNotesData)
  // ==========================================

  async saveNotesData(firstParam: any, secondParam?: any): Promise<void> {
    const targetData = secondParam !== undefined ? secondParam : firstParam;
    const fallbackId = secondParam !== undefined ? firstParam : undefined;
    const nodeKey = this.resolveUserNode(fallbackId);
    
    await set(ref(this.db, `daily_notes/${nodeKey}`), targetData);
  }

  async getNotesData(optionalId?: string): Promise<any> {
    const nodeKey = this.resolveUserNode(optionalId);
    const snapshot = await get(child(ref(this.db), `daily_notes/${nodeKey}`));
    return snapshot.exists() ? snapshot.val() : null;
  }

  // ==========================================
  // 💳 EXPENSE TRACKER LOGIC (getExpenseData / saveExpenseData)
  // ==========================================

  async saveExpenseData(firstParam: any, secondParam?: any): Promise<void> {
    const targetData = secondParam !== undefined ? secondParam : firstParam;
    const fallbackId = secondParam !== undefined ? firstParam : undefined;
    const nodeKey = this.resolveUserNode(fallbackId);
    
    await set(ref(this.db, `expenses/${nodeKey}`), targetData);
  }

  async getExpenseData(optionalId?: string): Promise<any> {
    const nodeKey = this.resolveUserNode(optionalId);
    const snapshot = await get(child(ref(this.db), `expenses/${nodeKey}`));
    return snapshot.exists() ? snapshot.val() : null;
  }

  // ==========================================
  // 🎯 HABIT TRACKER LOGIC (getHabitData / saveHabitData)
  // ==========================================

  async saveHabitData(firstParam: any, secondParam?: any): Promise<void> {
    const targetData = secondParam !== undefined ? secondParam : firstParam;
    const fallbackId = secondParam !== undefined ? firstParam : undefined;
    const nodeKey = this.resolveUserNode(fallbackId);
    
    await set(ref(this.db, `habits/${nodeKey}`), targetData);
  }

  async getHabitData(optionalId?: string): Promise<any> {
    const nodeKey = this.resolveUserNode(optionalId);
    const snapshot = await get(child(ref(this.db), `habits/${nodeKey}`));
    return snapshot.exists() ? snapshot.val() : null;
  }

  // ==========================================
  // 🧮 CALCULATOR PROFILES ENGINE (Keep for backup support)
  // ==========================================

  async saveCalculatorProfile(firstParam: any, secondParam?: any): Promise<void> {
    const targetData = secondParam !== undefined ? secondParam : firstParam;
    const fallbackId = secondParam !== undefined ? firstParam : undefined;
    const nodeKey = this.resolveUserNode(fallbackId);
    
    await set(ref(this.db, `calculator_profiles/${nodeKey}`), targetData);
  }

  async getCalculatorProfile(optionalId?: string): Promise<any> {
    const nodeKey = this.resolveUserNode(optionalId);
    const snapshot = await get(child(ref(this.db), `calculator_profiles/${nodeKey}`));
    return snapshot.exists() ? snapshot.val() : null;
  }

// ==========================================
  // 📡 REAL-TIME LIVE STREAMING ENGINES (onValue)
  // ==========================================

  /**
   * 📡 LIVE STREAM: Monitors the active user's daily plans continuously.
   * Runs the provided callback function instantly every single time data shifts on the cloud!
   */
  streamDailyPlan(callback: (data: any) => void, optionalId?: string): () => void {
    const nodeKey = this.resolveUserNode(optionalId);
    const planRef = ref(this.db, `daily_plans/${nodeKey}`);
    
    // Connect the live observer stream channel
    const unsubscribe = onValue(planRef, (snapshot) => {
      const data = snapshot.exists() ? snapshot.val() : null;
      callback(data);
    });

    // Returns an unhook function so the component can shut off the pipeline when closing
    return unsubscribe;
  }

  /**
   * 📡 LIVE STREAM: Monitors the active user's notes document track continuously.
   */
  streamNotesData(callback: (data: any) => void, optionalId?: string): () => void {
    const nodeKey = this.resolveUserNode(optionalId);
    const notesRef = ref(this.db, `daily_notes/${nodeKey}`);
    
    return onValue(notesRef, (snapshot) => {
      const data = snapshot.exists() ? snapshot.val() : null;
      callback(data);
    });
  }
}