import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousingDetailsComponent } from './housing-details.component';

describe('HousingDetailsComponent', () => {
  let component: HousingDetailsComponent;
  let fixture: ComponentFixture<HousingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HousingDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HousingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
