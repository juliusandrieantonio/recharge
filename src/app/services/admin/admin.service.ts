import { Injectable } from '@angular/core';
import { Database, ref, onValue, push, set, update, get } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { DashboardData } from '../../models/dashboard-data';
import { Machine } from '../../models/machine';
import { UserInfo } from '../../models/user-info';
import { RecyclingFacilityHistory, RecyclingFacilityInfo } from '../../models/recycling-facility';
import { Auth, createUserWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private db: Database, private auth: Auth, private http: HttpClient) {
  }
  private BASE_URL = "https://recharge-jumihhaid-julius-projects-173ae70a.vercel.app"

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

  public async getRecyclers(): Promise<RecyclingFacilityInfo[]> {
    const usersRef = ref(this.db, 'users');
    const snapshot = await get(usersRef);
    const data = snapshot.val();
  
    if (!data) return [];
  
    const facilities: RecyclingFacilityInfo[] = Object.entries(data)
      .map(([uid, value]: [string, any]) => ({
        uid,
        facility_name: value.facility_name,
        phone_number: value.phone_number,
        status: value.status,
        total_bottles_collected: value.total_bottles_collected,
        role: value.role
      }))
      .filter(u => u.role === 'recycling');
  
    return facilities;
  }

  public async updateRecycler(uid: string, updates: Partial<RecyclingFacilityInfo>): Promise<void> {
    const userRef = ref(this.db, `users/${uid}`);
    await update(userRef, updates);
  }

  public createRecyclerUser(email: string, password: string, data: Omit<RecyclingFacilityInfo, 'role'>) {
    return this.http.post<{ success: boolean; uid: string }>(`${this.BASE_URL}/api/createUser`, {
      email,
      password,
      data
    });
  }

  public getMachines(): Observable<Machine[]> {
    return new Observable(observer => {
      const machineRef = ref(this.db, `machine`);
      onValue(machineRef, snapshot => {
        const data = snapshot.val();
        // Convert object to array
        console.log(data)
        const machines: Machine[] = Object.entries(data).map(([id, value]: [string, any]) => ({
          id,
          name: value.name,
          status: value.status,
          activity: value.activity,
          available_charging_slots: value.available_charging_slots || 0,
          bin_level: value.bin_level || 0,
          charging_slots: value.charging_slots || 0,
          last_modified: new Date(value.last_modified * 1000).toLocaleString()
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

  async addPickupRequest(
    uid: string,
    requestData: {
      facility_name: string;
      requested_bottles: number;
      message?: string;
      requested_date: string;
    }
  ): Promise<void> {
    if (!uid) throw new Error('Invalid UID');

    const requestRef = push(ref(this.db, `requests/${uid}`));

    const newRequest: RecyclingFacilityHistory = {
      school_name: "Pamantasan ng Lungsod ng Valenzuela",
      facility_name: requestData.facility_name,
      requested_bottles: requestData.requested_bottles,
      message: requestData.message,
      actual_bottles: 0,
      requested_date: requestData.requested_date,
      status: false,
      id: requestRef.key || ''
    };

    // Save to Firebase
    await set(requestRef, newRequest);
  }

  public async getRequest(): Promise<RecyclingFacilityHistory[]> {
    try {
      const requestsRef = ref(this.db, 'requests');
      const snapshot = await get(requestsRef);
      const data = snapshot.val();

      if (!data) return [];

      // Flatten all requests from all UIDs
      const requests: RecyclingFacilityHistory[] = [];

      Object.entries(data).forEach(([uid, userRequests]: [string, any]) => {
        Object.entries(userRequests).forEach(([requestId, requestData]: [string, any]) => {
          requests.push({
            id: requestId,
            facility_name: requestData.facility_name ?? '',
            requested_bottles: requestData.requested_bottles ?? 0,
            actual_bottles: requestData.actual_bottles ?? 0,
            requested_date: requestData.requested_date ?? '',
            status: requestData.status ?? false
          });
        });
      });

      return requests;
    } catch (error) {
      console.error('Failed to get requests:', error);
      throw error;
    }
  }

  public async updateSettings(settings: any): Promise<void> {
    const settingsRef = ref(this.db, 'settings');
    await set(settingsRef, settings);
  }

  public getSettings(): Observable<any> {
    return new Observable(observer => {
      const settingsRef = ref(this.db, 'settings');
      onValue(settingsRef, snapshot => {
        const data = snapshot.val();
        observer.next(data || {}); // return empty object if no settings yet
      }, error => {
        observer.error(error);
      });
    });
  }
}
