import { Component } from '@angular/core';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth/auth.service';
import { Credentials } from '../models/credentials'
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FlexLayoutModule, MatCardModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  public loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  public isHidden: boolean = false;
  public errorMessage: string = "";
  constructor(
    private router: Router,
    private authService: AuthService) {
      authService.logout()
  }

  public onSubmit() {
    if (this.loginForm.valid) {
      let params: Credentials = {
        username: this.loginForm.value.username || '',
        password: this.loginForm.value.password || '',
      }
      
      this.authService.login(params.username, params.password).then((res: any) => {
        this.router.navigate(['/pages/dashboard']);
        console.log(res)
      }).catch((err: any) => {
        this.errorMessage = "Incorrect username or password";
      });

    } 
    else {
      this.loginForm.markAllAsTouched(); // force showing all errors
    }
  }
}
