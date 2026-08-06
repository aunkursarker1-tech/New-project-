export type CourierPartner = 'Steadfast Courier' | 'Pathao Courier' | 'RedX' | 'Paperfly';

export interface CourierShipmentRequest {
  orderId: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail?: string;
  address: string;
  division: string;
  district: string;
  thana: string;
  codAmount: number;
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
