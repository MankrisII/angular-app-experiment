import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsOptionAvailableComponent } from './is-option-available.component';

describe('IsOptionAvailableComponent', () => {
  let component: IsOptionAvailableComponent;
  let fixture: ComponentFixture<IsOptionAvailableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsOptionAvailableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IsOptionAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
