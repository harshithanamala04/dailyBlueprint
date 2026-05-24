// src/app/auth/name/name.component.ts
import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-names',
  templateUrl: './names.component.html',
  styleUrls: ['./names.component.css'],
  // Enforces structural style isolation so it never touches your layout views
  encapsulation: ViewEncapsulation.Emulated 
})
export class NameComponent {
  // Pre-filled sample value matching your mockup reference
  userNameProfile: string = 'Harshitha Namala'; 

  constructor(private appRouter: Router) {}

  // src/app/auth/names/names.component.ts
  finalizeAuthenticationSession(): void {
  console.log('Attempting layout activation...');
  // 🚀 ROUTING LINK: Clears the login funnel and pushes you into the main application grid canvas!
  this.appRouter.navigate(['/app/daily-plan']); 
}
}