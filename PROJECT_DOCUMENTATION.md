# Angular Storefront Project - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Module Structure](#module-structure)
3. [Services & API Integration](#services--api-integration)
4. [Components](#components)
5. [Forms & Validations](#forms--validations)
6. [Authentication & Guards](#authentication--guards)
7. [Routing Structure](#routing-structure)
8. [State Management](#state-management)
9. [Data Flow Examples](#data-flow-examples)
10. [Multi-Tenant Architecture](#multi-tenant-architecture)
11. [Environment Configuration](#environment-configuration)
12. [Styling & Design](#styling--design)

---

## Project Overview

### Technology Stack
- **Framework:** Angular 16.2.0
- **UI Framework:** Bootstrap 5.3.8
- **Styling:** Tailwind CSS 3.4.19
- **HTTP:** RxJS 7.8.0
- **Language:** TypeScript 5.1.3
- **Architecture:** Multi-tenant SaaS with domain-based tenant resolution

### API Configuration
- **Development:** `http://localhost:5025/api`
- **Production:** `http://anasali1-001-site1.ltempurl.com/api`

### Project Type
E-commerce storefront with CMS integration, dynamic page management, and multi-tenant support.

---

## Module Structure

### 1. Root Module (AppModule)
**File:** `src/app/app.module.ts`

**Purpose:** Bootstrap module that initializes the entire application

**Key Configurations:**
```typescript
Imports:
  - BrowserModule
  - AppRoutingModule
  - CoreModule
  - LayoutModule

Providers:
  - HTTP_INTERCEPTORS → TenantInterceptor
  - APP_INITIALIZER → Tenant resolution on startup
```

**Initialization Flow:**
1. App starts
2. APP_INITIALIZER triggers TenantResolverService
3. Tenant ID is resolved from domain
4. Application ready for use

---

### 2. Core Module
**File:** `src/app/core/core.module.ts`

**Purpose:** Centralized service module containing all singleton services

**Services Provided:**
1. **ApiService** - Base HTTP wrapper
2. **AuthService** - Authentication & user management
3. **ProductService** - Product operations
4. **CategoryService** - Category management
5. **CartService** - Client-side cart state
6. **OrderService** - Order creation & retrieval
7. **CmsService** - Dynamic page content
8. **TenantResolverService** - Tenant resolution
9. **JWT Interceptor** - Auto-inject auth headers

**Pattern Used:** Singleton via `@Optional() @SkipSelf()` to prevent multiple instantiation

---

### 3. Layout Module
**File:** `src/app/layout/layout.module.ts`

**Components:**
- `MainLayoutComponent` - Wraps entire application with header/footer

**Structure:**
```
MainLayoutComponent
├── AppHeaderComponent
├── <router-outlet>
└── AppFooterComponent
```

---

### 4. Shared Module
**File:** `src/app/shared/shared.module.ts`

**Shared Components:**
- `HeaderComponent` - Navigation + cart badge
- `FooterComponent` - App footer
- `ProductCardComponent` - Reusable product display
- `LoaderComponent` - Loading spinner
- `CurrencyFormatPipe` - Format prices to currency

**Exports:** CommonModule, RouterModule + all declared components

**Usage:** Imported by all feature modules

---

### 5. CMS Modules

#### CmsSharedModule
**File:** `src/app/cms/cms-shared.module.ts`

**Declares & Exports:**
- `SectionRendererComponent` - Dynamic section factory
- `HeroBannerComponent` - Banner display
- `FeaturedProductsComponent` - Product showcase
- `CategoryGridComponent` - Category listing
- `PromoBannerComponent` - Promotional content
- `AboutUsComponent` - About section
- `ContactUsComponent` - Contact form section

#### CmsModule
**File:** `src/app/cms/cms.module.ts`

**Route:** `path: 'page/:slug'`

**Component:** `PageRendererComponent` - Renders CMS pages with dynamic sections

---

### 6. Feature Modules

#### HomeModule
- **Route:** Default route (`''`)
- **Component:** `HomeComponent`
- **Features:** 
  - Renders home page from CMS
  - Dynamic section loading
  - Responsive hero banner and product showcase

#### ShopModule
- **Route:** `/shop`
- **Components:** 
  - `ShopComponent` - Main shop page
  - `ProductFiltersComponent` - Category filters
- **Features:**
  - Product listing with pagination (12 items/page)
  - Category filtering
  - Mobile-responsive filter drawer
  - Responsive grid layout

#### ProductModule
- **Route:** `/product/:id`
- **Components:**
  - `ProductDetailComponent` - Product detail view
  - `ImageGalleryComponent` - Image viewer
- **Features:**
  - Product information display
  - Stock validation
  - Quantity selector
  - Add to cart functionality

#### CartModule
- **Route:** `/cart`
- **Component:** `CartComponent`
- **Features:**
  - View all cart items
  - Update quantities
  - Remove items
  - Calculate totals (subtotal, shipping, tax)
  - Proceed to checkout

#### CheckoutModule
- **Route:** `/checkout`
- **Component:** `CheckoutComponent`
- **Features:**
  - Multi-step checkout form
  - Payment method selection
  - Order creation
  - Order confirmation display

#### AuthModule
- **Routes:** `/auth/login`, `/auth/register`
- **Components:**
  - `LoginComponent` - User login
  - `RegisterComponent` - User registration
- **Features:**
  - JWT authentication
  - Token-based sessions
  - Form validation

#### AccountModule
- **Routes:** `/account/profile`, `/account/orders` (protected)
- **Components:**
  - `AccountProfileComponent` - User profile
  - `AccountOrdersComponent` - Order history
- **Protection:** AuthGuard (requires login + valid tenantId)

#### HelpModule
- **Route:** `/help`
- **Component:** `HelpComponent`
- **Features:**
  - FAQ accordion (7 FAQs)
  - Contact form

---

## Services & API Integration

### 1. ApiService (Base HTTP Wrapper)
**File:** `src/app/core/services/api.service.ts`

**Purpose:** Centralized HTTP client wrapper

**Methods:**
```typescript
get<T>(path: string, params?: any): Observable<T>
post<T>(path: string, body: any): Observable<T>
put<T>(path: string, body: any): Observable<T>
delete<T>(path: string): Observable<T>
```

**Headers Injected by Interceptor:**
- `Authorization: Bearer {token}`
- `X-Tenant-Id: {tenantId}`

---

### 2. AuthService
**File:** `src/app/core/services/auth.service.ts`

**Purpose:** Handle user authentication and session management

**Local Storage Keys:**
- `storefront_token` - JWT authentication token
- `storefront_user` - User profile JSON

**Methods:**

| Method | API Endpoint | Payload | Purpose |
|--------|--------------|---------|---------|
| `login()` | `POST /auth/login` | `{ email, password }` | Authenticate user |
| `register()` | `POST /Customer/create` | `{ tenantId, firstName, lastName, email, password, status }` | Create new account |
| `logout()` | (Local only) | — | Clear session |
| `getToken()` | (LocalStorage) | — | Retrieve JWT token |
| `getUser()` | (LocalStorage) | — | Get user profile |
| `isLoggedIn()` | (Check token) | — | Verify if authenticated |
| `getTenantId()` | (Priority check) | — | Get tenant ID |

**Login Response Structure:**
```typescript
{
  success: boolean,
  data: {
    token: string,           // JWT token
    customerId: number,
    firstName: string,
    lastName: string,
    email: string,
    tenantId: number
  }
}
```

**Tenant ID Priority:**
1. User's stored tenantId (if logged in)
2. Domain-resolved tenantId from TenantResolverService
3. Null/0 (fallback)

---

### 3. ProductService
**File:** `src/app/core/services/product.service.ts`

**Purpose:** Handle product data retrieval and management

**Methods:**

| Method | API Endpoint | Parameters |
|--------|--------------|------------|
| `getProductsByTenant()` | `GET /Product/tenant/{tenantId}` | tenantId, pageNumber, pageSize |
| `getProductById()` | `GET /Product/{id}` | productId |
| `getProductsByCategory()` | `GET /Product/category/{categoryId}` | categoryId, pageNumber, pageSize |

**Response Data Model:**
```typescript
interface ProductResponseDto {
  productId: number;
  tenantId: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId?: number;
  stockQty: number;           // Available quantity
  status: boolean;
  createdDate: string;
  imagesUrls: string[];       // Multiple product images
}

interface PaginatedProducts {
  items: ProductResponseDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
```

**Usage Examples:**
- Shop page: `getProductsByTenant()` with pagination
- Category filter: `getProductsByCategory(categoryId)`
- Product detail: `getProductById(productId)`

---

### 4. CategoryService
**File:** `src/app/core/services/category.service.ts`

**Purpose:** Retrieve and manage product categories

**Methods:**

| Method | API Endpoint |
|--------|--------------|
| `getCategoriesByTenant()` | `GET /Category/tenant/{tenantId}?pageNumber=1&pageSize=1000` |
| `getCategoryById()` | `GET /Category/{id}` |

**Data Model:**
```typescript
interface CategoryResponseDto {
  categoryId: number;
  tenantId: number;
  name: string;
  parentCategoryId?: number;  // For nested categories
  status: boolean;
  imageUrl?: string;
}
```

**Usage:**
- Shop sidebar: Display all categories for filtering
- Category grid (CMS): Show category browse page

---

### 5. CartService
**File:** `src/app/core/services/cart.service.ts`

**Purpose:** Manage client-side shopping cart state

**Storage Key:** `storefront_cart`

**State Management Pattern:** BehaviorSubject + RxJS Observables

**Observables:**
```typescript
cart$: Observable<CartItem[]>        // Current cart items
cartCount$: Observable<number>       // Total item quantity
```

**Methods:**

| Method | Purpose |
|--------|---------|
| `getItems(): CartItem[]` | Get all cart items |
| `getCount(): number` | Get total quantity |
| `addToCart(item: CartItem)` | Add/increment product (respects stock) |
| `updateQuantity(productId, quantity)` | Change item quantity |
| `removeItem(productId)` | Delete item from cart |
| `clearCart()` | Empty the cart |
| `getTotal(): number` | Calculate cart sum |

**CartItem Data Structure:**
```typescript
interface CartItem {
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stockQty: number;           // Max allowed quantity
  badge?: string;
  variant?: string;
}
```

**Quantity Validation:**
- Cannot exceed `stockQty`
- Minimum quantity: 1
- Cannot exceed available stock on add/update

---

### 6. OrderService
**File:** `src/app/core/services/order.service.ts`

**Purpose:** Handle order creation and retrieval

**Methods:**

| Method | API Endpoint | Payload |
|--------|--------------|---------|
| `createOrder()` | `POST /order/create` | `{ tenantId, customerName, customerEmail?, customerPhone?, totalAmount, status }` |
| `addOrderDetail()` | `POST /order/detail/add` | `{ orderId, productId, quantity, price }` |
| `getOrderById()` | `GET /order/{id}` | orderId |
| `getOrderDetails()` | `GET /order/{orderId}/details` | orderId |
| `getMyOrders()` | `GET /order/tenant/{tenantId}` | tenantId, pageNumber, pageSize |

**Order Workflow (Checkout Process):**
1. Validate checkout form
2. Call `createOrder()` → Returns orderId
3. For each cart item, call `addOrderDetail()`
4. Wait for all API calls to complete
5. Clear cart
6. Show confirmation with Order ID

**Order Status Values:** (Backend defines these)
- 'Pending'
- 'Confirmed'
- 'Shipped'
- 'Delivered'
- 'Cancelled'

---

### 7. CmsService
**File:** `src/app/core/services/cms.service.ts`

**Purpose:** Manage dynamic CMS pages and sections

**Methods:**

| Method | API Endpoint | Purpose |
|--------|--------------|---------|
| `getPagesByTenant()` | `GET /page/tenant/{tenantId}` | List all pages |
| `getPageBySlug()` | (Local filter) | Find page by URL slug |
| `getSectionsByPage()` | `GET /Section/page/{pageId}` | Get page sections |
| `getSectionData()` | `GET /SectionData/section/{sectionId}` | Get section fields |
| `getPageWithSections()` | (Composed call) | Fetch complete page with data |

**Data Models:**
```typescript
interface PageResponseDto {
  pageId: number;
  tenantId: number;
  title: string;
  slug: string;              // URL slug (e.g., 'home', 'about')
  status: boolean;
  createdDate: string;
}

interface FullSection {
  sectionId: number;
  pageId: number;
  type: string;              // 'hero', 'products', 'category', 'banner', etc.
  orderNo: number;           // Display order
  status: boolean;
  data: SectionDataResponseDto[];
}

interface SectionDataResponseDto {
  dataId: number;
  sectionId: number;
  key: string;               // 'title', 'subtitle', 'image', 'productIds', etc.
  value: string;             // JSON stringified if complex
}
```

**Section Type Mapping:**
```typescript
'hero' → HeroBannerComponent
'products' → FeaturedProductsComponent
'category' → CategoryGridComponent
'banner' → PromoBannerComponent
```

**Section Data Key Examples:**
```
Hero Banner:
  - title: "Welcome to Our Store"
  - subtitle: "Best Products"
  - image: "/images/hero.jpg"

Featured Products:
  - productIds: "1,2,3,4"

Category Grid:
  - (uses getCategoriesByTenant)

Promo Banner:
  - title: "Summer Sale"
  - link: "/shop"
```

---

### 8. TenantResolverService
**File:** `src/app/core/services/tenant-resolver.service.ts`

**Purpose:** Resolve tenant from domain on app startup (multi-tenant support)

**API Endpoint:**
```
GET /Tenant/resolve?domain={window.location.hostname}
```

**Storage:**
- `website_tenant_id` - Resolved tenant ID
- `website_theme_color` - Theme color CSS variable

**Methods:**

| Method | Purpose |
|--------|---------|
| `resolve()` | Called by APP_INITIALIZER, detects domain and fetches tenantId |
| `getTenantId()` | Returns cached or stored tenantId |
| `applyTheme(color)` | Set CSS custom property `--primary-color` |

**Response Structure:**
```typescript
{
  data: {
    tenantId: number,
    themeColor?: string  // 'blue', 'red', 'green', etc.
  }
}
```

**Initialization Flow:**
1. App starts
2. APP_INITIALIZER calls `resolve()`
3. Extracts `window.location.hostname`
4. Calls API: `GET /Tenant/resolve?domain=example.com`
5. Stores tenantId in localStorage
6. Applies theme colors
7. App continues loading

---

## Components

### Layout Components

#### MainLayoutComponent
**File:** `src/app/layout/main-layout/`

**Structure:**
```html
<app-header></app-header>
<main>
  <router-outlet></router-outlet>
</main>
<app-footer></app-footer>
```

**Purpose:** Main application wrapper

#### HeaderComponent
**File:** `src/app/shared/components/header/`

**Features:**
- Navigation menu (Desktop & Mobile)
- Logo/Home link
- Mobile menu toggle button
- Links: Home, Shop, Help, Account (if logged in), Cart
- Cart badge with item count (real-time)
- Menu auto-close on navigation

**Key Bindings:**
- `cart$.subscribe()` → Updates badge count
- `isMenuOpen` → Toggle mobile menu
- `screenWidth` → Responsive behavior

**Menu Items (Conditional):**
```
Home
Shop
Help
Account (if logged in)
├── Profile
├── My Orders
└── Logout
Cart (always visible, shows count)
```

#### FooterComponent
**File:** `src/app/shared/components/footer/`

**Content:**
- Company information
- Links section
- Social media links (if configured)

---

### Feature Components

#### Home Page
**File:** `src/app/features/home/`

**Component:** `HomeComponent`

**Functionality:**
1. Load CMS home page by slug 'home'
2. Fetch all sections for the page
3. Render sections dynamically via `SectionRendererComponent`
4. Display hero banner, featured products, categories, etc.

**Error Handling:** Shows error message if home page not found

---

#### Shop Page
**File:** `src/app/features/shop/`

**Component:** `ShopComponent`

**Layout:**
```
Desktop: [Sidebar Filters] [Product Grid]
Mobile:  [Filter Button] [Product Grid]
```

**Features:**
- **Category Filter:**
  - Sidebar (desktop) / Drawer (mobile)
  - List of all categories
  - Active category highlighting
  - Click to filter products
  
- **Product Grid:**
  - Responsive columns (2-4 depending on screen)
  - 12 products per page
  - Product cards with images, names, prices
  - "View Details" and "Add to Cart" buttons
  
- **Pagination:**
  - Previous/Next buttons
  - Page number display
  - Total results count

**Key Methods:**
```typescript
loadProducts()              // Fetch products
loadCategories()            // Get all categories
selectCategory(id)          // Filter by category
changePage(pageNum)         // Pagination
onScreenResize()            // Toggle mobile/desktop
```

**Reactive Bindings:**
- `ActivatedRoute.queryParams` → Category ID
- `@HostListener('window:resize')` → Responsive state
- Form control for page size selector

---

#### Product Detail Page
**File:** `src/app/features/product/`

**Components:**
- `ProductDetailComponent` - Main view
- `ImageGalleryComponent` - Image viewer

**ProductDetailComponent Features:**

**Header Section:**
- Breadcrumb: Home > Shop > Category > Product

**Image Gallery:**
- Main large image display
- Thumbnail selection
- Auto-play carousel (optional)

**Product Information:**
- Product name
- Price (formatted currency)
- Rating (if available)
- Description
- Stock status

**Quantity Selector:**
- Minus button (−)
- Quantity input field
- Plus button (+)
- Stock validation: `quantity ≤ stockQty`

**Add to Cart Button:**
- Disabled if out of stock
- Shows loading state during add
- Success message/notification

**Related Products (Optional):**
- Show similar category products

**Data Fetching:**
```typescript
ngOnInit() {
  const id = this.route.params['id'];
  this.productService.getProductById(id).subscribe(
    product => this.displayProduct(product)
  );
}
```

---

#### Cart Page
**File:** `src/app/features/cart/`

**Component:** `CartComponent`

**Sections:**

**Cart Items List:**
- Product thumbnail
- Product name
- Unit price
- Quantity (with ±1 buttons)
- Subtotal (price × quantity)
- Remove button

**Order Summary (Right Panel/Bottom):**
```
Subtotal:        ₨X,XXX.00
Shipping:        ₨500.00 (fixed)
Tax (0%):        ₨0.00
─────────────────────────
Total:           ₨X,XXX.00
```

**Actions:**
- "Continue Shopping" button → Navigate to shop
- "Proceed to Checkout" button → Navigate to checkout
- "Clear Cart" button (if items exist)

**Empty Cart State:**
- "Your cart is empty" message
- "Continue Shopping" button

**Features:**
- Real-time subtotal updates
- Quantity validation (cannot exceed stock)
- Persist cart to localStorage
- Observable updates via `cartService.cart$`

---

#### Checkout Page
**File:** `src/app/features/checkout/`

**Component:** `CheckoutComponent`

**Form Layout:**

**Left Side - Order Form:**

```
Customer Information:
┌─────────────────────────┐
│ Full Name (required)    │
│ [____________________] │
│                         │
│ Email (optional)        │
│ [____________________] │
│                         │
│ Phone (optional)        │
│ [____________________] │
└─────────────────────────┘

Delivery Address:
┌─────────────────────────┐
│ Address                 │
│ [____________________] │
│                         │
│ City                    │
│ [____________________] │
└─────────────────────────┘

Payment Method (required):
┌─────────────────────────┐
│ ○ Cash on Delivery      │
│ ○ Credit/Debit Card     │
│ ○ EasyPaisa             │
└─────────────────────────┘

Shipping Method:
┌─────────────────────────┐
│ ○ Standard (5-7 days)   │
│ ○ Express (2-3 days)    │
└─────────────────────────┘

[PLACE ORDER] [CANCEL]
```

**Right Side - Order Summary:**
```
ORDER SUMMARY
────────────────────
Items in Cart:
1x Product A    ₨X,XXX
2x Product B    ₨Y,YYY
...
────────────────────
Subtotal:       ₨X,XXX.00
Shipping:       ₨500.00
Tax:            ₨0.00
════════════════════
TOTAL:          ₨X,XXX.00
```

**Form Validation:**
- Full Name: Required, min 2 chars
- Email: Optional, must be valid if provided
- Phone: Optional
- Payment Method: Must select one
- Error messages inline

**Order Processing:**
```
1. Validate form
2. Get tenantId from AuthService
3. Create order header:
   POST /order/create with:
   - tenantId
   - customerName
   - customerEmail (optional)
   - customerPhone (optional)
   - totalAmount
   - status = "Pending"
   ↓ Returns orderId

4. Add order details:
   FOR EACH cart item:
     POST /order/detail/add with:
     - orderId
     - productId
     - quantity
     - price
   ↓ Wait for all calls

5. Clear cart via CartService.clearCart()

6. Show confirmation:
   "Order Created Successfully!"
   "Order ID: ORD-12345"
   "Estimated Delivery: 5-7 days"

7. Disable order button, show "Continue Shopping" link
```

**Success State:**
- Confirmation message with Order ID
- Order ID formatted as `ORD-{orderId}`
- "Continue Shopping" button
- Checkout button disabled

---

#### Login Page
**File:** `src/app/features/auth/login/`

**Component:** `LoginComponent`

**Form Fields:**
```
Email Address (required)
[____________________]

Password (required)
[____________________]

[LOGIN]          [SIGN UP]
```

**Validations:**
- Email: Required, must be valid email format
- Password: Required, min 6 characters

**Error Handling:**
- Show red error message on login failure
- Display error reasons (Invalid credentials, etc.)

**Success Flow:**
1. `AuthService.login(email, password)`
2. API: `POST /auth/login` → Returns token & user
3. Store token in `storefront_token`
4. Store user in `storefront_user`
5. Extract and store tenantId
6. Navigate to home page (`/`)

**Loading State:**
- Button shows "Logging in..." during request
- Disable form inputs during submission

---

#### Register Page
**File:** `src/app/features/auth/register/`

**Component:** `RegisterComponent`

**Form Fields:**
```
First Name (required, min 2)
[____________________]
Error: First name must be at least 2 characters

Last Name (required, min 2)
[____________________]
Error: Last name must be at least 2 characters

Email (required, valid format)
[____________________]
Error: Please enter a valid email

Password (required, min 6)
[____________________]
Error: Password must be at least 6 characters

[CREATE ACCOUNT]  [LOGIN]
```

**Validations:**
- FirstName: Required, minlength 2
- LastName: Required, minlength 2
- Email: Required, email format validation
- Password: Required, minlength 6

**Inline Validation Messages:**
- Show error per field in real-time
- Form submission disabled until all valid

**Submission Payload:**
```typescript
POST /Customer/create
{
  tenantId: number,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  status: "Active"
}
```

**Success Flow:**
1. Show "Creating Account..." during request
2. Navigate to `/auth/login` after success
3. Display success message

**Error Display:**
- Show error message from API
- Keep form data for retry

---

#### Account - Profile Page
**File:** `src/app/features/account/profile/`

**Component:** `AccountProfileComponent`

**Protected Route:** Requires AuthGuard

**Features (Placeholder for future implementation):**
- Display user information
- Edit profile form
- Change password
- Update contact info

**Current State:** Basic component structure

---

#### Account - Orders Page
**File:** `src/app/features/account/orders/`

**Component:** `AccountOrdersComponent`

**Protected Route:** Requires AuthGuard

**Features:**
- Load user orders from `OrderService.getMyOrders(tenantId)`
- Display orders in table/list format:
  ```
  Order ID | Date | Total | Status | Action
  ORD-001  | 2/5  | ₨X,X | Pending| View
  ORD-002  | 2/3  | ₨Y,Y | Shipped| View
  ```
- Click to view order details
- Show order items, delivery address, payment method

---

#### Help Page
**File:** `src/app/features/help/`

**Component:** `HelpComponent`

**Sections:**

**FAQ Accordion (7 FAQs):**
1. **Delivery** - How long does delivery take?
2. **Returns** - Can I return items?
3. **Payment** - What payment methods do you accept?
4. **Tracking** - How do I track my order?
5. **Cancellation** - Can I cancel my order?
6. **Products** - How do I know if a product is in stock?
7. **Contact** - How can I contact support?

**Contact Form:**
```
Name (required)
[____________________]

Email (required)
[____________________]

Subject (dropdown)
[Select Issue ▼]
  - Product Quality
  - Delivery Issue
  - Payment Issue
  - Other

Message (required)
[________________________]
[________________________]

[SEND MESSAGE] [CLEAR]
```

**Form Submission:**
- Validate required fields
- Show loading state
- Display success/error message
- Clear form on success

---

### CMS Dynamic Components

#### Section Renderer Component
**File:** `src/app/cms/section-renderer/`

**Component:** `SectionRendererComponent`

**Purpose:** Dynamic component factory for rendering different section types

**How It Works:**
```typescript
@Input() section: FullSection

ngOnInit() {
  const type = this.normalizeType(section.type);
  // type: 'hero', 'products', 'category', 'banner'
  
  // Render appropriate component
  // <app-hero-banner [section]="section"></app-hero-banner>
  // <app-featured-products [section]="section"></app-featured-products>
  // etc.
}
```

**Type Mapping:**
- `'hero'` → `HeroBannerComponent`
- `'products'` / `'featured'` → `FeaturedProductsComponent`
- `'category'` / `'categories'` → `CategoryGridComponent`
- `'banner'` / `'promo'` → `PromoBannerComponent`

---

#### Hero Banner Component
**File:** `src/app/cms/sections/hero-banner/`

**Component:** `HeroBannerComponent`

**Features:**
- Full-width hero section
- Background image (responsive)
- Title overlay
- Subtitle text
- Auto-slide carousel (4-second interval)
- Navigation buttons (Previous/Next slide)
- Dots indicator for current slide

**Data Source:**
```typescript
section.data:
- 'title': "Welcome to Our Store"
- 'subtitle': "Discover Amazing Products"
- 'image': "/images/hero-bg.jpg"
- 'ctaText': "Shop Now" (optional)
- 'ctaLink': "/shop" (optional)
```

**Responsive:**
- Adjusts height on mobile
- Text size scales
- Buttons remain accessible

---

#### Featured Products Component
**File:** `src/app/cms/sections/featured-products/`

**Component:** `FeaturedProductsComponent`

**Features:**
- Display featured products
- Product cards with images
- 4 products per row (desktop) / responsive
- Each card shows:
  - Product image
  - Product name
  - Price
  - "Add to Cart" button

**Data Source:**
```typescript
section.data:
- 'productIds': "1,2,3,4" (comma-separated)
- OR loads top 4 tenant products if no IDs

Falls back to: ProductService.getProductsByTenant()
```

**Functionality:**
- Click "Add to Cart" → Opens quantity dialog
- Validates stock before adding
- Updates cart in real-time

---

#### Category Grid Component
**File:** `src/app/cms/sections/category-grid/`

**Component:** `CategoryGridComponent`

**Features:**
- Display all tenant categories
- Grid layout (responsive columns)
- Each category card:
  - Category image
  - Category name
  - Item count (if available)
  - Click link to shop filtered by category

**Data Source:**
```typescript
CategoryService.getCategoriesByTenant(tenantId)
```

**Navigation:**
- Click category → `NavigateTo /shop?categoryId={id}`

---

#### Promo Banner Component
**File:** `src/app/cms/sections/promo-banner/`

**Component:** `PromoBannerComponent`

**Features:**
- Call-to-action banner section
- Title text
- Background color/image
- Link button

**Data Source:**
```typescript
section.data:
- 'title': "Summer Sale - 50% Off"
- 'link': "/shop?category=sale"
- 'buttonText': "Shop Sale"
- 'backgroundColor': "#FF6B6B"
```

---

#### About Us & Contact Components
**File:** `src/app/cms/sections/about-us/`, `src/app/cms/sections/contact-us/`

**About Us Component:**
- Display company information
- Mission statement
- Team info (if available)

**Contact Us Component:**
- Contact form
- Contact information
- Address, phone, email
- Business hours

---

## Forms & Validations

### Authentication Forms

#### Login Form Validation
```typescript
// Form Fields
email (required, email format)
password (required, min 6)

// Validation Errors
- Email: "Email is required" | "Enter valid email"
- Password: "Password is required"

// Form Valid: All fields pass validation
// Submission: POST /auth/login
```

#### Register Form Validation
```typescript
// Form Fields
firstName (required, minlength 2)
lastName (required, minlength 2)
email (required, email format)
password (required, minlength 6)

// Validation Errors
- FirstName: "First name is required" | "Min 2 characters"
- LastName: "Last name is required" | "Min 2 characters"
- Email: "Email is required" | "Enter valid email"
- Password: "Password is required" | "Min 6 characters"

// Form Valid: All fields pass validation
// Submission: POST /Customer/create

// Post-Submission
Success → Navigate to /auth/login
Error → Display error message, keep form data
```

### Checkout Form Validation
```typescript
// Required Fields
customerName (required, min 2)
paymentMethod (required, default 'Cash')

// Optional Fields
email (valid format if provided)
phone (numeric if provided)
address
city
shippingMethod

// Validation Logic
if (!form.valid) return;
if (cart.empty) return;

// Submission Steps
1. Create order header
2. Add all order details
3. Clear cart
4. Show confirmation
```

### Cart Validations
```typescript
// Add to Cart Validation
if (quantity > stockQty) return error;
if (quantity < 1) return error;

// Quantity Update Validation
if (newQuantity > stockQty) cap at stockQty;
if (newQuantity < 1) remove item;

// Checkout Validation
if (cart.empty) disable checkout button;
```

---

## Authentication & Guards

### AuthGuard
**File:** `src/app/core/guards/auth.guard.ts`

**Purpose:** Protect routes that require authentication

**Logic:**
```typescript
canActivate(): boolean {
  // Check 1: Is user logged in?
  if (!authService.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }
  
  // Check 2: Valid tenant ID?
  if (!authService.getTenantId()) {
    authService.logout();
    router.navigate(['/auth/login']);
    return false;
  }
  
  return true;
}
```

**Protected Routes:**
- `/account/profile`
- `/account/orders`
- `/account/*` (all account routes)

**Failure Action:**
- Redirect to `/auth/login`
- Clear stale authentication data
- Session expires after logout

---

### TenantInterceptor (JWT Interceptor)
**File:** `src/app/core/interceptors/jwt.interceptor.ts`

**Purpose:** Automatically inject authentication headers into all HTTP requests

**Headers Added:**

```typescript
if (token exists) {
  headers['Authorization'] = `Bearer ${token}`;
}

if (tenantId exists) {
  headers['X-Tenant-Id'] = tenantId.toString();
}
```

**Applied To:** All HTTP requests globally

**Request Flow:**
```
Component makes HTTP call
  ↓
TenantInterceptor.intercept()
  ↓
Add Authorization header
  ↓
Add X-Tenant-Id header
  ↓
Send request to backend
  ↓
Backend validates headers
  ↓
Process request
```

---

## Routing Structure

### App Routes
**File:** `src/app/app-routing.module.ts`

**Complete Route Tree:**
```typescript
const routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'shop', loadChildren: () => ShopModule },
      { path: 'product/:id', loadChildren: () => ProductModule },
      { path: 'cart', loadChildren: () => CartModule },
      { path: 'checkout', loadChildren: () => CheckoutModule },
      { path: 'help', loadChildren: () => HelpModule },
      { 
        path: 'account',
        canActivate: [AuthGuard],
        children: [
          { path: 'profile', component: AccountProfileComponent },
          { path: 'orders', component: AccountOrdersComponent }
        ]
      },
      { path: 'auth/login', loadChildren: () => AuthModule },
      { path: 'auth/register', loadChildren: () => AuthModule },
      { path: 'page/:slug', loadChildren: () => CmsModule }
    ]
  },
  { path: '**', redirectTo: '' }  // Catch-all
];
```

### Routing Strategy
- **Lazy Loading:** All feature modules use lazy loading
- **Prefix-based Grouping:** Account routes grouped under `/account`
- **Dynamic Routes:** CMS pages via `/page/:slug`
- **Catch-all:** Unknown routes redirect to home

### Route Parameters
```
/product/:id           → Product ID from URL
/account/...           → Nested account routes
/page/:slug            → CMS page slug (home, about, contact, etc.)
/shop?categoryId=...   → Category filter via query param
```

---

## State Management

### Pattern Used
**BehaviorSubject + RxJS Observables**

**Why This Pattern:**
- Reactive state updates
- Observable subscription in components
- LocalStorage persistence
- No Redux overhead for this project scale

### Cart State (CartService)

**State Structure:**
```typescript
private cartSubject = new BehaviorSubject<CartItem[]>(
  JSON.parse(localStorage.getItem('storefront_cart') || '[]')
);

public cart$ = this.cartSubject.asObservable();

public cartCount$ = this.cart$.pipe(
  map(items => items.reduce((sum, item) => sum + item.quantity, 0))
);
```

**State Mutations:**
```
addToCart(item)
  → cartSubject.value = [...current, item]
  → cartSubject.next(newValue)
  → localStorage.setItem('storefront_cart', JSON.stringify(newValue))
  → Observers (Header, Cart) receive update

updateQuantity(id, qty)
  → Find item → Update quantity
  → cartSubject.next(updated)
  → localStorage updated
  → Observers notified

removeItem(id)
  → Filter out item
  → cartSubject.next(filtered)
  → localStorage updated
  → Observers notified
```

**Observable Subscriptions:**

**HeaderComponent:**
```typescript
cartService.cartCount$.subscribe(count => {
  this.cartBadgeCount = count;  // Update badge in real-time
});
```

**CartComponent:**
```typescript
cartService.cart$.subscribe(items => {
  this.cartItems = items;       // Update cart display
  this.updateCalculations();    // Recalc totals
});
```

### Authentication State

**State Storage:**
```typescript
localStorage.storefront_token   // JWT token
localStorage.storefront_user    // User object JSON
```

**State Access:**
```typescript
authService.isLoggedIn()     // Check token exists
authService.getUser()        // Get user object
authService.getTenantId()    // Get tenant ID
authService.getToken()       // Get JWT token
```

**State Mutations:**
```
login(email, password)
  → API call → Get token + user
  → localStorage.setItem('storefront_token', token)
  → localStorage.setItem('storefront_user', user)
  → Return success

logout()
  → localStorage.removeItem('storefront_token')
  → localStorage.removeItem('storefront_user')
  → Return success
```

### Tenant State

**State Storage:**
```typescript
localStorage.website_tenant_id      // Resolved tenant ID
localStorage.website_theme_color    // Theme color
```

**State Initialization:**
```
APP_INITIALIZER
  → TenantResolverService.resolve()
  → Extract domain from URL
  → API call: GET /Tenant/resolve?domain=example.com
  → localStorage.setItem('website_tenant_id', tenantId)
  → applyTheme(themeColor)
  → CSS variable set: --primary-color = themeColor
```

---

## Data Flow Examples

### Add to Cart Flow
```
1. User on ProductDetailComponent
   └─ Clicks "Add to Cart" button

2. ProductDetailComponent.addToCart()
   ├─ Get quantity from input
   ├─ Validate quantity ≤ stockQty
   └─ Call CartService.addToCart(item)

3. CartService.addToCart(item)
   ├─ Check if item exists in cart
   ├─ If exists: increment quantity
   ├─ If new: add to cart array
   ├─ Emit: cartSubject.next(newCart)
   ├─ Persist: localStorage.setItem('storefront_cart', JSON.stringify(newCart))
   └─ Return: Success

4. Observers receive update via cart$ observable
   ├─ HeaderComponent.cartCount$
   │   └─ Updates badge to show new total quantity
   └─ CartComponent.cart$
       └─ Updates cart items display (if on cart page)

5. Result
   ├─ Badge updated in header (real-time)
   ├─ Cart persisted to localStorage
   └─ User sees success message
```

### Create Order Flow
```
1. User on CheckoutComponent
   └─ Clicks "Place Order" button

2. CheckoutComponent.submitOrder()
   ├─ Validate form fields
   ├─ Validate cart not empty
   ├─ Get tenantId from AuthService
   └─ Call OrderService.createOrder()

3. OrderService.createOrder(orderHeader)
   ├─ API: POST /order/create
   │  payload: {
   │    tenantId,
   │    customerName,
   │    customerEmail,
   │    customerPhone,
   │    totalAmount,
   │    status: 'Pending'
   │  }
   └─ Receive: { orderId, success, ... }

4. For each CartItem:
   └─ OrderService.addOrderDetail(orderId, item)
      ├─ API: POST /order/detail/add
      │  payload: {
      │    orderId,
      │    productId,
      │    quantity,
      │    price
      │  }
      └─ Receive: { success, ... }

5. Promise.all(allDetailCalls)
   └─ Wait for all order details to be created

6. On Success:
   ├─ CartService.clearCart()
   │  └─ cartSubject.next([])
   │  └─ localStorage.setItem('storefront_cart', '[]')
   ├─ Set orderConfirmed = true
   ├─ Display confirmation message
   ├─ Show Order ID: ORD-{orderId}
   └─ Disable order button, show "Continue Shopping"

7. Result
   ├─ Order created in backend
   ├─ Cart cleared
   └─ User sees order confirmation
```

### Category Filter Flow
```
1. User on ShopComponent
   └─ Clicks category in sidebar

2. ShopComponent.selectCategory(categoryId)
   ├─ Set selectedCategoryId = categoryId
   └─ Call router.navigate(['/shop'], { queryParams: { categoryId } })

3. Router updates URL
   └─ /shop?categoryId=5

4. ActivatedRoute.queryParams.subscribe()
   ├─ Detect queryParams change
   ├─ Extract categoryId = 5
   └─ Call loadProducts()

5. loadProducts()
   ├─ If categoryId exists:
   │  └─ ProductService.getProductsByCategory(5)
   └─ Else:
      └─ ProductService.getProductsByTenant(tenantId)

6. API Response
   ├─ Receive: { items: [...], totalCount, totalPages, ... }
   └─ Update products[] array

7. View Update
   ├─ Product grid re-renders
   ├─ Shows filtered products only
   └─ Pagination updates with new totalPages

8. Result
   ├─ URL shows filter: /shop?categoryId=5
   ├─ Products filtered by category
   └─ Category highlighted in sidebar
```

### Login Flow
```
1. User on LoginComponent
   ├─ Enters email & password
   └─ Clicks "Login" button

2. LoginComponent.login()
   ├─ Validate form (email, password required)
   ├─ Show loading state: "Logging in..."
   └─ Call AuthService.login(email, password)

3. AuthService.login(email, password)
   ├─ API: POST /auth/login
   │  payload: { email, password }
   └─ Receive: { 
   │    success: true,
   │    data: {
   │      token,
   │      customerId,
   │      firstName,
   │      lastName,
   │      email,
   │      tenantId
   │    }
   │  }

4. Store Authentication State:
   ├─ localStorage.setItem('storefront_token', token)
   ├─ localStorage.setItem('storefront_user', JSON.stringify(userData))
   └─ AuthService.isLoggedIn() now returns true

5. On Success:
   ├─ Clear error message
   ├─ Navigate to home page: router.navigate(['/'])
   └─ HeaderComponent updates to show user menu

6. On Failure:
   ├─ Display error message: "Invalid credentials"
   ├─ Keep form data for retry
   └─ Button stops loading

7. Result
   ├─ User authenticated
   ├─ Token stored for future requests
   ├─ Account routes now accessible
   └─ User redirected to home
```

---

## Multi-Tenant Architecture

### Overview
The application supports multiple storefronts running from different domains, all using the same backend.

### Tenant Resolution Process

**On App Startup:**
```
1. Extract domain from window.location.hostname
   Example: storefrontA.com → resolve tenantId for Store A
   Example: storefrontB.com → resolve tenantId for Store B

2. Call API: GET /Tenant/resolve?domain=storefrontA.com

3. Backend returns:
   {
     data: {
       tenantId: 1,
       themeColor: "blue"
     }
   }

4. Store in localStorage:
   ├─ website_tenant_id: 1
   └─ website_theme_color: blue

5. Apply theme:
   └─ CSS variable: --primary-color = "blue"

6. All subsequent API calls include: X-Tenant-Id: 1
```

### Tenant ID Usage

**In Services:**
```typescript
// All API calls scoped to tenant
ProductService.getProductsByTenant(tenantId)
  → GET /Product/tenant/{tenantId}

CategoryService.getCategoriesByTenant(tenantId)
  → GET /Category/tenant/{tenantId}

OrderService.getMyOrders(tenantId)
  → GET /order/tenant/{tenantId}

CmsService.getPagesByTenant(tenantId)
  → GET /page/tenant/{tenantId}
```

### Tenant ID Resolution Priority

**AuthService.getTenantId():**
```
1. Check if user is logged in
   └─ If yes, return user.tenantId (from login response)

2. Check TenantResolverService
   └─ Return domain-resolved tenantId

3. Fallback
   └─ Return null or 0 (use defaults)
```

### Multi-Tenant Features

- **Separate Product Catalogs:** Each tenant has own products
- **Separate Categories:** Each tenant has own categories
- **Separate Orders:** Orders filtered by tenantId
- **Theme Customization:** Each tenant can have different colors
- **CMS Pages:** Each tenant has own pages and sections
- **Customers:** Each customer belongs to a tenant

### Tenant ID Transmission

**Via Header in Every Request:**
```typescript
// TenantInterceptor adds:
headers['X-Tenant-Id'] = tenantId.toString();

// All requests automatically include:
GET /Product/tenant/1  (header: X-Tenant-Id: 1)
POST /order/create     (header: X-Tenant-Id: 1)
etc.
```

---

## Environment Configuration

### Development Environment
**File:** `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5025/api',
  apiBase: 'http://localhost:5025'
};
```

**Usage:**
```typescript
import { environment } from '@env/environment';

// In services:
this.apiUrl = environment.apiUrl;  // http://localhost:5025/api
this.apiBase = environment.apiBase; // http://localhost:5025
```

### Production Environment
**File:** `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'http://anasali1-001-site1.ltempurl.com/api',
  apiBase: 'http://anasali1-001-site1.ltempurl.com'
};
```

### Build Configuration
**File:** `angular.json`

```json
"configurations": {
  "development": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.ts"
      }
    ]
  },
  "production": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.prod.ts"
      }
    ]
  }
}
```

---

## Styling & Design

### Design System

**Color Scheme:**
- Primary Color: Blue (#007BFF) or custom per tenant
- Secondary Color: Orange (accent)
- Neutral: Grays (#333, #555, #999)

**Typography:**
- Font Family: System default or custom
- Heading sizes: Responsive (h1-h6)
- Body text: 14-16px

### CSS Frameworks

**Tailwind CSS (Primary)**
```
Utility-first CSS framework
Used for: Layout, spacing, responsive, colors
Example: class="bg-blue-500 p-4 md:p-8 flex justify-between"
```

**Bootstrap (Secondary)**
```
Component framework
Used for: Cards, buttons, forms, utilities
Example: class="btn btn-primary" or class="alert alert-success"
```

**Component Stylesheets**
```
Component-specific CSS
Files: *.component.css
Scoped to component only (Angular encapsulation)
```

### Responsive Design

**Breakpoints (Tailwind):**
```
Mobile:   < 640px   (sm)
Tablet:   640px+    (md)
Desktop:  1024px+   (lg)
Wide:     1280px+   (xl)
```

**Mobile-First Approach:**
- Base styles for mobile
- Breakpoint prefixes for larger screens
- Example: `block md:flex` (block on mobile, flex on tablet+)

### Component Styling Examples

**Header (Responsive Navigation):**
```css
/* Mobile: Stack menu vertically */
@media (max-width: 768px) {
  .menu { display: none; }  /* Hidden by default */
  .menu.open { display: flex; }
  .menu-item { display: block; }
}

/* Desktop: Horizontal menu */
@media (min-width: 769px) {
  .menu { display: flex; }
  .menu-item { display: inline-block; }
}
```

**Shop Page (Responsive Grid):**
```css
/* Mobile: 2 columns */
@media (max-width: 640px) {
  .product-grid { grid-template-columns: 1fr 1fr; }
}

/* Tablet: 3 columns */
@media (min-width: 641px) {
  .product-grid { grid-template-columns: 1fr 1fr 1fr; }
}

/* Desktop: 4 columns */
@media (min-width: 1024px) {
  .product-grid { grid-template-columns: 1fr 1fr 1fr 1fr; }
}
```

---

## Common Architectural Patterns

### 1. Service Locator Pattern
```typescript
// All services injected via constructor
constructor(
  private productService: ProductService,
  private cartService: CartService,
  private authService: AuthService
) {}
```

### 2. Observable Pattern
```typescript
// RxJS Observables for reactive updates
cartService.cart$.subscribe(items => {
  this.updateDisplay(items);
});
```

### 3. Guard Pattern
```typescript
// AuthGuard protects routes
{
  path: 'account',
  canActivate: [AuthGuard],
  children: [...]
}
```

### 4. Interceptor Pattern
```typescript
// TenantInterceptor auto-injects headers
@Injectable()
export class TenantInterceptor implements HttpInterceptor {
  intercept(req, next) {
    return next.handle(req.clone({
      setHeaders: { 'X-Tenant-Id': tenantId }
    }));
  }
}
```

### 5. Factory Pattern
```typescript
// SectionRendererComponent creates dynamic components
renderSection(section: FullSection) {
  const componentType = this.getComponentForType(section.type);
  // Instantiate and render
}
```

### 6. State Management Pattern
```typescript
// BehaviorSubject for state management
private cartSubject = new BehaviorSubject<CartItem[]>([]);
cart$ = this.cartSubject.asObservable();
```

---

## Best Practices Implemented

1. **Lazy Loading Modules** - Each feature module lazy-loaded
2. **Error Handling** - Try-catch in services + component error display
3. **Loading States** - Disabled buttons + spinners during async ops
4. **Responsive Design** - Mobile-first, works on all screen sizes
5. **State Persistence** - localStorage for cart & auth tokens
6. **Singleton Services** - CoreModule prevents duplicate instances
7. **Reactive Programming** - RxJS for async data flows
8. **Scoped Styles** - Component CSS doesn't conflict
9. **Route Protection** - AuthGuard for secured routes
10. **Type Safety** - TypeScript interfaces for all data

---

## Project Statistics

- **Modules:** 9 (Root + Core + Layout + Shared + CMS + 5 Feature)
- **Components:** 25+ (Layout, Shared, CMS, Feature components)
- **Services:** 8 (Product, Category, Cart, Order, Auth, Cms, Tenant, Api)
- **Routes:** 10+ (Shop, Product, Cart, Checkout, Auth, Account, Help, CMS)
- **Forms:** 5+ (Login, Register, Checkout, Help, Contact)
- **Guards:** 1 (AuthGuard)
- **Interceptors:** 1 (TenantInterceptor)

---

## Quick Reference

### Key File Locations
```
src/
├── app/
│   ├── app.module.ts (Root)
│   ├── app-routing.module.ts (Routes)
│   ├── core/ (Services & Guards)
│   ├── layout/ (Main Layout)
│   ├── shared/ (Shared Components)
│   ├── cms/ (CMS Components)
│   ├── features/ (Feature Modules)
│   │   ├── home/
│   │   ├── shop/
│   │   ├── product/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── auth/
│   │   ├── account/
│   │   └── help/
│   └── styles.css (Global Styles)
└── environments/
    ├── environment.ts (Dev)
    └── environment.prod.ts (Prod)
```

### Common Commands
```bash
# Development server
npm start

# Build for production
npm run build

# Run unit tests
npm test

# Build production bundle
npm run build -- --configuration production
```

### API Endpoints Summary
```
Authentication:
  POST /auth/login
  POST /Customer/create (register)

Products:
  GET /Product/tenant/{tenantId}
  GET /Product/{id}
  GET /Product/category/{categoryId}

Categories:
  GET /Category/tenant/{tenantId}
  GET /Category/{id}

Orders:
  POST /order/create
  POST /order/detail/add
  GET /order/{id}
  GET /order/{orderId}/details
  GET /order/tenant/{tenantId}

CMS:
  GET /page/tenant/{tenantId}
  GET /Section/page/{pageId}
  GET /SectionData/section/{sectionId}

Tenant:
  GET /Tenant/resolve?domain={domain}
```

---

This documentation provides a comprehensive guide to understanding the entire Angular storefront project. Use this as a reference for development, debugging, and feature additions.
