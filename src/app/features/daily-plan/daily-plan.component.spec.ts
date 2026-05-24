import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPlanComponent } from './daily-plan.component';

describe('DailyPlanComponent', () => {
  let component: DailyPlanComponent;
  let fixture: ComponentFixture<DailyPlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailyPlanComponent]
    });
    fixture = TestBed.createComponent(DailyPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
