// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { NameComponent } from './auth/names/names.component'; 
import { LayoutComponent } from './features/layout/layout.component';
import { DailyPlanComponent } from './features/daily-plan/daily-plan.component';
import { HabitTrackerComponent } from './features/habit-tracker/habit-tracker.component';
import { ActivityTimerComponent } from './features/activity-timer/activity-timer.component';
import { ExpenseTrackerComponent } from './features/expense-tracker/expense-tracker.component';
import { DailyNotesComponent } from './features/daily-notes/daily-notes.component';
import { AgeCalculatorComponent } from './features/age-calculator/age-calculator.component';
import { BmiCalculatorComponent } from './features/bmi-calculator/bmi-calculator.component';
import { InterestCalculatorComponent } from './features/interest-calculator/interest-calculator.component';
import { SpecialDaysComponent } from './features/special-days/special-days.component';
import { HerCycleComponent } from './features/her-cycle/her-cycle.component'; // 🚀 Add import

import { AuthGuard } from './core/guards/auth.guard'; // ◄ 1. IMPORT YOUR NEW GUARD HERE

const routes: Routes = [
  // Explicitly define the top-level route pathways
  { path: 'login', component: LoginComponent },
  { path: 'name-setup', component: NameComponent }, 

  // Clear out root path variants so they lead directly to the login landing page
  { path: '', component: LoginComponent }, 

  // The main application dashboard shell workspace
  { 
    path: 'app', 
    component: LayoutComponent,
    canActivate: [AuthGuard], // ◄ This securely locks down the layout AND all child pages at once!
    children: [
      { path: '', redirectTo: 'daily-plan', pathMatch: 'full' }, // Defaults to daily-plan view
      { path: 'daily-plan', component: DailyPlanComponent },
      { path: 'habit-tracker', component: HabitTrackerComponent },
      { path: 'activity-timer', component: ActivityTimerComponent },
      { path: 'expense-tracker', component: ExpenseTrackerComponent },
      { path: 'daily-notes', component: DailyNotesComponent },
      { path: 'age-calculator', component: AgeCalculatorComponent },
      { path: 'bmi-calculator', component: BmiCalculatorComponent },
      { path: 'interest-calculator', component: InterestCalculatorComponent },
      { path: 'special-days', component: SpecialDaysComponent },
      { path: 'her-cycle', component: HerCycleComponent}
    ]
  },

  // Secure catch-all fallback protection rule (Redirects to '' which boots up login component)
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }