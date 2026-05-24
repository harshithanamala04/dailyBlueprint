import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityTimerComponent } from './activity-timer.component';

describe('ActivityTimerComponent', () => {
  let component: ActivityTimerComponent;
  let fixture: ComponentFixture<ActivityTimerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityTimerComponent]
    });
    fixture = TestBed.createComponent(ActivityTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
