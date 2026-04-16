import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface OrderCreatePayload {
  tenantId: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  totalAmount: number;
  status: string;        // 'Pending'
}

export interface OrderDetailPayload {
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
}

export interface OrderResponseDto {
  orderId: number;
  tenantId: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  totalAmount: number;
  status: string;
  createdDate: string;
}

export interface OrderDetailResponseDto {
  orderDetailId: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
}

@Injectable()
export class OrderService {
  constructor(private api: ApiService) {}

  // POST /order/create
  createOrder(payload: OrderCreatePayload): Observable<OrderResponseDto> {
    return this.api
      .post<any>('/order/create', payload)
      .pipe(map((res) => res.data));
  }

  // POST /order/detail/add
  addOrderDetail(detail: OrderDetailPayload): Observable<OrderDetailResponseDto> {
    return this.api
      .post<any>('/order/detail/add', detail)
      .pipe(map((res) => res.data));
  }

  // GET /order/{id}
  getOrderById(id: number): Observable<OrderResponseDto> {
    return this.api
      .get<any>(`/order/${id}`)
      .pipe(map((res) => res.data));
  }

  // GET /order/{orderId}/details
  getOrderDetails(orderId: number): Observable<OrderDetailResponseDto[]> {
    return this.api
      .get<any>(`/order/${orderId}/details`)
      .pipe(map((res) => res.data || []));
  }

  // GET /order/tenant/{tenantId}
  getMyOrders(tenantId: number, pageNumber = 1, pageSize = 20): Observable<any> {
    return this.api
      .get<any>(`/order/tenant/${tenantId}`, { pageNumber, pageSize })
      .pipe(map((res) => res.data));
  }
}