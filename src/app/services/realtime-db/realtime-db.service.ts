import { Injectable } from '@angular/core';

import {
  Database,
  ref,
  get,
  set,
  update,
  child
} from '@angular/fire/database';
import { Auth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class RealtimeDbService {
  constructor(private db: Database, private auth: Auth) {}

  async getUserInfo() {
    if (!this.auth.currentUser) throw new Error('Not logged in');
    const userRef = ref(this.db, `users/${this.auth.currentUser.uid}`);
    const snapshot = await get(userRef);
    return snapshot.exists() ? snapshot.val() : null;
  }

  async getModules() {
    try {
      const modulesRef = ref(this.db, 'modules');
      const snapshot = await get(modulesRef);
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error('Permission denied or not logged in:', error);
      throw error;
    }
  }
}