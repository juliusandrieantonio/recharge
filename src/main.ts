import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

bootstrapApplication(AppComponent, appConfig).then(appRef => {
  const registry = appRef.injector.get(MatIconRegistry);
  const sanitizer = appRef.injector.get(DomSanitizer);
  registry.addSvgIconSet(
    sanitizer.bypassSecurityTrustResourceUrl('assets/mdi.svg')
  );
}).catch((err) => console.error(err));
