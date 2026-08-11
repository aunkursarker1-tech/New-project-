import { CourierShipmentRequest, CourierShipmentResponse, CourierTrackingResponse, CourierHealthStatus, CourierPartner } from './types.js';
import { createSteadfastShipment, getSteadfastTracking } from './steadfast.js';
import { createPathaoShipment, getPathaoTracking } from './pathao.js';

// In-memory shipment registry for tracking lookup by orderId or tracking code
const shipmentRegistry = new Map<string, { request: CourierShipmentRequest; response: CourierShipmentResponse; createdAt: string }>();

export function autoSelectCourier(district: string): CourierPartner {
  const d = (district || '').toLowerCase();
  if (d === 'dhaka') {
    return 'Pathao Courier'; // Express same-day rider coverage in Dhaka
  }
  return 'Steadfast Courier'; // Nationwide express COD parcel delivery
}

export async function createShipment(req: CourierShipmentRequest): Promise<CourierShipmentResponse> {
  const courier: CourierPartner = req.courierName || autoSelectCourier(req.district);
  
  let result: CourierShipmentResponse;

  switch (courier) {
    case 'Steadfast Courier':
      result = await createSteadfastShipment(req);
      break;
    case 'Pathao Courier':
      result = await createPathaoShipment(req);
      break;
    default:
      result = await createPathaoShipment(req);
  }

  // Register shipment for tracking lookup
  shipmentRegistry.set(result.trackingNumber, { request: req, response: result, createdAt: new Date().toISOString() });
  if (req.orderId) {
    shipmentRegistry.set(req.orderId, { request: req, response: result, createdAt: new Date().toISOString() });
  }

  return result;
}

export async function getTrackingInfo(trackingNumberOrOrderId: string, courierHint?: CourierPartner): Promise<CourierTrackingResponse> {
  const cleanId = (trackingNumberOrOrderId || '').trim();
  const registered = shipmentRegistry.get(cleanId);
  
  let courier: CourierPartner = courierHint || 'Pathao Courier';
  let trackingCode = cleanId;

  if (registered) {
    courier = registered.response.courierName;
    trackingCode = registered.response.trackingNumber;
  } else if (cleanId.startsWith('ST-') || cleanId.startsWith('STF') || cleanId.startsWith('ST')) {
    courier = 'Steadfast Courier';
  } else if (cleanId.startsWith('PTH-') || cleanId.startsWith('PTH')) {
    courier = 'Pathao Courier';
  }

  switch (courier) {
    case 'Steadfast Courier':
      return await getSteadfastTracking(trackingCode);
    case 'Pathao Courier':
      return await getPathaoTracking(trackingCode);
    default:
      return await getPathaoTracking(trackingCode);
  }
}

export function getHealthStatus(): CourierHealthStatus[] {
  return [
    {
      courier: 'Steadfast Courier',
      configured: Boolean(process.env.STEADFAST_API_KEY && process.env.STEADFAST_SECRET_KEY),
      active: true,
      baseUrl: process.env.STEADFAST_BASE_URL || 'https://portal.packzy.com/api/v1',
      message: process.env.STEADFAST_API_KEY ? 'Steadfast API Key loaded. Live dispatch ready.' : 'Configured via environment / database settings.',
    },
    {
      courier: 'Pathao Courier',
      configured: Boolean(process.env.PATHAO_CLIENT_ID && process.env.PATHAO_CLIENT_SECRET),
      active: true,
      baseUrl: process.env.PATHAO_BASE_URL || 'https://api-hermes.pathao.com',
      message: process.env.PATHAO_CLIENT_ID ? 'Pathao Client ID loaded. OAuth dispatch active.' : 'Configured via environment / database settings.',
    },
  ];
}
