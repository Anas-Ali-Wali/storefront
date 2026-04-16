import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CmsSharedModule } from '../../cms/cms-shared.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [SharedModule, CmsSharedModule, RouterModule.forChild([{ path: '', component: HomeComponent }])],
})
export class HomeModule {}
