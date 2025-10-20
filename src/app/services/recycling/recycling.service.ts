import { Injectable } from '@angular/core';
import { Database, ref, onValue, get, update } from '@angular/fire/database';
import { UtilizationData } from '../../models/utilization';
import { Observable } from 'rxjs';
import { RecyclingFacilityHistory } from '../../models/recycling-facility';
import { Auth, getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class RecyclingService {
  private auth: Auth;
  constructor(private db: Database) {
    this.auth = getAuth();
  }

  public getUtilization(year: string): Observable<UtilizationData> {
    return new Observable(observer => {
      const utilizationRef = ref(this.db, `utilizations/${year}`);
      onValue(utilizationRef, snapshot => {
        const data = snapshot.val() as Record<string, UtilizationData> | null;
        console.log(data);
  
        if (!data) {
          observer.next({
            bottle_used: 0,
            total_bottles_collected: 0,
            armchair_conversion: 0,
            funds_conversion: 0
          });
          return;
        }
  
        // Aggregate all months
        const utilization: UtilizationData = Object.values(data).reduce(
          (acc: any, monthData: any) => {
            acc.bottle_used += monthData.bottle_used || 0;
            acc.total_bottles_collected += monthData.total_bottles_collected || 0;
            acc.armchair_conversion += monthData.armchair_conversion || 0;
            acc.funds_conversion += monthData.funds_conversion || 0;
            return acc;
          },
          { bottle_used: 0, total_bottles_collected: 0, armchair_conversion: 0, funds_conversion: 0 }
        );
  
        observer.next(utilization);
      });
    });
  }

  public async getRequest(): Promise<RecyclingFacilityHistory[]> {
    try {
      const uid = this.auth.currentUser?.uid;
      if (!uid) {
        console.warn('⚠️ No logged-in user found');
        return [];
      }
      // Fetch only requests under the logged-in user's UID
      const requestsRef = ref(this.db, `requests/${uid}`);
      const snapshot = await get(requestsRef);
      const data = snapshot.val();
  
      if (!data) return [];
  
      const requests: RecyclingFacilityHistory[] = [];
  
      // Loop through this user's request entries
      Object.entries(data).forEach(([requestId, requestData]: [string, any]) => {
        requests.push({
          id: requestId,
          facility_name: requestData.facility_name ?? '',
          requested_bottles: requestData.requested_bottles ?? 0,
          actual_bottles: requestData.actual_bottles ?? 0,
          requested_date: requestData.requested_date ?? '',
          status: requestData.status ?? false,
          message: requestData.message ?? '',
          school_name: requestData.school_name ?? 'Pamantasan ng Lungsod ng Valenzuela',
        });
      });
  
      return requests;
    } catch (error) {
      console.error('Failed to get requests:', error);
      throw error;
    }
  }

  public async updateRequest(id: string, updates: Partial<RecyclingFacilityHistory>): Promise<void> {
    try {
      const uid = this.auth.currentUser?.uid;
      if (!uid) {
        console.warn('⚠️ No logged-in user found');
        return;
      }

      const requestRef = ref(this.db, `requests/${uid}/${id}`);
      await update(requestRef, updates);

      const userRef = ref(this.db, `users/${uid}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      if (!userData) {
        console.warn('⚠️ User data not found for UID:', uid);
        return;
      }

      // 3️⃣ Add new values to current totals
      const updatedTotals = {
        total_bottles:
          (userData.total_bottles || 0) + (updates.actual_bottles || 0),
        total_bottles_collected:
          (userData.total_bottles_collected || 0) +
          (updates.actual_bottles || 0),
      };

      // 4️⃣ Update user node with new totals
      await update(userRef, updatedTotals);
    }
    catch (error) {
      console.error('Failed to update request:', error);
      throw error;
    }

  }
}
