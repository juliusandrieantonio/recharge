import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { FlexModule } from '@ngbracket/ngx-layout';
import { StringFormatPipe } from '../../helper/string-helper';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    MatIconModule,
    FlexModule,
    StringFormatPipe,
    NgFor
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {

  public displayedColumns: string[] = ['date', 'points', 'charging_time'];

  public dataSource = [
    { date: '2025-09-01', points: 120, charging_time: '01:20:35' },
    { date: '2025-09-02', points: 95,  charging_time: '00:45:12' },
    { date: '2025-09-03', points: 150, charging_time: '02:10:08' },
    { date: '2025-09-01', points: 120, charging_time: '01:20:35' },
    { date: '2025-09-02', points: 95,  charging_time: '00:45:12' },
    { date: '2025-09-03', points: 150, charging_time: '02:10:08' },
  ];

}
