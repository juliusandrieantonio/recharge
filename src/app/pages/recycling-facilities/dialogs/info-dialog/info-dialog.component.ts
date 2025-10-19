import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RecyclingFacilityInfo } from '../../../../models/recycling-facility';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AdminService } from '../../../../services/admin/admin.service';
import { MatProgressBarModule } from "@angular/material/progress-bar";

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

  ngOnInit(): void {
    this.isEditMode = !!this.data; // true if editing, false if adding

    this.facilityForm = this.fb.group({
      uid: [this.data?.uid || ''],
      facility_name: ['', Validators.required],
      phone_number: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      total_bottles_collected: [0, [Validators.required, Validators.min(0)]],
      status: [true]
    });
    
    // If editing, remove email/password validators
    if (this.isEditMode) {
      this.facilityForm = this.fb.group({
        uid: [this.data?.uid || ''],
        facility_name: [this.data?.facility_name || '', Validators.required],
        phone_number: [this.data?.phone_number || '', Validators.required],
        password: [''],
        total_bottles_collected: [this.data?.total_bottles_collected || 0, [Validators.required, Validators.min(0)]],
        status: [this.data?.status ?? true]
      });
      
      
      this.facilityForm.get('email')?.clearValidators();
      this.facilityForm.get('password')?.clearValidators();
      this.facilityForm.get('email')?.updateValueAndValidity();
      this.facilityForm.get('password')?.updateValueAndValidity();
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
        await this.adminService.createRecyclerUser(formValue.email, password, formValue);
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
}
