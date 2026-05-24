import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service'; // ◄ Imported Cloud Pipeline

@Component({
  selector: 'app-interest-calculator',
  templateUrl: './interest-calculator.component.html',
  styleUrls: ['./interest-calculator.component.css']
})
export class InterestCalculatorComponent implements OnInit {

  // Toggle Tracking Type
  interestType: 'simple' | 'compound' = 'simple';

  // Input Parameter Models
  principal: number | null = 10000;
  interestRate: number | null = 5;
  timeDuration: number | null = 2;

  // Calculation Results Targets
  totalMaturityAmount: number = 0;
  totalInterestEarned: number = 0;

  // 🔑 Shared Mock User Identity Token
  private userId = 'student_user_123';

  constructor(private firebaseService: FirebaseService) { }

  async ngOnInit() {
    await this.loadInterestProfileFromCloud();
  }

  /**
   * 📡 PULLS FRESH FINANCIAL SNAPSHOT METRICS FROM FIREBASE ON INITIALIZATION
   */
  async loadInterestProfileFromCloud() {
    const cloudProfile = await this.firebaseService.getCalculatorProfile(this.userId);
    // Extract only the interest child branch if it exists
    if (cloudProfile && cloudProfile.interest) {
      const intData = cloudProfile.interest;
      this.interestType = intData.interestType || 'simple';
      this.principal = intData.principal ?? 10000;
      this.interestRate = intData.interestRate ?? 5;
      this.timeDuration = intData.timeDuration ?? 2;
      this.totalMaturityAmount = intData.totalMaturityAmount ?? 0;
      this.totalInterestEarned = intData.totalInterestEarned ?? 0;
    } else {
      // Execute a baseline fallback computation if no data exists yet
      this.executeInterestCalculations();
    }
  }

  /**
   * 🚀 STREAMS LATEST PROJECTION SNAPSHOT TO FIREBASE (WITHOUT WIPING OUT BMI)
   */
  async syncInterestToCloud() {
    const interestPayload = {
      interestType: this.interestType,
      principal: this.principal,
      interestRate: this.interestRate,
      timeDuration: this.timeDuration,
      totalMaturityAmount: this.totalMaturityAmount,
      totalInterestEarned: this.totalInterestEarned,
      lastCalculated: new Date().toISOString()
    };

    try {
      // Pull down the comprehensive profiles node first
      const existingProfile = await this.firebaseService.getCalculatorProfile(this.userId) || {};
      existingProfile.interest = interestPayload; // Inject or update only our specific child key branch
      
      await this.firebaseService.saveCalculatorProfile(this.userId, existingProfile);
      console.log('Interest projections synchronized to cloud successfully.');
    } catch (error) {
      console.error('Failed to sync investment calculation metrics:', error);
    }
  }

  async switchInterestType(type: 'simple' | 'compound') {
    this.interestType = type;
    await this.executeInterestCalculations();
  }

  /**
   * ⚡ INTEREST COMPILATION ALGORITHM CHASSIS WITH LIVE CLOUD TRIGGERS
   */
  async executeInterestCalculations() {
    if (!this.principal || !this.interestRate || !this.timeDuration || this.principal <= 0 || this.interestRate <= 0 || this.timeDuration <= 0) {
      this.totalMaturityAmount = 0;
      this.totalInterestEarned = 0;
      return;
    }

    const P = this.principal;
    const R = this.interestRate;
    const T = this.timeDuration;

    if (this.interestType === 'simple') {
      // Linear Simple Interest Math
      this.totalInterestEarned = (P * R * T) / 100;
      this.totalMaturityAmount = P + this.totalInterestEarned;
    } else {
      // Exponential Compound Interest Math: A = P * (1 + r/100)^t
      this.totalMaturityAmount = P * Math.pow((1 + (R / 100)), T);
      this.totalInterestEarned = this.totalMaturityAmount - P;
    }

    // 🚀 Stream results out to your real-time cloud data node
    await this.syncInterestToCloud();
  }
}