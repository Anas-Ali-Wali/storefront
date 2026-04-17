import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TenantInterceptor  implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.auth.getToken();
    const tenantId = this.auth.getTenantId();

    let headers: any = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (tenantId) {
      headers['X-Tenant-Id'] = tenantId.toString();
    }

    const cloned = req.clone({ setHeaders: headers });

    return next.handle(cloned);
  }
}