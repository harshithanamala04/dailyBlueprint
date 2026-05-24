// src/app/features/period-tracker/period-tracker.component.ts
import { Component, OnInit } from '@angular/core';

interface SymptomLogItem {
  dateStamp: string;
  flowLevel: 'None' | 'Light' | 'Medium' | 'Heavy';
  notes: string;
}

@Component({
  selector: 'app-her-cycle',
  templateUrl: './her-cycle.component.html',
  styleUrls: ['./her-cycle.component.css']
})
export class HerCycleComponent implements OnInit {

  // Core Data Binding Inputs
  lastPeriodDate: string = '2026-05-10'; // Standard mock anchor point
  avgCycleLength: number = 28;

  // Real-Time Generated Outputs
  nextPeriodDate: Date | null = null;
  ovulationDate: Date | null = null;
  daysUntilNextPeriod: number = 0;

  // Symptom Logging Form Models
  newLogNotes: string = '';
  newLogFlow: 'None' | 'Light' | 'Medium' | 'Heavy' = 'None';

  // Historical Timeline Ledger Array
  symptomLogsHistory: SymptomLogItem[] = [
    { dateStamp: 'May 10', flowLevel: 'Heavy', notes: 'Moderate lower back cramps, feeling fatigued' },
    { dateStamp: 'May 11', flowLevel: 'Medium', notes: 'Light cramps, mood is stable' }
  ];

  constructor() { }

  ngOnInit(): void {
    this.calculateCycleWindows();
  }

  /**
   * ⚡ MATHEMATICAL CALENDAR PREDICTION ENGINE
   * Projects next period and peak ovulation cycles based on luteal phase constants
   */
  calculateCycleWindows(): void {
    if (!this.lastPeriodDate || !this.avgCycleLength || this.avgCycleLength <= 0) {
      this.nextPeriodDate = null;
      this.ovulationDate = null;
      this.daysUntilNextPeriod = 0;
      return;
    }

    const start = new Date(this.lastPeriodDate);

    // 1. Predict Next Period Date: Last Date + Cycle Length Days
    const predictedPeriod = new Date(start.getTime());
    predictedPeriod.setDate(start.getDate() + this.avgCycleLength);
    this.nextPeriodDate = predictedPeriod;

    // 2. Predict Ovulation Date: Typically occurs 14 days before next period
    const predictedOvulation = new Date(predictedPeriod.getTime());
    predictedOvulation.setDate(predictedPeriod.getDate() - 14);
    this.ovulationDate = predictedOvulation;

    // 3. Compute Days Remaining Countdown relative to today midnight
    const rawToday = new Date();
    const todayMidnight = new Date(rawToday.getFullYear(), rawToday.getMonth(), rawToday.getDate());
    const periodMidnight = new Date(predictedPeriod.getFullYear(), predictedPeriod.getMonth(), predictedPeriod.getDate());

    const timeDiffMs = periodMidnight.getTime() - todayMidnight.getTime();
    this.daysUntilNextPeriod = Math.ceil(timeDiffMs / (1000 * 60 * 60 * 24));
  }

  commitSymptomLogEntry(): void {
    if (!this.newLogNotes.trim()) { alert('Please write a quick symptom or energy note.'); return; }

    const today = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const simpleDate = `${months[today.getMonth()]} ${today.getDate()}`;

    const freshLog: SymptomLogItem = {
      dateStamp: simpleDate,
      flowLevel: this.newLogFlow,
      notes: this.newLogNotes.trim()
    };

    this.symptomLogsHistory.unshift(freshLog);

    // Reset fields
    this.newLogNotes = '';
    this.newLogFlow = 'None';
  }

  removeSymptomLogEntry(idx: number): void {
    this.symptomLogsHistory.splice(idx, 1);
  }

  formatDisplayFriendlyDate(dateObj: Date | null): string {
    if (!dateObj) return '';
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
  }
}