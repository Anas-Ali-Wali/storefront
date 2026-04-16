import { Component, Input } from '@angular/core';
import { FullSection, SectionDataResponseDto } from '../../../core/services/cms.service';
import { ProductResponseDto, ProductService } from 'src/app/core/services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hero-banner',
  templateUrl: './hero-banner.component.html',
  styleUrls: ['./hero-banner.component.css'],
})
export class HeroBannerComponent {
  @Input() section!: FullSection;
  product: ProductResponseDto | null = null;
  loading = true;
  error = false;

  get title(): string {
    return this.section.data.find((item: SectionDataResponseDto) => item.key === 'title')?.value || 'Welcome';
  }

  get image(): string {
    return this.section.data.find((item: SectionDataResponseDto) => item.key === 'image')?.value || 'https://via.placeholder.com/1200x450';
  }

  get subtitle(): string {
    return this.section.data.find((item: SectionDataResponseDto) => item.key === 'subtitle')?.value || '';
  }

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

slides = [
  {
    image: 'assets/slides/pexels-cottonbro-9834882.jpg',
    title: 'Elegant Women Suits Collection',
    subtitle: 'Discover premium stitched and unstitched suits designed for modern elegance.',
    buttonText: 'Shop Women',
    buttonLink: '/shop/women'
  },

  {
    image: 'assets/slides/gym-with-dombles.jpg',
    title: 'Men Gym Wear & Fitness Outfits',
    subtitle: 'Boost your performance with breathable, stylish gym wear built for strength.',
    buttonText: 'Shop Fitness',
    buttonLink: '/shop/fitness'
  },

  {
    image: 'assets/slides/headphones.jpg',
    title: 'Wireless Headphones Collection',
    subtitle: 'Experience deep bass, crystal-clear sound, and ultimate comfort.',
    buttonText: 'Shop Audio',
    buttonLink: '/shop/electronics'
  },

  {
    image: 'assets/slides/woman-footwear.jpg',
    title: 'Premium Footwear Collection',
    subtitle: 'Step into comfort and style with our latest shoes and sandals.',
    buttonText: 'Shop Footwear',
    buttonLink: '/shop/footwear'
  }
];

currentIndex = 0;
interval: any;

ngOnInit() {
  this.startAutoSlide();
}

loadProduct(id: number): void {
  this.loading = true;
  this.productService.getProductById(id).subscribe({
    next: (product) => {
      this.product = product;
      this.loading = false;
    },
    error: () => {
      this.error = true;
      this.loading = false;
    }
  });
}

startAutoSlide() {
  this.interval = setInterval(() => {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }, 4000); // 4 sec
}

ngOnDestroy() {
  clearInterval(this.interval);
}
}
