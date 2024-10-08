import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdressInputComponent } from './adress-input.component';

describe('AdressInputComponent', () => {
  let component: AdressInputComponent;
  let fixture: ComponentFixture<AdressInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdressInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdressInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
