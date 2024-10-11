import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousinglocationCardComponent } from './housinglocation-card.component';

describe('HousinglocationCardComponent', () => {
  let component: HousinglocationCardComponent;
  let fixture: ComponentFixture<HousinglocationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HousinglocationCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HousinglocationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
