import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import { Router, RouterOutlet } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@ngbracket/ngx-layout'; 
import { AuthService } from '../services/auth/auth.service';
import { RouterModule } from '@angular/router';
import { RealtimeDbService } from '../services/realtime-db/realtime-db.service';
import { Module } from '../models/module';
import { UserInfo } from '../models/user-info';

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
    FlexLayoutModule,
    RouterModule
  ],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss'
})
export class PagesComponent implements OnInit {
  public isLoading: boolean = false;
  public routes: Module[] = []
  public user: UserInfo | undefined;

  constructor(
    private authService: AuthService,
    public router: Router,
    private realtimeDB: RealtimeDbService
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.realtimeDB.getUserInfo().then((user: UserInfo) => {
      localStorage.setItem("user_data", JSON.stringify(user))
      this.user = user;
      this.realtimeDB.getModules().then((modules) => {
        this.routes = Object.values(modules)
          .filter((m: any) => m.roles[user.role])
          .map((m: any) => m.data);
      });
    });
  }

  public logout() {
    console.log('test');
    this.authService.logout()
      .then(() => {
        this.router.navigate(['/login']);
        localStorage.clear()
      })
      .catch(err => console.error('Logout error:', err));
  }
}
