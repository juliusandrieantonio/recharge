import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { FlexModule } from '@ngbracket/ngx-layout';
import { StringFormatPipe } from '../../helper/string-helper';
import { NgFor } from '@angular/common';
import { AdminService } from '../../services/admin/admin.service';
import { UserInfo } from '../../models/user-info';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    MatIconModule,
    FlexModule,
    StringFormatPipe,
    NgFor
  ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})
export class StudentsComponent implements OnInit {
  public displayedColumns: string[] = ['email', 'phone_number', 'total_bottles', 'status'];

  public dataSource: UserInfo[] = [];

  constructor(
    private adminService: AdminService
  ) {

  }
  ngOnInit(): void {
    this.adminService.getStudents().subscribe(data => {
      console.log(data)
      this.dataSource = data;
    })
  }
}
