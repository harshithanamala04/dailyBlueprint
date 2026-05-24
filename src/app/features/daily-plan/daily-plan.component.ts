import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';

@Component({
  selector: 'app-daily-plan',
  templateUrl: './daily-plan.component.html',
  styleUrls: ['./daily-plan.component.css']
})
export class DailyPlanComponent implements OnInit {
  // 💎 RESTORED ORIGINAL UI STATE FIELDS
  plansList: any[] = [];
  showAddDrawer: boolean = false;
  newPlanText: string = '';
  newPlanTime: string = '';
  newPlanPriority: string = 'medium';
  
  waterCount: number = 0;
  selectedMood: string = '';

  // 🔑 Temporary Mock User Token for Cloud Isolation
  private userId = 'student_user_123';

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    await this.loadDataFromCloud();
  }

  /**
   * 📡 PULLS FRESH DATA FROM FIREBASE REALTIME DATABASE ON INITIALIZATION
   */
  async loadDataFromCloud() {
    const cloudData = await this.firebaseService.getUserData(this.userId);
    if (cloudData) {
      this.plansList = cloudData.plansList || [];
      this.waterCount = cloudData.waterCount || 0;
      this.selectedMood = cloudData.selectedMood || '';
    } else {
      // Default baseline values if it's a completely new cloud profile
      this.plansList = [];
      this.waterCount = 0;
      this.selectedMood = '';
    }
  }

  /**
   * 🚀 SYNCS CURRENT INSTANCE COMPONENT STATES UP TO THE REALTIME CLOUD NODE
   */
  async syncToCloud() {
    const dataToSave = {
      plansList: this.plansList,
      waterCount: this.waterCount,
      selectedMood: this.selectedMood
    };
    await this.firebaseService.saveUserData(this.userId, dataToSave);
  }

  // 📂 DRAWER ACTIONS
  openPlanDrawer() {
    this.showAddDrawer = true;
  }

  closePlanDrawer() {
    this.showAddDrawer = false;
    this.resetDrawerForm();
  }

  resetDrawerForm() {
    this.newPlanText = '';
    this.newPlanTime = '';
    this.newPlanPriority = 'medium';
  }

  // ➕ CREATE NEW PLAN OBJECTIVE
  async createNewPlanInstance() {
    if (this.newPlanText.trim()) {
      const newPlan = {
        id: Date.now(),
        text: this.newPlanText.trim(),
        timeTarget: this.newPlanTime || '12:00',
        priority: this.newPlanPriority,
        completed: false
      };
      
      this.plansList.push(newPlan);
      this.closePlanDrawer();
      await this.syncToCloud(); // Push updated list straight to Firebase
    }
  }

  // 🔄 INTERACTION ACTIONS
  async togglePlanCompletion(index: number) {
    this.plansList[index].completed = !this.plansList[index].completed;
    await this.syncToCloud(); // Push status change straight to Firebase
  }

  async removePlanInstance(index: number) {
    this.plansList.splice(index, 1);
    await this.syncToCloud(); // Sync list reduction straight to Firebase
  }

  async updateWater(amount: number) {
    this.waterCount = Math.max(0, this.waterCount + amount);
    await this.syncToCloud();
  }

  async selectMood(mood: string) {
    this.selectedMood = mood;
    await this.syncToCloud();
  }

  // 📊 COMPUTATION STATISTICS METHODS USED BY YOUR HTML TEMPLATE
  totalCompletedPlans(): number {
    return this.plansList.filter(p => p.completed).length;
  }

  calculateCompletionPercentage(): number {
    if (!this.plansList || this.plansList.length === 0) return 0;
    return Math.round((this.totalCompletedPlans() / this.plansList.length) * 100);
  }

  computeProgressRingGradient(): string {
    const pct = this.calculateCompletionPercentage();
    // Creates a dynamic CSS circular conic-gradient based on tasks cleared
    return `conic-gradient(#ff7f50 ${pct * 3.6}deg, #e2e8f0 0deg)`;
  }

  formatDisplayTime(timeString: string): string {
    if (!timeString) return '12:00 PM';
    try {
      const [hrs, mins] = timeString.split(':');
      const hourNum = parseInt(hrs, 10);
      const ampm = hourNum >= 12 ? 'PM' : 'AM';
      const adjustedHour = hourNum % 12 || 12;
      return `${adjustedHour}:${mins} ${ampm}`;
    } catch {
      return timeString;
    }
  }
}