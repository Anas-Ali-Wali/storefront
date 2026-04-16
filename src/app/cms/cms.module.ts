import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CmsSharedModule } from './cms-shared.module';
import { PageRendererComponent } from './page-renderer/page-renderer.component';
import { SectionRendererComponent } from './section-renderer/section-renderer.component';

@NgModule({
  declarations: [PageRendererComponent],
  imports: [SharedModule, CmsSharedModule, RouterModule.forChild([{ path: '', component: PageRendererComponent }])],
  exports: [
    SectionRendererComponent  // 🔥 THIS IS REQUIRED
  ]
})


export class CmsModule {}
