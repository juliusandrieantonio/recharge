import { Component, OnInit } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { FlexLayoutModule } from "@ngbracket/ngx-layout";
import {  MatIconModule } from "@angular/material/icon";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin/admin.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from '../../services/settings/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    MatCardModule, 
    FlexLayoutModule, 
    MatIconModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  public isEditing: boolean = false;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      points_per_bottle: [0, Validators.required],
      minutes_per_points: [0, Validators.required],
      bottles_per_school_chair: [0, Validators.required],
      bottles_per_kg_waste: [0, Validators.required],
      bottles_per_trash_bag: [0, Validators.required],
      energy_save_per_bottle: [0, Validators.required]
    });
    this.loadSettings();
    this.form.disable();
  }

  async loadSettings() {
    this.settingsService.settings$.subscribe(data => {
      if (data) {
        this.form.patchValue(data)
      }
    });
  }

  async toggleEditSave() {
    if (this.isEditing) {
      if (this.form.dirty) {
        if (this.form.valid) {
          const settings = {
            points_per_bottle: Number(this.form.value.points_per_bottle),
            minutes_per_points: Number(this.form.value.minutes_per_points),
            bottles_per_school_chair: Number(this.form.value.bottles_per_school_chair),
            bottles_per_kg_waste: Number(this.form.value.bottles_per_kg_waste),
            bottles_per_trash_bag: Number(this.form.value.bottles_per_trash_bag),
            energy_save_per_bottle: Number(this.form.value.energy_save_per_bottle),
          };
  
          try {
            await this.settingsService.updateSettings(settings);
  
            this.snackBar.open('Settings saved successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
  
            this.form.markAsPristine();
  
          } catch (err) {
            console.error(err);
            this.snackBar.open('Failed to save settings.', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
          }
        }
      } else {
        this.snackBar.open('No changes to save.', 'Close', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
  
      this.form.disable();
  
    } else {
      this.form.enable();
    }
  
    this.isEditing = !this.isEditing;
  }
  
}
