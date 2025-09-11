import { Component, OnInit } from '@angular/core';
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
import { AdminService } from '../../../services/admin/admin.service';
import { DashboardData } from '../../../models/dashboard-data';
import { MONTHS_NAME } from '../../../constants/constants';
import { Machine } from '../../../models/machine';
import { getYear, getYearMonth } from '../../../helper/date-helper';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    FlexLayoutModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    BaseChartDirective,
    MatDividerModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  public data: DashboardData | undefined;
  public machines: Machine[] | undefined;
  public barChartPlugins = [];
  public barChartData: ChartConfiguration<'bar'>['data'] | undefined;
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false // let it fill width & height
  };

  constructor(
    private adminService: AdminService
  ) {
    
  }

  ngOnInit(): void {
    this.adminService.getDashboard(getYearMonth()).subscribe(data => {
      this.data = data;
    });

    this.adminService.getMonthlyContrib(getYear()).subscribe(data => {
      // Aggregate bottles per month
      const aggregated: Record<string, number> = {};
    
      data.forEach((entry: any) => {
        const key = `${entry.month}`;
        aggregated[key] = (aggregated[key] || 0) + (entry.bottles || 0);
      });
    
      const labels = Object.keys(aggregated).map(month => {
        const monthIndex = parseInt(month, 10) - 1;
        return MONTHS_NAME[monthIndex] ?? month;
      });
    
      this.barChartData = {
        labels: labels,
        datasets: [
          {
            data: Object.values(aggregated),
            label: 'Bottles',
            backgroundColor: ['#10B981'],
          }
        ]
      };
    });
    

    this.adminService.getMachines().subscribe(data => {
      this.machines = data;
    })
  }

  public getMachineStatus(level: number): { label: string, cssClass: string } {
    if (level >= 100) {
      return { label: 'FULL', cssClass: 'red-pill' };
    } else if (level < 60) {
      return { label: 'LOW', cssClass: 'green-pill' };
    } else {
      return { label: 'ALMOST FULL', cssClass: 'warning-pill' };
    }
  }

  getChargerUsage(machine: Machine): number {
    if (machine.charging_slots || machine.charging_slots === 0) {
      return 0;
    }
    return Math.round(
      (machine.available_charging_slots / machine.charging_slots) * 100
    );
  }
}
