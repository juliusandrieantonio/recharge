import { Injectable } from '@angular/core';
import { Database, ref, onValue, query, orderByKey, startAt } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { StudentStats } from '../../models/student-stats';
import { StudentRedemptions } from '../../models/student-remdemption';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private uid: string | undefined;
  constructor(private db: Database, private auth: AuthService) {
    this.uid = this.auth.currentUser?.uid;
  }

  public getStudent(): Observable<StudentStats> {
    return new Observable(observer => {
      if (!this.uid) throw new Error('Not logged in');
      const studentsRef = ref(this.db, `users/${this.uid}`);
      onValue(studentsRef, snapshot => {
        const data = snapshot.val();
        observer.next(data);
      });
    });
  }

  public getMonthlyContrib(year: string): Observable<any[]> {
    return new Observable(observer => {
      if (!this.uid) throw new Error('Not logged in');
      const studentsRef = ref(this.db, `monthly_progress_by_user/${this.uid}/${year}`);
      onValue(studentsRef, snapshot => {
        const data = snapshot.val();
        observer.next(data);
      });
    });
  }

  public getRedeemptions(): Observable<StudentRedemptions[]> {
    return new Observable(observer => {
      if (!this.uid) throw new Error('Not logged in');
  
      const now = Math.floor(Date.now() / 1000); // seconds
      const thirtyDaysAgo = now - (30 * 24 * 60 * 60);
  
      const redeemRef = query(
        ref(this.db, `redeem/${this.uid}`),
        orderByKey(),
        startAt(thirtyDaysAgo.toString()) // Firebase stores keys as strings
      );
  
      onValue(redeemRef, snapshot => {
        const data = snapshot.val();
        if (!data) {
          observer.next([]);
          return;
        }
  
        const redeems: StudentRedemptions[] = Object.values(data) as StudentRedemptions[];
        observer.next(redeems);
      });
    });
  }
}
