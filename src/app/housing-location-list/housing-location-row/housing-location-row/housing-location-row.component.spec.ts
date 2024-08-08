import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousingLocationRowComponent } from './housing-location-row.component';

describe('HousingLocationRowComponent', () => {
  let component: HousingLocationRowComponent;
  let fixture: ComponentFixture<HousingLocationRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HousingLocationRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HousingLocationRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
