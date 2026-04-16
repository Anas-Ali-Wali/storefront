import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { LoaderComponent } from './components/loader/loader.component';
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, ProductCardComponent, LoaderComponent, CurrencyFormatPipe],
  imports: [CommonModule, RouterModule],
  exports: [HeaderComponent, FooterComponent, ProductCardComponent, LoaderComponent, CurrencyFormatPipe, CommonModule, RouterModule],
})
export class SharedModule {}
