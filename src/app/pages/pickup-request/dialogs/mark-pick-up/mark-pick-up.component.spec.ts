import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkPickUpComponent } from './mark-pick-up.component';

describe('MarkPickUpComponent', () => {
  let component: MarkPickUpComponent;
  let fixture: ComponentFixture<MarkPickUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkPickUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkPickUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
