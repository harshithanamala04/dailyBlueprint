// src/app/features/special-days/special-days.component.ts
import { Component, OnInit } from '@angular/core';

interface SpecialEventItem {
  title: string;
  targetDate: string; // ISO String format YYYY-MM-DD
  daysRemaining: number;
}

@Component({
  selector: 'app-special-days',
  templateUrl: './special-days.component.html',
  styleUrls: ['./special-days.component.css']
}) // 🌟 This is the bracket that was missing!
export class SpecialDaysComponent implements OnInit {

  // Default Baseline Matrix Mockup Core Tracking Events
  eventsList: SpecialEventItem[] = [
    { title: 'New Year Celebrations', targetDate: '2027-01-01', daysRemaining: 0 },
    { title: 'Project Submission Milestone', targetDate: '2026-06-15', daysRemaining: 0 }
  ];

  // Drawer Toggle Structural Hooks
  showAddDrawer: boolean = false;
  newEventTitle: string = '';
  newEventDate: string = '';

  constructor() { }

  ngOnInit(): void {
    this.refreshAllCountdownCalculations();
  }

  openEventDrawer(): void { this.showAddDrawer = true; }
  closeEventDrawer(): void {
    this.showAddDrawer = false;
    this.newEventTitle = '';
    this.newEventDate = '';
  }

  /**
   * ＋ CREATES FRESH SPECIAL DAY EVENT NODE
   */
  createNewEventInstance(): void {
    if (!this.newEventTitle.trim()) { alert('Please enter a descriptive event title.'); return; }
    if (!this.newEventDate) { alert('Please assign a valid calendar target date.'); return; }

    const freshEvent: SpecialEventItem = {
      title: this.newEventTitle.trim(),
      targetDate: this.newEventDate,
      daysRemaining: 0
    };

    this.eventsList.push(freshEvent);
    this.refreshAllCountdownCalculations();
    this.closeEventDrawer();
  }

  /**
   * ⚡ CALENDAR METRIC MATH ENGINE
   * Runs midnight timestamp difference equations to calculate precision days-remaining counters
   */
  refreshAllCountdownCalculations(): void {
    const rawToday = new Date();
    // Normalize today's date to midnight time to prevent hourly calculation skewing
    const todayMidnight = new Date(rawToday.getFullYear(), rawToday.getMonth(), rawToday.getDate());

    this.eventsList.forEach(event => {
      const targetDateParsed = new Date(event.targetDate);
      const targetMidnight = new Date(targetDateParsed.getFullYear(), targetDateParsed.getMonth(), targetDateParsed.getDate());

      const timeDiffInMs = targetMidnight.getTime() - todayMidnight.getTime();
      // Translate milliseconds difference into clean daily interval quantities
      event.daysRemaining = Math.ceil(timeDiffInMs / (1000 * 60 * 60 * 24));
    });

    // Sort upcoming items so the closest chronological milestones float to the top
    this.eventsList.sort((a, b) => {
      if (a.daysRemaining < 0 && b.daysRemaining >= 0) return 1;
      if (a.daysRemaining >= 0 && b.daysRemaining < 0) return -1;
      return a.daysRemaining - b.daysRemaining;
    });
  }

  /**
   * 🎨 URGENCY BOUNDARY STYLE MAPPER
   * Returns contextual style tag triggers based on imminent close proximities
   */
  getEventUrgencyClass(days: number): string {
    if (days === 0) return 'urgency-today';
    if (days > 0 && days <= 7) return 'urgency-imminent';
    if (days > 7 && days <= 30) return 'urgency-moderate';
    if (days < 0) return 'urgency-passed';
    return 'urgency-future';
  }

  getEventCategoryIcon(days: number): string {
    if (days === 0) return '🔥';
    if (days > 0 && days <= 7) return '⏰';
    if (days < 0) return '⌛';
    return '📅';
  }

  formatDisplayFriendlyDate(isoDateStr: string): string {
    const d = new Date(isoDateStr);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }

  removeEventInstance(idx: number): void {
    this.eventsList.splice(idx, 1);
  }
}