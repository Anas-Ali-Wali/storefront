import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TenantResolverService } from '../../../core/services/tenant-resolver.service'; // ✅ import

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
  loading = false;

  constructor(
    private auth: AuthService,
    private tenantResolver: TenantResolverService, // ✅ inject
    private router: Router
  ) {}

  submit(form: any): void {
    if (form.invalid) {
      this.error = 'Please fill all fields correctly.';
      return;
    }

    const tenantId = this.tenantResolver.getTenantId(); // ✅ TenantResolverService use kiya

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
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.loading = false;
        this.error = 'Registration failed. Try again.';
      }
    });
  }
}