import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from '@angular/fire/auth';
import { BehaviorSubject, filter, firstValueFrom, lastValueFrom } from 'rxjs';

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
}