import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousingLocationGridComponent } from './housing-location-grid.component';

describe('HousingLocationGridComponent', () => {
  let component: HousingLocationGridComponent;
  let fixture: ComponentFixture<HousingLocationGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HousingLocationGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HousingLocationGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
