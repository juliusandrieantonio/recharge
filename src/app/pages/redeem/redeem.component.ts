import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

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
export class RedeemComponent {
  public data = {
    available_points: 56
  }
}
