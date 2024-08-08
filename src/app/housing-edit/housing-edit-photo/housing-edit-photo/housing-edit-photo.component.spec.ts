import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousingEditPhotoComponent } from './housing-edit-photo.component';

describe('HousingEditPhotoComponent', () => {
  let component: HousingEditPhotoComponent;
  let fixture: ComponentFixture<HousingEditPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HousingEditPhotoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HousingEditPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
