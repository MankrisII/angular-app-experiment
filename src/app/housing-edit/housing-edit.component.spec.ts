import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousingEditComponent } from './housing-edit.component';

describe('HousingEditComponent', () => {
  let component: HousingEditComponent;
  let fixture: ComponentFixture<HousingEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HousingEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HousingEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
