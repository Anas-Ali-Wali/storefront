import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductResponseDto, ProductService } from '../../core/services/product.service';
import { CartItem, CartService } from '../../core/services/cart.service';
import { ProductImageService } from '../../core/services/product-image.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
     product: ProductResponseDto | null = null;
  loading = true;
  error = false;
  quantity = 1;

  allImages: string[] = [];
  selectedImage = '';

  private apiBase = 'http://localhost:5025';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private productImageService: ProductImageService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.loadProduct(id);
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        // Load gallery images from the database
        this.loadGalleryImages(id);
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  /**
   * Load additional gallery images from the product image service
   */
  private loadGalleryImages(productId: number): void {
    this.productImageService.getImagesByProduct(productId).subscribe({
      next: (galleryImages) => {
        if (this.product) {
          // Find the primary image (if exists)
          const primaryImage = galleryImages.find(img => img.isPrimary);
          
          // If there's a primary image, use it as the main product image
          if (primaryImage) {
            this.product.imageUrl = primaryImage.imageUrl;
          }
          
          // Get only non-primary images for the gallery
          const nonPrimaryImages = galleryImages
            .filter(img => !img.isPrimary)
            .map(img => this.getImageUrl(img.imageUrl));
          
          // Set the product's imagesUrls to non-primary images only
          this.product.imagesUrls = nonPrimaryImages;
          // Build the complete image list
          this.buildImageList(this.product);
        }
        this.loading = false;
      },
      error: () => {
        // Even if gallery images fail to load, show the main image
        if (this.product) {
          this.buildImageList(this.product);
        }
        this.loading = false;
      }
    });
  }

  private buildImageList(product: ProductResponseDto): void {
    const mainImage = this.getImageUrl(product.imageUrl);
    
    // Get gallery images if they exist
    const galleryImages = (product.imagesUrls || [])
      .filter(url => !!url && url !== mainImage)
      .map(url => this.getImageUrl(url));

    // Combine main image first, then gallery images
    const combined = [mainImage, ...galleryImages];
    // Remove duplicates
    this.allImages = Array.from(new Set(combined));
    this.selectedImage = this.allImages[0] || mainImage;
  }

  selectImage(img: string): void {
    this.selectedImage = img;
  }

  increaseQty(): void {
    if (this.product && this.quantity < this.product.stockQty) {
      this.quantity++;
    }
  }

  decreaseQty(): void {
    if (this.quantity > 1) this.quantity--;
  }

  private buildCartItem(): CartItem | null {
    if (!this.product) return null;
    return {
      productId: this.product.productId,
      name: this.product.name,
      price: this.product.price,
      imageUrl: this.selectedImage,
      quantity: this.quantity,
      stockQty: this.product.stockQty
    };
  }

  addToCart(): void {
    const item = this.buildCartItem();
    if (!item) return;
    this.cartService.addToCart(item);
  }

  // 👇 NAYA METHOD
  buyNow(): void {
    const item = this.buildCartItem();
    if (!item) return;

    this.cartService.addToCart(item);
    this.router.navigate(['/checkout']);
  }

  getImageUrl(imageUrl?: string): string {
    if (!imageUrl) return 'https://via.placeholder.com/600x750?text=Product';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${this.apiBase}${imageUrl}`;
  }

}
