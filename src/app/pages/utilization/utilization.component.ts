import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { FlexLayoutModule } from "@ngbracket/ngx-layout";
import { MatProgressBarModule } from "@angular/material/progress-bar";

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
export class UtilizationComponent {
  public data = {
    bottle_used: 1500,
    total_bottles: 6000,
    armchair_conversion: 100,
    funds_conversion: 500
  }
}
