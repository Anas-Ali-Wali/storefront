import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MainLayoutComponent } from './main-layout/main-layout.component';

@NgModule({
  declarations: [MainLayoutComponent],
  imports: [SharedModule],
  exports: [MainLayoutComponent],
})
export class LayoutModule {}
