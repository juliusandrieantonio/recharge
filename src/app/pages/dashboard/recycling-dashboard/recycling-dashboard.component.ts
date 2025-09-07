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
  public data!: DashboardData;
  public barChartPlugins = [];
  public barChartData: ChartConfiguration<'bar'>['data'] | undefined;
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false
  };

  constructor(
      private adminService: AdminService
  ) {
    
  }
  
  ngOnInit(): void {
    this.adminService.getDashboard(getYearMonth()).subscribe(data => {
      this.data = data;
    });

    this.adminService.getDashboard(getPreviousYearMonth()).subscribe(data => {
      this.data.total_bottles_collected_last_month = data.total_bottles;
      console.log(data.total_bottles_collected_last_month)
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
}
