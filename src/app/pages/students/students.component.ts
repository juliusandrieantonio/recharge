import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { FlexModule } from '@ngbracket/ngx-layout';
import { StringFormatPipe } from '../../helper/string-helper';
import { NgFor } from '@angular/common';

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
export class StudentsComponent {
  public displayedColumns: string[] = ['name', 'email', 'phone', 'bottles'];

  public dataSource = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+63 912 345 6789',
      bottles: 12,
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+63 923 456 7890',
      bottles: 8,
    },
    {
      name: 'Michael Reyes',
      email: 'michael.reyes@example.com',
      phone: '+63 934 567 8901',
      bottles: 15,
    },
    {
      name: 'Angela Cruz',
      email: 'angela.cruz@example.com',
      phone: '+63 945 678 9012',
      bottles: 20,
    },
    {
      name: 'David Santos',
      email: 'david.santos@example.com',
      phone: '+63 956 789 0123',
      bottles: 5,
    },
    {
      name: 'Angela Cruz',
      email: 'angela.cruz@example.com',
      phone: '+63 945 678 9012',
      bottles: 20,
    },
    {
      name: 'David Santos',
      email: 'david.santos@example.com',
      phone: '+63 956 789 0123',
      bottles: 5,
    },
  ];
}
