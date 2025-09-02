import { Routes } from '@angular/router';
import { AuthGuard, GuestGuard } from './services/guard/guards';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
	{
        path: '',
        canActivate: [AuthGuard],
        loadChildren: () => import('./pages/pages.routes').then(m => m.routes),
    },
    
    { path: 'login', component: LoginPageComponent, canActivate: [GuestGuard] },
    { path: 'signup', component: SignupComponent, canActivate: [GuestGuard] },

    // fallback
    { path: '**', redirectTo: '' },
];