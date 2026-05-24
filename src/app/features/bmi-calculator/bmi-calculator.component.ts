import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service'; // ◄ Imported Cloud Pipeline

@Component({
  selector: 'app-bmi-calculator',
  templateUrl: './bmi-calculator.component.html',
  styleUrls: ['./bmi-calculator.component.css']
})
export class BmiCalculatorComponent implements OnInit {

  unitSystem: 'metric' | 'imperial' = 'metric';
  userWeight: number | null = null;
  userHeight: number | null = null;

  bmiResultScore: number | null = null;
  bmiResultStatus: string = '';
  healthyWeightRange: string = '';

  // 🔑 Shared Mock User Identity Token
  private userId = 'student_user_123';

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    await this.loadBmiProfileFromCloud();
  }

  /**
   * 📡 PULLS FRESH HEALTH METRICS FROM FIREBASE ON LOAD
   */
  async loadBmiProfileFromCloud() {
    const cloudProfile = await this.firebaseService.getCalculatorProfile(this.userId);
    // Ensure we have a valid bmi branch payload saved under this user profile node
    if (cloudProfile && cloudProfile.bmi) {
      const bmiData = cloudProfile.bmi;
      this.unitSystem = bmiData.unitSystem || 'metric';
      this.userWeight = bmiData.userWeight ?? null;
      this.userHeight = bmiData.userHeight ?? null;
      this.bmiResultScore = bmiData.bmiResultScore ?? null;
      this.bmiResultStatus = bmiData.bmiResultStatus || '';
      this.healthyWeightRange = bmiData.healthyWeightRange || '';
    }
  }

  /**
   * 🚀 STREAMS LATEST CALCULATION SNAPSHOT UP TO FIREBASE
   */
  async syncBmiToCloud() {
    // Collect calculations object map payload layout
    const bmiPayload = {
      unitSystem: this.unitSystem,
      userWeight: this.userWeight,
      userHeight: this.userHeight,
      bmiResultScore: this.bmiResultScore,
      bmiResultStatus: this.bmiResultStatus,
      healthyWeightRange: this.healthyWeightRange,
      lastCalculated: new Date().toISOString()
    };

    try {
      // Pull down existing object profiles first so we don't wipe out other calculator paths!
      const existingProfile = await this.firebaseService.getCalculatorProfile(this.userId) || {};
      existingProfile.bmi = bmiPayload; // Append or update only the bmi map branch child
      
      await this.firebaseService.saveCalculatorProfile(this.userId, existingProfile);
      console.log('BMI health status logs updated on cloud.');
    } catch (error) {
      console.error('Failed to sync calculation metrics:', error);
    }
  }

  /**
   * ⚡ STABLE DIRECT-TO-METRIC COMPUTATION ENGINE WITH LIVE CLOUD TRIGGERS
   */
  async runBmiComputationEngine() {
    // 🛡️ REASONABLE BOUNDARY GUARD
    if (!this.userWeight || !this.userHeight || this.userWeight <= 0 || this.userHeight <= 10) {
      this.bmiResultScore = null;
      this.bmiResultStatus = '';
      this.healthyWeightRange = '';
      return;
    }

    let weightInKg = 0;
    let heightInMeters = 0;

    if (this.unitSystem === 'metric') {
      weightInKg = this.userWeight;
      heightInMeters = this.userHeight / 100;
      this.determineHealthyWeightMetric(this.userHeight);
    } else {
      weightInKg = this.userWeight / 2.20462;
      heightInMeters = this.userHeight * 0.0254;
      this.determineHealthyWeightImperial(this.userHeight);
    }

    // Standard core scientific equation execution
    this.bmiResultScore = weightInKg / (heightInMeters * heightInMeters);
    this.assignBmiMedicalStatus(this.bmiResultScore);

    // 🚀 Dispatch calculation outputs to your persistent database stream node
    await this.syncBmiToCloud();
  }

  private assignBmiMedicalStatus(score: number): void {
    if (score < 18.5) {
      this.bmiResultStatus = 'Underweight';
    } else if (score >= 18.5 && score < 25) {
      this.bmiResultStatus = 'Normal (Healthy Weight)';
    } else if (score >= 25 && score < 30) {
      this.bmiResultStatus = 'Overweight';
    } else {
      this.bmiResultStatus = 'Obese';
    }
  }

  getBmiCategoryClass(): string {
    if (!this.bmiResultScore || this.bmiResultScore <= 0) return '';
    if (this.bmiResultScore < 18.5) return 'bmi-underweight';
    if (this.bmiResultScore >= 18.5 && this.bmiResultScore < 25) return 'bmi-normal';
    if (this.bmiResultScore >= 25 && this.bmiResultScore < 30) return 'bmi-overweight';
    return 'bmi-obese';
  }

  async changeUnitSystem(system: 'metric' | 'imperial') {
    if (this.unitSystem === system) return;
    this.unitSystem = system;

    if (this.userWeight && this.userHeight) {
      if (system === 'imperial') {
        this.userWeight = Math.round(this.userWeight * 2.20462);
        this.userHeight = Math.round(this.userHeight / 2.54);
      } else {
        this.userWeight = Math.round(this.userWeight / 2.20462);
        this.userHeight = Math.round(this.userHeight * 2.54);
      }
    } else {
      this.userWeight = null;
      this.userHeight = null;
    }

    await this.runBmiComputationEngine();
  }

  private determineHealthyWeightMetric(heightCm: number): void {
    const heightM = heightCm / 100;
    const minKg = Math.round(18.5 * (heightM * heightM));
    const maxKg = Math.round(24.9 * (heightM * heightM));
    this.healthyWeightRange = `${minKg} kg - ${maxKg} kg`;
  }

  private determineHealthyWeightImperial(heightInches: number): void {
    const heightM = heightInches * 0.0254; 
    const minKg = 18.5 * (heightM * heightM);
    const maxKg = 24.9 * (heightM * heightM);
    
    const minLbs = Math.round(minKg * 2.20462);
    const maxLbs = Math.round(maxKg * 2.20462);
    this.healthyWeightRange = `${minLbs} lbs - ${maxLbs} lbs`;
  }
}