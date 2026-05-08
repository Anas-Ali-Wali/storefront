import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;  // ✅ add


  constructor(private auth: AuthService, private router: Router) {}

  // submit(): void {
  //   this.auth.login({ email: this.email, password: this.password }).subscribe(() => {
  //     this.router.navigate(['/']);
  //   });
  // }
  // login.component.ts - FIXED



// submit(): void {
//   this.auth.login({ email: this.email, password: this.password }).subscribe({
//     next: (user) => {
//       if (!user?.tenantId) {
//         this.error = 'Invalid account. No tenant assigned.';
//         return;
//       }
//       this.router.navigate(['/']); // tenantId confirm hone ke baad navigate karo
//     },
//     error: () => {
//       this.error = 'Invalid email or password.';
//     }
//   });
// }



submit(): void {
  const tenantId = this.auth.getTenantId();

  if (!tenantId) {
    this.error = 'Tenant not found.';
    return;
  }

  this.loading = true;
  this.error = '';

  this.auth.login({ 
    tenantId,
    email: this.email, 
    password: this.password 
  }).subscribe({
    next: (user) => {
      this.loading = false;
      if (!user?.tenantId) {
        this.error = 'Invalid account.';
        return;
      }
      this.router.navigate(['/account/profile']);
    },
    error: (err) => {
      this.loading = false;
      if (err?.status === 401) {
        this.error = 'Account not found. Please register first.';  // ✅
      } else {
        this.error = 'Something went wrong. Try again.';
      }
    }
  });
}
}
