import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { StudentService } from '../../services/student/student.service';

@Component({
  selector: 'app-redeem',
  standalone: true,
  imports: [
    FlexLayoutModule,
    MatCardModule
  ],
  templateUrl: './redeem.component.html',
  styleUrl: './redeem.component.scss'
})
export class RedeemComponent implements OnInit{
  public availablePoints!: number;
  constructor(
    private studentService: StudentService
  ) {}
  
  ngOnInit(): void {
    this.studentService.getStudent().subscribe((data) => {
      this.availablePoints = data.available_points;
    });
  }
  
}
