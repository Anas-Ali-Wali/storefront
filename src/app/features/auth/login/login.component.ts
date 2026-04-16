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

  constructor(private auth: AuthService, private router: Router) {}

  // submit(): void {
  //   this.auth.login({ email: this.email, password: this.password }).subscribe(() => {
  //     this.router.navigate(['/']);
  //   });
  // }
  // login.component.ts - FIXED
submit(): void {
  this.auth.login({ email: this.email, password: this.password }).subscribe({
    next: (user) => {
      if (!user?.tenantId) {
        this.error = 'Invalid account. No tenant assigned.';
        return;
      }
      this.router.navigate(['/']); // tenantId confirm hone ke baad navigate karo
    },
    error: () => {
      this.error = 'Invalid email or password.';
    }
  });
}
}
