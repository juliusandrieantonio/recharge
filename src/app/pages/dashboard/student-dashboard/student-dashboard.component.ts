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


@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    FlexLayoutModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    BaseChartDirective
],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss'
})
export class StudentDashboardComponent {
  public data = {
    total_bottles: 10,
    available_points: 100,
    recycling_impact: "5",
    waste_diverted: "0.3 kg",
    flood_risk: "13%"
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
}
