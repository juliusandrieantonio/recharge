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
  public data = {
    total_bottles_collected: 20,
    total_bottles_collected_last_month: 10,
    monthly_target: 100,
    active_students: 100,
    total_redemptions: 500,
    recycling_impact: "5",
    waste_diverted: "0.3 kg",
    flood_risk: "13%",
    machine: {
      is_active: true,
      name: "CEIT Veranda",
      level: 70,
      occupied_charger: 2,
      total_charger: 5,
      last_update: "09/05/2025 21:20"
    }
  }

  public doughnutChartLabels: string[] = [ 'Waste (kg)', 'School Chairs', 'CO2 Reduction' ];
  public doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [
      { 
        data: [ 350, 450, 100 ],
        backgroundColor: ['#3B82F6', "#10B981", '#6366F1']
      }
    ];

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'top' },
      datalabels: {
        color: '#fff',
        formatter: (value, ctx) => {
          const dataset = ctx.chart.data.datasets[0].data as number[];
          const total = dataset.reduce((acc, val) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(1) + '%';
          return percentage;
        }
      }
    }
  };

  doughnutChartPlugins = [ChartDataLabels];

  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [ 'Jan', 'Feb', 'March', 'April', 'May', 'June', 'July' ],
    datasets: [
      { 
        data: [ 65, 59, 80, 81, 56, 55, 40 ],
        backgroundColor: ['#10B981']
      }
      
    ]
    
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false // let it fill width & height
  };

  public getMachineStatus(level: number): { label: string, cssClass: string } {
    if (level >= 100) {
      return { label: 'FULL', cssClass: 'red-pill' };
    } else if (level < 60) {
      return { label: 'LOW', cssClass: 'green-pill' };
    } else {
      return { label: 'ALMOST FULL', cssClass: 'warning-pill' };
    }
  }

  getChargerUsage(): number {
    if (!this.data?.machine?.total_charger || this.data.machine.total_charger === 0) {
      return 0;
    }
    return Math.round(
      (this.data.machine.occupied_charger / this.data.machine.total_charger) * 100
    );
  }
}
