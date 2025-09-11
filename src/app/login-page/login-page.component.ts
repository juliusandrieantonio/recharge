import { Component } from '@angular/core';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth/auth.service';
import { Credentials } from '../models/credentials'
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgClass } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    FlexLayoutModule, 
    NgClass, 
    MatCardModule, 
    MatInputModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatButtonModule, 
    MatIconModule, 
    RouterModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  public isMobile = false;
  public loginForm = new FormGroup({
    phone_number: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  public isHidden: boolean = false;
  public errorMessage: string = "";
  public isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver
  ) {
      this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => this.isMobile = result.matches);
  }

  public onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      let params: Credentials = {
        username: this.loginForm.value.phone_number || '',
        password: this.loginForm.value.password || '',
        phone_number: this.loginForm.value.phone_number || '',
      }
      this.authService.getEmailByPhone(params.phone_number || '').then((email: string | null) => {
        if (!email) {
          throw new Error("Phone number not found");
        }
      
        let params: Credentials = {
          username: email,
          password: this.loginForm.value.password || '',
        };
      
        return this.authService.login(params.username, params.password);
      })
      .then((res: any) => {
        this.router.navigate(['/pages/dashboard']);
        console.log(res);
      })
      .catch((err: any) => {
        console.error(err);
        this.errorMessage = "Incorrect phone number or password";
      })
      .finally(() => {
        this.isLoading = false;
      });

    } 
    else {
      this.loginForm.markAllAsTouched(); // force showing all errors
    }
  }
}
