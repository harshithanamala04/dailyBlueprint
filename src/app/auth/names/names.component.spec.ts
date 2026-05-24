// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { NamesComponent } from './names.component';
// import { RouterTestingModule } from '@angular/router/testing'; // ◄ 2. Import Router Test Module
// describe('NamesComponent', () => {
//   let component: NamesComponent;
//   let fixture: ComponentFixture<NamesComponent>;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [NamesComponent]
//     });
//     fixture = TestBed.createComponent(NamesComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NameComponent } from './names.component';
import { FormsModule } from '@angular/forms';          // ◄ 1. Import FormsModule
import { RouterTestingModule } from '@angular/router/testing'; // ◄ 2. Import Router Test Module

describe('NamesComponent', () => {
  let component: NameComponent;
  let fixture: ComponentFixture<NameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NameComponent ],
      imports: [ FormsModule, RouterTestingModule ] // ◄ 3. Inject them into the test registry!
    })
    .compileComponents();

    fixture = TestBed.createComponent(NameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});