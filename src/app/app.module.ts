import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TenantInterceptor } from './core/interceptors/jwt.interceptor';
import { TenantResolverService } from './core/services/tenant-resolver.service';

// ← Factory function
export function initTenant(resolver: TenantResolverService) {
  return () => resolver.resolve().toPromise();
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, CoreModule, LayoutModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TenantInterceptor,
      multi: true
    },
    // ← YE ADD KARO
    {
      provide: APP_INITIALIZER,
      useFactory: initTenant,
      deps: [TenantResolverService],
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}