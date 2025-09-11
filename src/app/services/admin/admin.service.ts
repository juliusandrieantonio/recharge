import { Injectable } from '@angular/core';
import { Database, ref, onValue } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { DashboardData } from '../../models/dashboard-data';
import { Machine } from '../../models/machine';
import { UserInfo } from '../../models/user-info';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private db: Database) {
  }

  public getStudents(): Observable<UserInfo[]> {
    return new Observable(observer => {
      const studentsRef = ref(this.db, `users`);
      onValue(studentsRef, snapshot => {
        const data = snapshot.val();
  
        if (!data) {
          observer.next([]);
          return;
        }

        console.log(data)
        const students: UserInfo[] = Object.entries(data).map(([uid, value]: [string, any]) => ({
          uid,
          status: value.status,
          email: value.email,
          phone_number: value.phone_number,
          role: value.role,
          available_points: value.available_points,
          total_bottles: value.total_bottles
        }))
        .filter(u => u.role === 'student'); // optional: only return students
  
        observer.next(students);
      });
    });
  }

  public getMachines(): Observable<Machine[]> {
    return new Observable(observer => {
      const machineRef = ref(this.db, `machine`);
      onValue(machineRef, snapshot => {
        const data = snapshot.val();
        // Convert object to array
        const machines: Machine[] = Object.entries(data).map(([id, value]: [string, any]) => ({
          id,
          name: value.name,
          status: value.status,
          activity: value.activity,
          available_charging_slots: value.available_charging_slots || 0,
          bin_level: value.bin_level || 0,
          charging_slots: value.charging_slots || 0,
          last_modified: new Date(value.last_modified)
        }));

        observer.next(machines);
      });
    });
  }


  public getMonthlyContrib(year: string): Observable<any[]> {
    return new Observable(observer => {
      
      const contribRef = ref(this.db, `monthly_progress_by_user`);
  
      onValue(contribRef, snapshot => {
        const data = snapshot.val();
        if (!data) {
          observer.next([]);
          return;
        }
  
        const allContrib: any[] = [];
  
        // Loop through users
        Object.values(data).forEach((userData: any) => {
          if (userData[year]) {
            // Loop through months in that year
            Object.entries(userData[year]).forEach(
              ([month, values]: [string, any]) => {
                allContrib.push({
                  month,
                  ...values
                });
              }
            );
          }
        });
  
        observer.next(allContrib);
      });
    });
  }
  
  public getDashboard(yearMonth: string): Observable<DashboardData> {
    return new Observable(observer => {
      const studentsRef = ref(this.db, `dashboard_stats/${yearMonth}`);
      onValue(studentsRef, snapshot => {
        const data = snapshot.val();
        observer.next(data);
      });
    });
  }
}
