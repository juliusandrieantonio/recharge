import { Injectable } from '@angular/core';
import { Database, ref, onValue } from '@angular/fire/database';
import { UtilizationData } from '../../models/utilization';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecyclingService {

  constructor(private db: Database) {
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
}
