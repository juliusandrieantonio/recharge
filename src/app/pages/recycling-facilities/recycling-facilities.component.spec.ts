import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecyclingFacilitiesComponent } from './recycling-facilities.component';

describe('RecyclingFacilitiesComponent', () => {
  let component: RecyclingFacilitiesComponent;
  let fixture: ComponentFixture<RecyclingFacilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecyclingFacilitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecyclingFacilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
