import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecyclingDashboardComponent } from './recycling-dashboard.component';

describe('RecyclingDashboardComponent', () => {
  let component: RecyclingDashboardComponent;
  let fixture: ComponentFixture<RecyclingDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecyclingDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecyclingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
