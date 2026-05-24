// src/app/features/activity-timer/activity-timer.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';

interface TimerInstance {
  label: string;
  durationTotal: number; // in seconds
  timeLeft: number;       // in seconds
  status: 'READY' | 'RUNNING' | 'PAUSED' | 'COMPLETED';
  intervalId?: any;
}

@Component({
  selector: 'app-activity-timer',
  templateUrl: './activity-timer.component.html',
  styleUrls: ['./activity-timer.component.css']
})
export class ActivityTimerComponent implements OnInit, OnDestroy {

  // List arrays containing all current tracks
  timersList: TimerInstance[] = [
    { label: 'Deep Coding Focus Block', durationTotal: 1500, timeLeft: 1500, status: 'READY' },
    { label: 'Cardio Interval Split', durationTotal: 300, timeLeft: 300, status: 'READY' }
  ];

  // Drawer modal structural hooks
  showAddModal: boolean = false;
  newTimerLabel: string = '';
  newTimerMinutes: number | null = null;
  newTimerSeconds: number | null = null;

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    // Safety cleanup sweep loop prevents asynchronous memory leaks
    this.timersList.forEach(t => { if (t.intervalId) clearInterval(t.intervalId); });
  }

  openNewTimerModal(): void { this.showAddModal = true; }
  closeNewTimerModal(): void {
    this.showAddModal = false;
    this.newTimerLabel = '';
    this.newTimerMinutes = null;
    this.newTimerSeconds = null;
  }

  /**
   * ＋ CREATES FRESH TRACK INSTANCE ON DEMAND
   */
  createNewTimerInstance(): void {
    const mins = this.newTimerMinutes || 0;
    const secs = this.newTimerSeconds || 0;
    const totalSecs = (mins * 60) + secs;

    if (!this.newTimerLabel.trim()) { alert('Please enter a descriptive activity label.'); return; }
    if (totalSecs <= 0) { alert('Please assign a valid duration track above 0 seconds.'); return; }

    const freshTrack: TimerInstance = {
      label: this.newTimerLabel,
      durationTotal: totalSecs,
      timeLeft: totalSecs,
      status: 'READY'
    };

    this.timersList.push(freshTrack);
    this.closeNewTimerModal();
  }

  startTimerInstance(idx: number): void {
    const timer = this.timersList[idx];
    if (timer.status === 'RUNNING' || timer.timeLeft <= 0) return;

    timer.status = 'RUNNING';
    timer.intervalId = setInterval(() => {
      if (timer.timeLeft > 0) {
        timer.timeLeft--;
      } else {
        this.completeTimerAnniversary(idx);
      }
    }, 1000);
  }

  pauseTimerInstance(idx: number): void {
    const timer = this.timersList[idx];
    if (timer.intervalId) {
      clearInterval(timer.intervalId);
    }
    timer.status = 'PAUSED';
  }

  resetTimerInstance(idx: number): void {
    const timer = this.timersList[idx];
    this.pauseTimerInstance(idx);
    timer.timeLeft = timer.durationTotal;
    timer.status = 'READY';
  }

  removeTimerInstance(idx: number): void {
    this.pauseTimerInstance(idx);
    this.timersList.splice(idx, 1);
  }

  private completeTimerAnniversary(idx: number): void {
    const timer = this.timersList[idx];
    this.pauseTimerInstance(idx);
    timer.status = 'COMPLETED';
    timer.timeLeft = 0;
  }

  /**
   * Helper utility converts raw time integers cleanly into a clockface string
   */
  formatTimeClockFace(totalSeconds: number): string {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}