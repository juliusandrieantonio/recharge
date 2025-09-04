import { Component, OnInit } from '@angular/core';
import { UserInfo } from '../../models/user-info';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { RecyclingDashboardComponent } from './recycling-dashboard/recycling-dashboard.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AdminDashboardComponent,
    StudentDashboardComponent,
    RecyclingDashboardComponent
  ],
  providers: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  public user: UserInfo | undefined;
  
  ngOnInit(): void {
    let user = localStorage.getItem("user_data")
    if (user) {
      console.log(user)
      this.user = JSON.parse(user)
    }
  }

}
