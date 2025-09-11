import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { FlexModule } from '@ngbracket/ngx-layout';
import { StringFormatPipe } from '../../helper/string-helper';
import { CommonModule, NgFor } from '@angular/common';
import { StudentService } from '../../services/student/student.service';
import { StudentRedemptions } from '../../models/student-remdemption';
import { DateToMonthPipe } from '../../helper/date-helper';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    MatIconModule,
    FlexModule,
    StringFormatPipe,
    DateToMonthPipe,
    NgFor,
    CommonModule
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {

  public displayedColumns: string[] = ['date', 'points', 'charging_time'];

  public dataSource!: StudentRedemptions[];
  
  constructor(
    private studentService: StudentService
  ) {

  }
  ngOnInit(): void {
    this.studentService.getRedeemptions().subscribe((data) => {
      this.dataSource = data;
    });
  }

}
