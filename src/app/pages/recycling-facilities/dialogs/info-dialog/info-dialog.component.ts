import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RecyclingFacilityInfo } from '../../../../models/recycling-facility';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AdminService } from '../../../../services/admin/admin.service';
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatIconModule
],
  templateUrl: './info-dialog.component.html',
  styleUrl: './info-dialog.component.scss'
})
export class InfoDialogComponent implements OnInit {
  facilityForm!: FormGroup;
  isEditMode = false;
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<InfoDialogComponent>,
    private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: RecyclingFacilityInfo | null,
  ) {}

  public isHidden = false;

  ngOnInit(): void {
    this.isEditMode = !!this.data; // true if editing, false if adding
    this.facilityForm = this.fb.group({
      uid: [this.data?.uid || ''],
      facility_name: ['', Validators.required],
      phone_number: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]],
      total_bottles_collected: [0, [Validators.required, Validators.min(0)]],
      status: [true]
    }, {
      validators: this.passwordMatchValidator('password', 'confirm_password')
    });
    
    // If editing, remove email/password validators
    if (this.isEditMode) {
      this.facilityForm = this.fb.group({
        uid: [this.data?.uid || ''],
        facility_name: [this.data?.facility_name || '', Validators.required],
        phone_number: [this.data?.phone_number || '', Validators.required],
        password: [''],
        confirm_password: ['',],
        total_bottles_collected: [this.data?.total_bottles_collected || 0, [Validators.required, Validators.min(0)]],
        status: [this.data?.status ?? true]
      });
      
      
      this.facilityForm.get('email')?.clearValidators();
      this.facilityForm.get('password')?.clearValidators();
      this.facilityForm.get('confirm_password')?.clearValidators();
    }
  }

  async onSave(): Promise<void> {
    if (this.facilityForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    const { password, ...formValue } = this.facilityForm.value; // exclude password from formValue

    try {
      if (this.isEditMode) {
        await this.adminService.updateRecycler(formValue.uid, formValue);
      } else {
        await this.adminService.createRecyclerUser(formValue.email, password, formValue).toPromise()
      }
  
      this.dialogRef.close(formValue);
    } catch (error: any) {
      console.error('Error saving facility:', error);
      this.errorMessage =
        error.code === 'auth/email-already-in-use'
          ? 'Email is already in use.'
          : error.message || 'An unexpected error occurred.';
    } finally {
      this.loading = false;
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // close dialog without data
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.charCode || event.keyCode;
    // Allow only digits (0–9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  
  blockNonNumericPaste(event: ClipboardEvent) {
    const pastedData = event.clipboardData?.getData('text') ?? '';
    if (!/^[0-9]*$/.test(pastedData)) {
      event.preventDefault();
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
