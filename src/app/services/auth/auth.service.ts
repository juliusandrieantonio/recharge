import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged
} from '@angular/fire/auth';
import { getDatabase, query, ref, runTransaction, set, orderByChild, equalTo, get} from 'firebase/database';
import { 
  setPersistence, 
  browserLocalPersistence, 
  AuthError
} from 'firebase/auth';  

import { BehaviorSubject } from 'rxjs';
import { Credentials } from '../../models/credentials';
import { getMonth, getYear, getYearMonth } from '../../helper/date-helper';

@Injectable({ providedIn: 'root' })

export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  user$ = this.currentUserSubject.asObservable();
  private initialized = false;

  constructor(private auth: Auth) {
    // Listen for auth state changes (fires even after refresh)
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
      this.initialized = true;
    });
  }

  login(email: string, password: string) {
    return setPersistence(this.auth, browserLocalPersistence).then(() =>
      signInWithEmailAndPassword(this.auth, email, password)
    );
  }

  logout() {
    return signOut(this.auth);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  async waitForAuthInit(): Promise<User | null> {
    return new Promise((resolve) => {
      // onAuthStateChanged fires immediately if Firebase restores session
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        resolve(user);     // resolves with current user or null
        unsubscribe();     // clean up listener
      });
    });
  }
  
  async register(data: Credentials) {
    try {
      // 1. Create Firebase Auth account (checks duplicate email automatically)
      const userCredential = await setPersistence(this.auth, browserLocalPersistence).then(() =>
        createUserWithEmailAndPassword(this.auth, data.email || '', data.password)
      );
      const user = userCredential.user;
      const db = getDatabase();
  
      try {
        // 2. Try reserving the phone number
        await set(ref(db, `phone_numbers/${data.phone_number}`), data.email);
  
        // 3. Save user profile
        await set(ref(db, `users/${user.uid}`), {
          'email': data.email,
          'phone_number': data.phone_number,
          'role': data.role,
          'status': data.status,
          'total_bottles': 0,
          'available_points': 0
        });
        
        await set(ref(db, `monthly_progress_by_user/${user.uid}/${getYear()}/${getMonth()}`), {
          'bottles': 0,
        });

      } catch (phoneError) {
        // Phone number already exists → rollback user
        await user.delete();
        throw new Error('phone-already-in-use');
      }

      try {
        await runTransaction(ref(db, `dashboard_stats/${getYearMonth()}/total_active_students`), (currentValue) => {
          return (currentValue || 0) + 1;
        });
      }
      catch (err) {
        console.log(err);
        throw new Error();
      }

      return userCredential;

    } catch (err: any) {
      // Firebase Auth errors
      const error = err as AuthError;

      console.log(error)
      switch (error.code || err.message) {
        case 'auth/email-already-in-use':
          throw new Error('email-already-in-use');
        case 'auth/weak-password':
          throw new Error('weak-password');
        case 'auth/invalid-email':
          throw new Error('invalid-email');
        case 'phone-already-in-use':   // custom case
          throw new Error('phone-already-in-use');
        default:
          throw new Error('registration-failed');
      }
    }
  }

  async getEmailByPhone(phone: string): Promise<string | null> {
    try {
      const db = getDatabase();
      const snap = await get(ref(db, `phone_numbers/${phone}`));
      if (snap.exists()) {
        return snap.val(); // this is the email
      }
      return null;
    } catch (error) {
      console.error("Error fetching email by phone:", error);
      return null;
    }
  }
  

  
}