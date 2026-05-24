import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service'; // ◄ Imported Cloud Pipeline

interface AgeMetricsStructure {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  monthsToNextBirthday: number;
  daysToNextBirthday: number;
}

@Component({
  selector: 'app-age-calculator',
  templateUrl: './age-calculator.component.html',
  styleUrls: ['./age-calculator.component.css']
})
export class AgeCalculatorComponent implements OnInit {

  birthDate: string = '';
  ageCalculated: boolean = false;
  ageResults: AgeMetricsStructure | null = null;

  // 🔑 Shared Mock User Identity Token
  private userId = 'student_user_123';

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    await this.loadAgeProfileFromCloud();
  }

  /**
   * 📡 PULLS FRESH AGE METRICS FROM FIREBASE ON LOAD
   */
  async loadAgeProfileFromCloud() {
    const cloudProfile = await this.firebaseService.getCalculatorProfile(this.userId);
    // Extract only the age child branch if it exists
    if (cloudProfile && cloudProfile.age) {
      const ageData = cloudProfile.age;
      this.birthDate = ageData.birthDate || '';
      this.ageCalculated = ageData.ageCalculated ?? false;
      this.ageResults = ageData.ageResults ?? null;
    }
  }

  /**
   * 🚀 STREAMS LATEST CALCULATION SNAPSHOT TO FIREBASE (WITHOUT WIPING OUT BMI OR INTEREST)
   */
  async syncAgeToCloud() {
    const agePayload = {
      birthDate: this.birthDate,
      ageCalculated: this.ageCalculated,
      ageResults: this.ageResults,
      lastCalculated: new Date().toISOString()
    };

    try {
      // Pull down the comprehensive profiles node first to avoid overwriting other keys
      const existingProfile = await this.firebaseService.getCalculatorProfile(this.userId) || {};
      existingProfile.age = agePayload; // Inject or update only our specific child key branch
      
      await this.firebaseService.saveCalculatorProfile(this.userId, existingProfile);
      console.log('Age calculations metrics synchronized to cloud successfully.');
    } catch (error) {
      console.error('Failed to sync age calculation metrics:', error);
    }
  }

  /**
   * ⚡ STABLE CALCULATION TIME RUNWAY LOGIC WITH LIVE CLOUD TRIGGERS
   */
  async calculateAgeMetrics() {
    if (!this.birthDate) {
      this.ageCalculated = false;
      this.ageResults = null;
      return;
    }

    const birth = new Date(this.birthDate);
    const today = new Date();

    // Guard rule: Block accidental target selections looking into the future
    if (birth > today) {
      alert("Date of birth cannot rest in the future!");
      this.birthDate = '';
      this.ageCalculated = false;
      this.ageResults = null;
      return;
    }

    // 1. Structural Difference Calculation Block
    let yrsDiff = today.getFullYear() - birth.getFullYear();
    let mthsDiff = today.getMonth() - birth.getMonth();
    let daysDiff = today.getDate() - birth.getDate();

    if (daysDiff < 0) {
      mthsDiff--;
      const prevMonthIdx = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      daysDiff += prevMonthIdx;
    }

    if (mthsDiff < 0) {
      yrsDiff--;
      mthsDiff += 12;
    }

    // 2. Absolute Continuous Accumulation Tracks
    const timeDifferenceMs = today.getTime() - birth.getTime();
    const totalDaysRunning = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));
    const totalWeeksRunning = Math.floor(totalDaysRunning / 7);
    const totalMonthsRunning = (yrsDiff * 12) + mthsDiff;
    const totalHoursRunning = totalDaysRunning * 24;

    // 3. Countdown Trackers Map Target to Next Anniversary Milestone
    let nextBday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < today) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }

    let bdayTimeDiff = nextBday.getTime() - today.getTime();
    let totalDaysToBday = Math.ceil(bdayTimeDiff / (1000 * 60 * 60 * 24));

    if (today.getMonth() === birth.getMonth() && today.getDate() === birth.getDate()) {
      totalDaysToBday = 0;
    }

    let nextBdayMonths = Math.floor(totalDaysToBday / 30.4375);
    let nextBdayDays = Math.floor(totalDaysToBday % 30.4375);

    this.ageResults = {
      years: yrsDiff,
      months: mthsDiff,
      days: daysDiff,
      totalMonths: totalMonthsRunning,
      totalWeeks: totalWeeksRunning,
      totalDays: totalDaysRunning,
      totalHours: totalHoursRunning,
      monthsToNextBirthday: nextBdayMonths,
      daysToNextBirthday: nextBdayDays
    };

    this.ageCalculated = true;

    // 🚀 Stream results out to your real-time cloud data node
    await this.syncAgeToCloud();
  }
}