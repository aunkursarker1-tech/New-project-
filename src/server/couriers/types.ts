export type CourierPartner = 'Steadfast Courier' | 'Pathao Courier';

export interface CourierShipmentRequest {
  orderId: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail?: string;
  address: string;
  division: string;
  district: string;
  thana: string;
  codAmount: number | string;
  amount_to_collect?: number | string;
  cod_amount?: number | string;
  total?: number | string;
  paymentMethod?: string;
  order?: any;
  itemDescription: string;
  itemWeightKg?: number;
  specialInstruction?: string;
  courierName?: CourierPartner;
}

export interface CourierShipmentResponse {
  success: boolean;
  courierName: CourierPartner;
  trackingNumber: string;
  consignmentId: string;
  status: string;
  deliveryFee: number;
  estimatedDeliveryDays: string;
  message: string;
  rawResponse?: any;
  errorDetails?: string;
  isMockFallback?: boolean;
}

export interface CourierTrackingResponse {
  success: boolean;
  courierName: CourierPartner;
  trackingNumber: string;
  consignmentId?: string;
  currentStatus: string; // Mapped order status e.g. "Shipped", "Out for Delivery", "Delivered", "Cancelled"
  rawCourierStatus: string;
  riderName?: string;
  riderPhone?: string;
  location?: string;
  updatedAt: string;
  events: Array<{
    timestamp: string;
    status: string;
    description: string;
    location?: string;
  }>;
}

export interface CourierHealthStatus {
  courier: CourierPartner;
  configured: boolean;
  active: boolean;
  baseUrl: string;
  message: string;
}
