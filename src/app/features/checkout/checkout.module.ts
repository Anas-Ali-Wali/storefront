import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CheckoutComponent } from './checkout.component';

@NgModule({
  declarations: [CheckoutComponent],
  imports: [SharedModule, FormsModule, ReactiveFormsModule, RouterModule.forChild([{ path: '', component: CheckoutComponent }])],
})
export class CheckoutModule {}
