import { Component } from '@angular/core';
import { FlexLayoutModule } from "@ngbracket/ngx-layout";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatButtonModule } from "@angular/material/button";
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { MatDividerModule } from "@angular/material/divider";
import { ProgressBarComponent } from "../../../utilities/progress-bar/progress-bar.component";
import { AdminService } from '../../../services/admin/admin.service';
import { DashboardData } from '../../../models/dashboard-data';
import { MONTHS_NAME } from '../../../constants/constants';
import { getPreviousYearMonth, getYear, getYearMonth } from '../../../helper/date-helper';
import { forkJoin, map, Subject, switchMap, takeUntil } from 'rxjs';


@Component({
  selector: 'app-recycling-dashboard',
  standalone: true,
  imports: [
    FlexLayoutModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    BaseChartDirective,
    MatDividerModule,
    ProgressBarComponent
],
  templateUrl: './recycling-dashboard.component.html',
  styleUrl: './recycling-dashboard.component.scss'
})
export class RecyclingDashboardComponent {
  public data: DashboardData = {
    monthly_target: 0,
    total_active_students: 0,
    total_bottles: 0,
    total_redemptions: 0,
    total_bottles_collected_last_month: 0
  };
  public barChartPlugins = [];
  public barChartData: ChartConfiguration<'bar'>['data'] | undefined;
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false
  };
  private destroy$ = new Subject<void>();

  constructor(
      private adminService: AdminService
  ) {
    
  }
  
  ngOnInit(): void {
    
    this.adminService.getDashboard(getYearMonth())
    .pipe(
      switchMap(currentMonth =>
        this.adminService.getDashboard(getPreviousYearMonth()).pipe(
          map(prevMonth => ({ currentMonth, prevMonth }))
        )
      ),
      takeUntil(this.destroy$)  // automatically unsubscribe on destroy
    )
    .subscribe(({ currentMonth, prevMonth }) => {
      this.data = currentMonth;
      this.data.total_bottles_collected_last_month = prevMonth.total_bottles;
    });

    

    this.adminService.getMonthlyContrib(getYear()).subscribe(data => {
      const labels = Object.values(data).map(key => {
        const monthIndex = parseInt(key.month, 10) - 1;
        return MONTHS_NAME[monthIndex] ?? key.month;
      });
      this.barChartData = {
        labels: labels,
        datasets: [
          {
            data: Object.values(data).map((entry: any) => entry.bottles),
            label: 'Bottles',
            backgroundColor: ['#10B981'],
          }
        ]
      };
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
