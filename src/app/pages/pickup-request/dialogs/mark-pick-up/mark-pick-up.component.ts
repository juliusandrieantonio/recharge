import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RecyclingFacilityHistory, RecyclingFacilityInfo } from '../../../../models/recycling-facility';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RecyclingService } from '../../../../services/recycling/recycling.service';

@Component({
  selector: 'app-mark-pick-up',
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
  templateUrl: './mark-pick-up.component.html',
  styleUrl: './mark-pick-up.component.scss'
})
export class MarkPickUpComponent {
  public requestForm: FormGroup;
  public loading: boolean = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MarkPickUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RecyclingFacilityHistory,
    private recyclingService: RecyclingService
  ) {
    this.requestForm = this.fb.group({
      actual_bottles: ['']
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
      this.data.actual_bottles = this.requestForm.value.actual_bottles;
      this.data.status = true;
      await this.recyclingService.updateRequest(this.data.id, this.data);

      this.dialogRef.close(this.data);
    } catch (err: any) {
      console.error('Failed to add pickup request:', err);
      this.errorMessage = err.message || 'An unexpected error occurred';
    } finally {
      this.loading = false;
    }
  }
}
