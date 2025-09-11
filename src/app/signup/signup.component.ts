import { Component } from '@angular/core';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth/auth.service';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgClass } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Credentials } from '../models/credentials';

@Component({
  selector: 'app-signup',
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
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  public isMobile = false;
  public form = new FormGroup({
    phone: new FormControl('', [Validators.required, Validators.minLength(9)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirm_password: new FormControl('', [Validators.required, Validators.minLength(6)])
    }, { 
      validators: this.passwordMatchValidator('password', 'confirm_password') 
  });
  public isHidden: boolean = false;
  public errorMessage: string = "";
  public isLoading: boolean = false;

  constructor(
    public router: Router,
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver
  ) {
      this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => this.isMobile = result.matches);
  }

  public onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      let params: Credentials = {
        username: this.form.value.phone || '',
        password: this.form.value.password || '',
        email: this.form.value.email || '',
        phone_number: this.form.value.phone || '',
        role: 'student',
        status: true
      }
      this.authService.register(params)
        .then(() => {
          this.isLoading = false;
          window.location.reload();
        })
        .catch((error: Error) => {
          console.log(error)
          this.isLoading = false;
          if (error.message === 'email-already-in-use') {
            this.errorMessage = 'This email is already in use.';
          } else if (error.message === 'phone-already-in-use') {
            this.errorMessage = 'This phone number is already registered.';
          } else if (error.message === 'weak-password') {
            this.errorMessage = 'Password is too weak.';
          } else {
            this.errorMessage = 'Something went wrong. Please try again.';
          }
        });
    } 
    else {
      this.form.markAllAsTouched(); // force showing all errors
    }
  }

  private passwordMatchValidator(password: string, confirmPassword: string): ValidatorFn {
    return (formGroup: AbstractControl) => {
      const passwordControl = formGroup.get(password);
      const confirmPasswordControl = formGroup.get(confirmPassword);
  
      if (!passwordControl || !confirmPasswordControl) {
        return null; // controls not yet initialized
      }
  
      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['passwordMismatch']) {
        return null; // other errors exist
      }
  
      // check if password and confirmPassword match
      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
  
      return null;
    };
  }
}
