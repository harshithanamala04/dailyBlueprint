import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialDaysComponent } from './special-days.component';

describe('SpecialDaysComponent', () => {
  let component: SpecialDaysComponent;
  let fixture: ComponentFixture<SpecialDaysComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecialDaysComponent]
    });
    fixture = TestBed.createComponent(SpecialDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
