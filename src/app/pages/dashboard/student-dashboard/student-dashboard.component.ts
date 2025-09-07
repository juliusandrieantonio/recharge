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
import { StudentService } from '../../../services/student/student.service';
import { StudentStats } from '../../../models/student-stats';
import { MONTHS_NAME } from '../../../constants/constants';
import { getYear } from '../../../helper/date-helper';

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
    BaseChartDirective,
  ],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss'
})
export class StudentDashboardComponent implements OnInit {
  public data: StudentStats | undefined;
  public barChartData: ChartConfiguration<'bar'>['data'] | undefined;
  
  constructor(private studentService: StudentService) {

  }
  ngOnInit(): void {
    this.studentService.getStudent().subscribe((data) => {
      this.data = data;
      this.data.recycling_impact = Math.floor(data.total_bottles / 50);
      this.data.waste_diverted = data.total_bottles / 100;
      this.data.flood_risk = data.total_bottles / 100;
    });

    this.studentService.getMonthlyContrib(getYear()).subscribe((data) => {
      const labels = Object.keys(data).map(key => {
        // key might be "01", "02", etc → convert to number (1–12)
        const monthIndex = parseInt(key, 10) - 1;
        return MONTHS_NAME[monthIndex] ?? key; // fallback to key if invalid
      });

      console.log(Object.values(data))
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

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false // let it fill width & height
  };
}
