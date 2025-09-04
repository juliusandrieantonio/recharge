import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { environment } from '../environment/environment';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatIconRegistry } from '@angular/material/icon';
import { provideHttpClient } from '@angular/common/http';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    MatIconRegistry, provideCharts(withDefaultRegisterables()),
  ]
};
