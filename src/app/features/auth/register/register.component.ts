import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
   firstName = '';
  lastName = '';
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

//   // submit(): void {
//   //   this.auth.register({
//   //     tenantId: environment.tenantId,
//   //     firstName: this.firstName,
//   //     lastName: this.lastName,
//   //     email: this.email,
//   //     password: this.password,
//   //     status: true
//   //   }).subscribe({
//   //     next: () => this.router.navigate(['/auth/login']),
//   //     error: () => (this.error = 'Registration failed. Please try again.')
//   //   });
//   // }


//   submit(): void {
//   const tenantId = this.auth.getTenantId();

//   this.auth.register({
//     tenantId: tenantId!, // ensure value
//     firstName: this.firstName,
//     lastName: this.lastName,
//     email: this.email,
//     password: this.password,
//     status: true
//   }).subscribe({
//     next: () => this.router.navigate(['/auth/login']),
//     error: () => (this.error = 'Registration failed. Please try again.')
//   });
// }

loading = false;

submit(form: any): void {
  if (form.invalid) {
    this.error = 'Please fill all fields correctly.';
    return;
  }

  const tenantId = this.auth.getTenantId();

  if (!tenantId) {
    this.error = 'Tenant not found.';
    return;
  }

  this.loading = true;

  this.auth.register({
    tenantId: tenantId,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    password: this.password,
    status: true
  }).subscribe({
    next: () => {
      this.loading = false;

      // ✅ SUCCESS → LOGIN PAGE
      this.router.navigate(['/auth/login']);
    },
    error: () => {
      this.loading = false;
      this.error = 'Registration failed. Try again.';
    }
  });
}

}
