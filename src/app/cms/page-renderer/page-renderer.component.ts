import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CmsService, FullSection, PageResponseDto,  } from '../../core/services/cms.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/services/auth.service';
import { TenantResolverService } from 'src/app/core/services/tenant-resolver.service';

@Component({
  selector: 'app-page-renderer',
  templateUrl: './page-renderer.component.html',
  styleUrls: ['./page-renderer.component.css'],
})
export class PageRendererComponent implements OnInit {
 page: PageResponseDto | null = null;
  sections: FullSection[] = [];
  loading = true;
  error = false;
  constructor(private cms: CmsService, private route: ActivatedRoute, 
       private auth: AuthService,    private tenantResolver: TenantResolverService
) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug') || 'home';
      this.loadPage(slug);
    });
  }

loadPage(slug: string): void {
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

  this.cms.getPageBySlug(tenantId, slug).subscribe({
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

  this.cms.getPageWithSections(tenantId, slug).subscribe({
    next: (sections: FullSection[]) => {
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
