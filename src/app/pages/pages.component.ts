import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@ngbracket/ngx-layout'; 

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [
    MatToolbarModule, 
    CommonModule, 
    MatListModule, 
    MatButtonModule, 
    MatIconModule, 
    MatExpansionModule, 
    MatSidenavModule, 
    RouterOutlet, 
    MatProgressBarModule,
    FlexLayoutModule
  ],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss'
})
export class PagesComponent {
  public isLoading: boolean = false;
  public routes = [
    {
      data: {
        icon: 'dashboard',
        name: 'Dashboard',
        path: 'dashboard'
      }
    },
    {
      data: {
        icon: 'History',
        name: 'History',
        path: 'History'
      }
    },
    {
      data: {
        icon: 'Students',
        name: 'Students',
        path: 'Students'
      }
    },
    {
      data: {
        icon: 'Redeem',
        name: 'Redeem',
        path: 'Redeem'
      }
    },
  ]
}
