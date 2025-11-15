import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { StudentService } from '../../services/student/student.service';
import { SettingsService } from '../../services/settings/settings.service';

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
  public minutes_per_points = 0;
  constructor(
    private studentService: StudentService,
    private settingsService: SettingsService
  ) {}
  
  ngOnInit(): void {
    this.studentService.getStudent().subscribe((data) => {
      this.availablePoints = data.available_points;
    });

    this.settingsService.settings$.subscribe(data => {
      if (data) {
        this.minutes_per_points = data.minutes_per_points;
      }
    });
  }
  
}
