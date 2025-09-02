import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';


export const AuthGuard: CanActivateFn = async () => {
    const authService = inject(AuthService);
    const router = inject(Router);
  
    // Wait until Firebase restores the session
    const user = await authService.waitForAuthInit();

    if (user) return true;
  
    router.navigate(['/login']); // redirect if not logged in
    return false;
};


export const GuestGuard: CanActivateFn = async () => {
    const authService = inject(AuthService);
    const router = inject(Router);
  
    // Wait until Firebase restores the session
    const user = await authService.waitForAuthInit();
    if (user) {
      router.navigate(['']); // redirect logged-in users to pages
      return false;
    }
  
    return true; // allow access to login/signup
};
