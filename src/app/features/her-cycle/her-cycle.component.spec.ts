import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HerCycleComponent } from './her-cycle.component';

describe('HerCycleComponent', () => {
  let component: HerCycleComponent;
  let fixture: ComponentFixture<HerCycleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HerCycleComponent]
    });
    fixture = TestBed.createComponent(HerCycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
