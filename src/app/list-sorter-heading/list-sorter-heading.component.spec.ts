import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSorterHeadingComponent } from './list-sorter-heading.component';

describe('ListSorterHeadingComponent', () => {
  let component: ListSorterHeadingComponent;
  let fixture: ComponentFixture<ListSorterHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSorterHeadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSorterHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
