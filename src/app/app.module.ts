// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';       // ◄ Essential for [(ngModel)]
import { RouterModule } from '@angular/router';     // ◄ Essential for router-outlet
import { CommonModule } from '@angular/common';     // ◄ Essential for currency/number pipes

// 🚀 DIRECT NATIVE FIREBASE SDK INITIALIZATION
import { initializeApp } from 'firebase/app';

// 🚀 YOUR SECURE CLOUD CREDENTIALS BLOCKS
const firebaseConfig = {
  apiKey: "AIzaSyAepl7hEHICqI2alVbC9spCBEDidNA1Q4E",
  authDomain: "dailyblueprint-183c1.firebaseapp.com",
  projectId: "dailyblueprint-183c1",
  storageBucket: "dailyblueprint-183c1.firebasestorage.app",
  messagingSenderId: "677731727341",
  appId: "1:677731727341:web:799b0db2f00597646e99e4"
};

// 🚀 INITIALIZE IMMEDIATELY FROM LOCAL VARIABLE
initializeApp(firebaseConfig);

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { HerCycleComponent } from './features/her-cycle/her-cycle.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NameComponent, 
    LayoutComponent,
    DailyPlanComponent,
    HabitTrackerComponent,
    ActivityTimerComponent,
    ExpenseTrackerComponent,
    DailyNotesComponent,
    AgeCalculatorComponent,
    BmiCalculatorComponent,
    InterestCalculatorComponent,
    SpecialDaysComponent,
    HerCycleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,   // ◄ Restores input bindings globally
    RouterModule,  // ◄ Restores router links globally
    CommonModule   // ◄ Restores formatting pipes globally
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }