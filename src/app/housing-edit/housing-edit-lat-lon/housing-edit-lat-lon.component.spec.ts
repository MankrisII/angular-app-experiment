import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousingEditLatLonComponent as HousingEditLatLonComponent } from './housing-edit-lat-lon.component';

describe('HousingEditLatLongComponent', () => {
  let component: HousingEditLatLonComponent;
  let fixture: ComponentFixture<HousingEditLatLonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HousingEditLatLonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HousingEditLatLonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
