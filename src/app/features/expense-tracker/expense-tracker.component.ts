import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';

interface TransactionStructure {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  dateStamp: string; // ◄ This perfectly satisfies the HTML template property check
}

@Component({
  selector: 'app-expense-tracker',
  templateUrl: './expense-tracker.component.html',
  styleUrls: ['./expense-tracker.component.css']
})
export class ExpenseTrackerComponent implements OnInit {

  // Primary Data Logs Array
  transactionHistoryLog: TransactionStructure[] = [];
  
  // Budget Allocations Math Hooks
  totalAllocatedBudget: number = 20000;
  remainingActualBalance: number = 20000;
  totalMoneySpent: number = 0;

  // Drawer Form Binding Structural Hooks
  newTxDescription: string = '';
  newTxAmount: number | null = null;
  newType: 'income' | 'expense' = 'expense';
  newCategory: string = 'Food';
  showAddDrawer: boolean = false;

  // 🔑 Shared Mock User Identity Token
  private userId = 'student_user_123';

  constructor(private firebaseService: FirebaseService) { }

  async ngOnInit() {
    await this.loadExpensesFromCloud();
  }

  /**
   * 📡 PULLS FRESH DATA FROM FIREBASE ON LOAD
   */
  async loadExpensesFromCloud() {
    const cloudExpenses = await this.firebaseService.getExpenseData(this.userId);
    if (cloudExpenses) {
      this.transactionHistoryLog = cloudExpenses.transactionHistoryLog || [];
      this.totalAllocatedBudget = cloudExpenses.totalAllocatedBudget ?? 20000;
    } else {
      // Baseline fallbacks if cloud profile branch is completely clean
      this.transactionHistoryLog = [];
      this.totalAllocatedBudget = 20000;
    }
    this.evaluateFinancialBalancingMath();
  }

  /**
   * 🚀 STREAMS BOTH LOGS AND BALANCES TO THE REALTIME CLOUD NODE
   */
  async syncExpensesToCloud() {
    const dataToSave = {
      transactionHistoryLog: this.transactionHistoryLog,
      totalAllocatedBudget: this.totalAllocatedBudget
    };
    await this.firebaseService.saveExpenseData(this.userId, dataToSave);
  }

  // --- DRAWER ACTIONS ---
  openExpenseDrawer(): void { this.showAddDrawer = true; }
  closeExpenseDrawer(): void {
    this.showAddDrawer = false;
    this.resetFormFields();
  }

  resetFormFields(): void {
    this.newTxDescription = '';
    this.newTxAmount = null;
    this.newType = 'expense';
    this.newCategory = 'Food';
  }

  /**
   * ＋ COMMITS NEW LEDGER INSTANCE FROM DRAWERS TO FIREBASE
   */
  async commitTransactionToBucket() {
    if (!this.newTxDescription.trim() || !this.newTxAmount || this.newTxAmount <= 0) {
      alert('Please fill out a valid description and numeric amount details.');
      return;
    }

    const newTransaction: TransactionStructure = {
      id: Date.now(),
      description: this.newTxDescription.trim(),
      amount: this.newTxAmount,
      type: this.newType,
      category: this.newCategory,
      dateStamp: new Date().toISOString().split('T')[0] // ◄ Sets the dateStamp key cleanly
    };

    this.transactionHistoryLog.unshift(newTransaction);
    this.evaluateFinancialBalancingMath();
    this.closeExpenseDrawer();
    await this.syncExpensesToCloud(); // Push up to cloud database node
  }

  /**
   * 🗑️ VOIDS SELECTED TRANSACTION RECORD
   */
  async removeTransactionFromLedger(index: number) {
    this.transactionHistoryLog.splice(index, 1);
    this.evaluateFinancialBalancingMath();
    await this.syncExpensesToCloud(); // Sync deletion update to cloud database node
  }

  /**
   * 📊 EVALUATES TOTAL BALANCE AND LEDGER MATH
   */
  evaluateFinancialBalancingMath(): void {
    this.totalMoneySpent = this.transactionHistoryLog
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncomeInjections = this.transactionHistoryLog
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    this.remainingActualBalance = (Number(this.totalAllocatedBudget) + totalIncomeInjections) - this.totalMoneySpent;
  }
}