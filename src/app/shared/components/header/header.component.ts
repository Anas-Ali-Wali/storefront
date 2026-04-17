import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { CartService } from 'src/app/core/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  // menuOpen = false;
  // cartCount = 0;
  // private subscription = new Subscription();

  // constructor(private cartService: CartService) {}

  // ngOnInit(): void {
  //   this.cartCount = this.cartService.getCount();
  //   this.subscription.add(
  //     this.cartService.cart$.subscribe((items) => {
  //       this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  //     })
  //   );
  // }


  

  // ngOnDestroy(): void {
  //   this.subscription.unsubscribe();
  // }

  // toggleMenu(): void {
  //   this.menuOpen = !this.menuOpen;
  // }

  // closeMenu(): void {
  //   this.menuOpen = false;
  // }


  menuOpen = false;
  cartCount = 0;
  private subscription = new Subscription();

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartCount = this.cartService.getCount();

    this.subscription.add(
      this.cartService.cart$.subscribe((items) => {
        this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
      })
    );

    // ✅ AUTO CLOSE MENU ON ROUTE CHANGE
    this.subscription.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.menuOpen = false;
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

}

