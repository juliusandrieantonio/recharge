import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { FlexLayoutModule } from "@ngbracket/ngx-layout";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { RecyclingService } from '../../services/recycling/recycling.service';
import { getYear } from '../../helper/date-helper';
import { UtilizationData } from '../../models/utilization';

@Component({
  selector: 'app-utilization',
  standalone: true,
  imports: [
    FlexLayoutModule,
    MatCardModule,
    MatDividerModule,
    MatProgressBarModule
],
  templateUrl: './utilization.component.html',
  styleUrl: './utilization.component.scss'
})
export class UtilizationComponent implements OnInit {
  public data: UtilizationData = {
    bottle_used: 0,
    armchair_conversion: 0,
    funds_conversion: 0,
    total_bottles_collected: 0
  };


  constructor(private recyclingService: RecyclingService) {}

  ngOnInit(): void {
    this.recyclingService.getUtilization(getYear()).subscribe(data => {
      console.log(data)
      this.data = data;
    })
  }

  public getArmChairs(bottle_used: number, armchair_conversion: number) {
    return Math.floor(bottle_used / armchair_conversion)
  }
}
