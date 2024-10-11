import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousingLocationMapComponent } from './housing-location-map.component';

describe('HousingLocationMapComponent', () => {
  let component: HousingLocationMapComponent;
  let fixture: ComponentFixture<HousingLocationMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HousingLocationMapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HousingLocationMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
