import { Injectable } from '@angular/core';
import { TenantSliderResponse } from './tenant-slider.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SliderStateService {
private imageSubject = new BehaviorSubject<TenantSliderResponse | null>(null);
  selectedImage$ = this.imageSubject.asObservable();

  setImage(image: TenantSliderResponse | null): void {
    this.imageSubject.next(image);
  }

  getImage(): TenantSliderResponse | null {
    return this.imageSubject.getValue();
  }

}
