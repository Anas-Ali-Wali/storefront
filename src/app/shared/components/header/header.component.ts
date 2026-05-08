import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { CartService } from 'src/app/core/services/cart.service';
import { TenantResolverService } from 'src/app/core/services/tenant-resolver.service';

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

  


  // isLoggedIn = false;
  // userName = '';
  // menuOpen = false;
  // cartCount = 0;
  
  // private subscription = new Subscription();

  // constructor(
  //   private cartService: CartService,
  //   private router: Router,
  //   private authService: AuthService  // ✅ add karo

  // ) {}

  // // ngOnInit(): void {
  // //   this.cartCount = this.cartService.getCount();

  // //   this.subscription.add(
  // //     this.cartService.cart$.subscribe((items) => {
  // //       this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  // //     })
  // //   );

  // //   // ✅ AUTO CLOSE MENU ON ROUTE CHANGE
  // //   this.subscription.add(
  // //     this.router.events
  // //       .pipe(filter(event => event instanceof NavigationEnd))
  // //       .subscribe(() => {
  // //         this.menuOpen = false;
  // //       })
  // //   );
  // // }


  // ngOnInit(): void {
  //   this.cartCount = this.cartService.getCount();
  //   this.isLoggedIn = this.authService.isLoggedIn();
  //   const user = this.authService.getUser();
  //   this.userName = user?.firstName || '';

  //   this.subscription.add(
  //     this.cartService.cart$.subscribe(items => {
  //       this.cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  //     })
  //   );

  //   this.subscription.add(
  //     this.router.events
  //       .pipe(filter(e => e instanceof NavigationEnd))
  //       .subscribe(() => {
  //         this.menuOpen = false;
  //         this.isLoggedIn = this.authService.isLoggedIn();
  //       })
  //   );
  // }

  // logout(): void {
  //   this.authService.logout();
  //   this.router.navigate(['/auth/login']);
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


  isLoggedIn = false;
  userName = '';
  menuOpen = false;
  cartCount = 0;

  // ✅ Tenant settings
  storeName = 'MONOLITH';
  logoUrl: string | null = null;

  private subscription = new Subscription();

  constructor(
    private cartService: CartService,
    private router: Router,
    private authService: AuthService,
    private tenantResolver: TenantResolverService  // ✅ inject
  ) {}

  ngOnInit(): void {
    this.cartCount = this.cartService.getCount();
    this.isLoggedIn = this.authService.isLoggedIn();
    const user = this.authService.getUser();
    this.userName = user?.firstName || '';

    // ✅ Tenant settings apply karo
    const settings = this.tenantResolver.getSavedSettings();
    if (settings) {
      if (settings.storeName) this.storeName = settings.storeName;
      if (settings.logoUrl)   this.logoUrl   = settings.logoUrl;
    }

    this.subscription.add(
      this.cartService.cart$.subscribe(items => {
        this.cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
      })
    );

    this.subscription.add(
      this.router.events
        .pipe(filter(e => e instanceof NavigationEnd))
        .subscribe(() => {
          this.menuOpen = false;
          this.isLoggedIn = this.authService.isLoggedIn();
        })
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
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

