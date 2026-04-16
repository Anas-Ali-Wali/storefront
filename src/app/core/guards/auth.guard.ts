import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  // canActivate(): boolean {
  //   if (this.auth.isLoggedIn()) {
  //     return true;
  //   }
  //   this.router.navigate(['/auth/login']);
  //   return false;
  // }

  // auth.guard.ts - FIXED
canActivate(): boolean {
  if (this.auth.isLoggedIn() && this.auth.getTenantId()) {
    return true;
  }
  this.auth.logout(); // stale/incomplete data clear karo
  this.router.navigate(['/auth/login']);
  return false;
}
}
