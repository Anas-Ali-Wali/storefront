import { Component, OnInit } from '@angular/core';
import { CmsService, PageResponseDto, FullSection } from '../../core/services/cms.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { TenantResolverService } from 'src/app/core/services/tenant-resolver.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent   { 
  page: PageResponseDto | null = null;
  sections: FullSection[] = [];
  loading = true;
  error = false;

  constructor(
    private cms: CmsService,
    private auth: AuthService,
    private tenantResolver: TenantResolverService
  ) {}

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.loading = true;
    this.error = false;
    this.page = null;
    this.sections = [];

    const tenantId =
      this.auth.getTenantId() ??
      this.tenantResolver.getTenantId() ??
      0;

    if (!tenantId) {
      this.error = true;
      this.loading = false;
      return;
    }

    this.cms.getPageBySlug(tenantId, 'home').subscribe({
      next: (page) => {
        this.page = page || null;

        if (!page) {
          this.error = true;
          this.loading = false;
        }
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });

    this.cms.getPageWithSections(tenantId, 'home').subscribe({
      next: (sections) => {
        this.sections = sections;
        if (!this.error) {
          this.loading = false;
        }
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }
}

