import { Component } from '@angular/core';
import { TenantResolverService } from 'src/app/core/services/tenant-resolver.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {

    storeName     = 'Storefront';
  tagline       = 'Trusted online marketplace with fast delivery & easy returns.';
  facebookUrl:    string | null = null;
  instagramUrl:   string | null = null;
  whatsappNumber: string | null = null;
  currentYear   = new Date().getFullYear();

  constructor(private tenantResolver: TenantResolverService) {}

  ngOnInit(): void {
    const settings = this.tenantResolver.getSavedSettings();
    if (settings) {
      if (settings.storeName)      this.storeName      = settings.storeName;
      if (settings.footerTagline)  this.tagline        = settings.footerTagline;
      if (settings.facebookUrl)    this.facebookUrl    = settings.facebookUrl;
      if (settings.instagramUrl)   this.instagramUrl   = settings.instagramUrl;
      if (settings.whatsappNumber) this.whatsappNumber = settings.whatsappNumber;
    }
  }

}
