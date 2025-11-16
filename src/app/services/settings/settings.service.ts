import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdminService } from '../admin/admin.service';
import { SystemSettings } from '../../models/settings';

@Injectable({
  providedIn: 'root'
})

export class SettingsService {
  // BehaviorSubject holds the latest value and emits to subscribers
  private settingsSubject = new BehaviorSubject<SystemSettings | null>(null);

  constructor(private adminService: AdminService) {
    this.loadSettings();
  }

  // Observable for other components to subscribe
  public get settings$(): Observable<SystemSettings | null> {
    return this.settingsSubject.asObservable();
  }

  // Load settings from Firebase
  loadSettings() {
    this.adminService.getSettings().subscribe((data: any) => {
      if (data) {
        // Convert numeric fields just in case
        const settings: SystemSettings = {
          points_per_bottle: Number(data.points_per_bottle),
          minutes_per_points: Number(data.minutes_per_points),
          bottles_per_school_chair: Number(data.bottles_per_school_chair),
          bottles_per_kg_waste: Number(data.bottles_per_kg_waste),
          bottles_per_trash_bag: Number(data.bottles_per_trash_bag),
          energy_save_per_bottle: Number(data.energy_save_per_bottle),
        };

        this.settingsSubject.next(settings);
      }
    });
  }

  // Update settings in Firebase and in BehaviorSubject
  async updateSettings(settings: SystemSettings) {
    await this.adminService.updateSettings(settings);
    this.settingsSubject.next(settings); // update for all subscribers
  }

  // Get current value (synchronous)
  get currentSettings(): SystemSettings | null {
    return this.settingsSubject.value;
  }
}