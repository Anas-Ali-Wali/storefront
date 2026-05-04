import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { TenantResolverService } from './tenant-resolver.service';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponseData {
  token: string;
  customerId: number;
  firstName: string;
  lastName: string;
  email: string;
  tenantId: number;
}

export interface RegisterPayload {
  tenantId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  status: boolean;
}

@Injectable()
export class AuthService {
  private readonly tokenKey = 'storefront_token';
  private readonly userKey  = 'storefront_user';

  constructor(private api: ApiService,     private tenantResolver: TenantResolverService // ✅ ADD
) {}

  login(payload: LoginPayload): Observable<LoginResponseData> {
    return this.api.post<any>('/auth/login', payload).pipe(
      tap((res) => {
        // Admin panel stores: res.data.token  ← this is your structure
        if (res?.success && res?.data?.token) {
          localStorage.setItem(this.tokenKey, res.data.token);
          localStorage.setItem(this.userKey, JSON.stringify(res.data));
        }
      }),
      map((res) => res.data)
    );
  }

  // Register = POST /Customer/create  (matches admin panel)
  register(payload: RegisterPayload): Observable<any> {
    return this.api.post<any>('/Customer/create', payload);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): LoginResponseData | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // getTenantId(): number {
  //   return this.getUser()?.tenantId ?? 1;
  // }
// auth.service.ts - FIXED getTenantId

// getTenantId(): number | null {
//   const user = this.getUser();
//   if (!user?.tenantId) return null;
//   return Number(user.tenantId); // ensure number hai, string nahi
// }

getTenantId(): number | null {
    // 1st priority: logged in user ka tenantId
    const user = this.getUser();
    if (user?.tenantId) return Number(user.tenantId);

    // 2nd priority: domain se resolve hua tenantId
    return this.tenantResolver.getTenantId(); // ✅ Fallback
  }

}