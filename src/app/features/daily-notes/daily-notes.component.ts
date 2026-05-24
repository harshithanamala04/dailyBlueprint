// src/app/features/daily-notes/daily-notes.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';

@Component({
  selector: 'app-daily-notes',
  templateUrl: './daily-notes.component.html',
  styleUrls: ['./daily-notes.component.css']
})
export class DailyNotesComponent implements OnInit, OnDestroy {

  // 💎 RESTORED ORIGINAL TEMPLATE UI VARIABLES
  noteTitle: string = '';
  noteContent: string = '';
  isEditingMode: boolean = false;
  currentDateStamp: string = '';

  userId: string = ''; 
  private notesSubscriptionCloseHook?: () => void;

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    // Generate a clean date layout for your template badge
    this.currentDateStamp = new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    // 📡 CONNECT LIVE REAL-TIME CLOUD STREAM
    this.notesSubscriptionCloseHook = this.firebaseService.streamNotesData((cloudMemo) => {
      if (cloudMemo) {
        // Automatically sync cloud fields into your editor variables
        this.noteTitle = cloudMemo.title || '';
        this.noteContent = cloudMemo.content || '';
        console.log('Live Cloud Stream Update: Notepad updated in real-time.');
      }
    });
  }

  /**
   * 🔄 OPEN THE EDITOR CANVAS
   */
  enableEditor(): void {
    this.isEditingMode = true;
  }

  /**
   * 💾 SAVE CHANGES & TRANSMIT STREAM TO CLOUD
   */
  async saveAndCloseEditor() {
    this.isEditingMode = false;

    const dataToSave = {
      title: this.noteTitle,
      content: this.noteContent,
      lastUpdated: new Date().toISOString()
    };

    try {
      // Stream changes up to the secure Firebase User UID node
      await this.firebaseService.saveNotesData(dataToSave);
      console.log('Notepad content securely synchronized to your cloud node.');
    } catch (error) {
      console.error('Failed to dispatch notes data payload:', error);
    }
  }

  ngOnDestroy(): void {
    // Cleanly tear down the live observer channel when exiting the module view
    if (this.notesSubscriptionCloseHook) {
      this.notesSubscriptionCloseHook();
      console.log('Live cloud note listener cleanly disconnected.');
    }
  }
}