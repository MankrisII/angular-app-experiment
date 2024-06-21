import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousingLocationListComponent } from '../housing-location-grid/housing-location-grid.component';

describe('HousingLocationListComponent', () => {
  let component: HousingLocationListComponent;
  let fixture: ComponentFixture<HousingLocationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HousingLocationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HousingLocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
