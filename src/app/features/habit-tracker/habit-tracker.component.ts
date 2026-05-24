import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service'; // ◄ Imported Cloud Pipeline

interface RollingDayNode {
  dayLabel: string; // M, T, W, T, F, S, S
  done: boolean;
}

interface AtomicHabitStructure {
  name: string;
  currentStreak: number;
  rollingSevenDays: RollingDayNode[];
}

@Component({
  selector: 'app-habit-tracker',
  templateUrl: './habit-tracker.component.html',
  styleUrls: ['./habit-tracker.component.css']
})
export class HabitTrackerComponent implements OnInit {

  // Primary Habits Storage Matrices
  habitsList: AtomicHabitStructure[] = [];

  // Drawer Form Binding Structural Hooks
  showAddDrawer: boolean = false;
  newHabitName: string = '';

  // 🔑 Shared Mock User Identity Token
  private userId = 'student_user_123';

  constructor(private firebaseService: FirebaseService) { }

  async ngOnInit() {
    await this.loadHabitsFromCloud();
  }

  /**
   * 📡 PULLS COPIES DOWN FROM GOOGLE SERVER ON RUNTIME STARTS
   */
  async loadHabitsFromCloud() {
    const cloudHabits = await this.firebaseService.getHabitData(this.userId);
    if (cloudHabits) {
      this.habitsList = cloudHabits;
    } else {
      // 💎 Fallback Default Mockup Data if the cloud node database profile is empty
      this.habitsList = [
        {
          name: 'Write Python Snippets',
          currentStreak: 5,
          rollingSevenDays: [
            { dayLabel: 'M', done: true },
            { dayLabel: 'T', done: true },
            { dayLabel: 'W', done: true },
            { dayLabel: 'T', done: true },
            { dayLabel: 'F', done: true },
            { dayLabel: 'S', done: false },
            { dayLabel: 'S', done: false }
          ]
        },
        {
          name: 'Spring Boot Code Refactor',
          currentStreak: 3,
          rollingSevenDays: [
            { dayLabel: 'M', done: true },
            { dayLabel: 'T', done: false },
            { dayLabel: 'W', done: true },
            { dayLabel: 'T', done: true },
            { dayLabel: 'F', done: false },
            { dayLabel: 'S', done: false },
            { dayLabel: 'S', done: false }
          ]
        }
      ];
    }
  }

  /**
   * 🚀 HELPER SYNCHRONIZER STREAM OUTLET
   */
  async syncHabitsToCloud() {
    await this.firebaseService.saveHabitData(this.userId, this.habitsList);
  }

  openHabitDrawer(): void { this.showAddDrawer = true; }
  closeHabitDrawer(): void {
    this.showAddDrawer = false;
    this.newHabitName = '';
  }

  /**
   * ＋ INJECTS FRESH ROUTINE INTO ATOMIC TRACK MATRICES & SYNCS TO FIREBASE
   */
  async createNewHabitInstance() {
    if (!this.newHabitName.trim()) { alert('Please enter a descriptive habit routine name.'); return; }

    const daysLabelsReference = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const freshSevenDaysTrack: RollingDayNode[] = daysLabelsReference.map(label => ({
      dayLabel: label,
      done: false
    }));

    const freshAtomicHabit: AtomicHabitStructure = {
      name: this.newHabitName.trim(),
      currentStreak: 0,
      rollingSevenDays: freshSevenDaysTrack
    };

    this.habitsList.push(freshAtomicHabit);
    this.closeHabitDrawer();
    await this.syncHabitsToCloud(); // Stream new entry item to Firebase
  }

  /**
   * 🟢 TOGGLES INDEPENDENT DAY STATUS, ADJUSTS STREAK SCORES, & UPLOADS STATE
   */
  async toggleDayCompletionStatus(habitIdx: number, dayIdx: number) {
    const habit = this.habitsList[habitIdx];
    habit.rollingSevenDays[dayIdx].done = !habit.rollingSevenDays[dayIdx].done;

    // Recalculate Atomic streak chains matching active completions
    this.evaluateStreakConsistencyMetrics(habit);
    
    await this.syncHabitsToCloud(); // Stream bubble state shift to Firebase
  }

  calculateHabitCompletionPercentage(habit: AtomicHabitStructure): number {
    if (!habit.rollingSevenDays) return 0;
    const totalDone = habit.rollingSevenDays.filter(d => d.done).length;
    return Math.round((totalDone / 7) * 100);
  }

  /**
   * Dynamically builds a conic background gradient representing the ring's loaded completion track
   */
  computeCircularProgressGradient(habit: AtomicHabitStructure): string {
    const completionPct = this.calculateHabitCompletionPercentage(habit);
    const degreesTurn = (completionPct / 100) * 360;
    return `conic-gradient(#2a9d8f 0deg ${degreesTurn}deg, #e2e8f0 ${degreesTurn}deg 360deg)`;
  }

  async removeHabitInstance(idx: number) {
    this.habitsList.splice(idx, 1);
    await this.syncHabitsToCloud(); // Sync list deletion reduction to Firebase
  }

  private evaluateStreakConsistencyMetrics(habit: AtomicHabitStructure): void {
    let longestCurrentChain = 0;
    let runningChainCount = 0;

    for (let i = 0; i < habit.rollingSevenDays.length; i++) {
      if (habit.rollingSevenDays[i].done) {
        runningChainCount++;
        if (runningChainCount > longestCurrentChain) {
          longestCurrentChain = runningChainCount;
        }
      } else {
        runningChainCount = 0;
      }
    }
    habit.currentStreak = longestCurrentChain;
  }
}