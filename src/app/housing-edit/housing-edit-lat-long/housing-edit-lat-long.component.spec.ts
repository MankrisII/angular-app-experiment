import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousingEditLatLongComponent } from './housing-edit-lat-long.component';

describe('HousingEditLatLongComponent', () => {
  let component: HousingEditLatLongComponent;
  let fixture: ComponentFixture<HousingEditLatLongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HousingEditLatLongComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HousingEditLatLongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
