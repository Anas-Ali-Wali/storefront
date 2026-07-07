import { Injectable } from '@angular/core';
import { TenantSliderResponse } from './tenant-slider.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeroGallerySyncService {

private selectedImageSource = new BehaviorSubject<TenantSliderResponse | null>(null);
  selectedImage$ = this.selectedImageSource.asObservable();

  selectImage(image: TenantSliderResponse): void {
    this.selectedImageSource.next(image);
  }

  clearSelection(): void {
    this.selectedImageSource.next(null);
  }
}


