import { Injectable } from '@angular/core';
import { Database, ref, onValue, push, set, update, get } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { DashboardData } from '../../models/dashboard-data';
import { Machine } from '../../models/machine';
import { UserInfo } from '../../models/user-info';
import { RecyclingFacilityHistory, RecyclingFacilityInfo } from '../../models/recycling-facility';
import { Auth, createUserWithEmailAndPassword, UserCredential } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private db: Database, private auth: Auth) {
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

  public async createRecyclerUser(
    email: string,
    password: string,
    data: Omit<RecyclingFacilityInfo, 'role'>
  ): Promise<UserCredential> {
    // Create the Auth user first
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const uid = userCredential.user.uid;

    // Then store extra info in Realtime Database
    const userRef = ref(this.db, `users/${uid}`);
    const phoneRef = ref(this.db, `phone_numbers/${data.phone_number}`);
    await set(phoneRef, email);

    await set(userRef, {
      ...data,
      role: 'recycling',
      total_bottles_collected: data.total_bottles_collected || 0,
      status: data.status || 'active'
    });

    return userCredential;
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

  async addPickupRequest(
    uid: string,
    requestData: {
      facility_name: string;
      requested_bottles: number;
      message?: string;
    }
  ): Promise<void> {
    if (!uid) throw new Error('Invalid UID');

    const requestRef = push(ref(this.db, `requests/${uid}`));

    const newRequest: RecyclingFacilityHistory = {
      facility_name: requestData.facility_name,
      requested_bottles: requestData.requested_bottles,
      actual_bottles: 0,
      requested_date: new Date().toISOString(),
      status: false,
      id: requestRef.key || ''
    };

    console.log(newRequest)

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
}
