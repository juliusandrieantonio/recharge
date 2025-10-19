import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RecyclingFacilityInfo } from '../../../../models/recycling-facility';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AdminService } from '../../../../services/admin/admin.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

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
    MatSelectModule,
    MatProgressBarModule
  ],
  templateUrl: './history-dialog.component.html',
  styleUrl: './history-dialog.component.scss'
})
export class HistoryDialogComponent {
  public requestForm: FormGroup;
  public loading: boolean = false;
  errorMessage = '';

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<HistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RecyclingFacilityInfo[]
  ) {
    this.requestForm = this.fb.group({
      uid: [''],
      facility_name: ['', Validators.required],
      requested_bottles: [null, [Validators.required, Validators.min(1)]],
      message: [''],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  async onSave(): Promise<void> {
    if (this.requestForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    console.log(this.requestForm.value)
    try {
      await this.adminService.addPickupRequest(this.requestForm.value.uid, {
        facility_name: this.requestForm.value.facility_name,
        requested_bottles: this.requestForm.value.requested_bottles,
        message: this.requestForm.value.message,
      });

      this.dialogRef.close(this.requestForm.value);
    } catch (err: any) {
      console.error('Failed to add pickup request:', err);
      this.errorMessage = err.message || 'An unexpected error occurred';
    } finally {
      this.loading = false;
    }
  }
}
