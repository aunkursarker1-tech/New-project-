import { CourierShipmentRequest, CourierShipmentResponse, CourierTrackingResponse, CourierHealthStatus, CourierPartner } from './types.js';
import { createSteadfastShipment, getSteadfastTracking } from './steadfast.js';
import { createPathaoShipment, getPathaoTracking } from './pathao.js';
import { createRedxShipment, getRedxTracking } from './redx.js';
import { createPaperflyShipment, getPaperflyTracking } from './paperfly.js';

// In-memory shipment registry for tracking lookup by orderId or tracking code
const shipmentRegistry = new Map<string, { request: CourierShipmentRequest; response: CourierShipmentResponse; createdAt: string }>();

export function autoSelectCourier(district: string): CourierPartner {
  const d = (district || '').toLowerCase();
  if (d === 'dhaka') {
    return 'Pathao Courier'; // Express same-day rider coverage in Dhaka
  } else if (['chittagong', 'sylhet', 'rajshahi', 'khulna', 'barisal', 'rangpur', 'mymensingh'].includes(d)) {
    return 'Steadfast Courier'; // Fast district COD coverage
  } else if (d.includes('gazipur') || d.includes('narayanganj') || d.includes('comilla')) {
    return 'RedX';
  }
  return 'Paperfly'; // Deep nation-wide union coverage
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
    case 'RedX':
      result = await createRedxShipment(req);
      break;
    case 'Paperfly':
      result = await createPaperflyShipment(req);
      break;
    default:
      result = await createSteadfastShipment(req);
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
  
  let courier: CourierPartner = courierHint || 'Steadfast Courier';
  let trackingCode = cleanId;

  if (registered) {
    courier = registered.response.courierName;
    trackingCode = registered.response.trackingNumber;
  } else if (cleanId.startsWith('ST-') || cleanId.startsWith('STF')) {
    courier = 'Steadfast Courier';
  } else if (cleanId.startsWith('PTH-') || cleanId.startsWith('PTH')) {
    courier = 'Pathao Courier';
  } else if (cleanId.startsWith('RDX-') || cleanId.startsWith('RDX')) {
    courier = 'RedX';
  } else if (cleanId.startsWith('PF-') || cleanId.startsWith('PF')) {
    courier = 'Paperfly';
  }

  switch (courier) {
    case 'Steadfast Courier':
      return await getSteadfastTracking(trackingCode);
    case 'Pathao Courier':
      return await getPathaoTracking(trackingCode);
    case 'RedX':
      return await getRedxTracking(trackingCode);
    case 'Paperfly':
      return await getPaperflyTracking(trackingCode);
    default:
      return await getSteadfastTracking(trackingCode);
  }
}

export function getHealthStatus(): CourierHealthStatus[] {
  return [
    {
      courier: 'Steadfast Courier',
      configured: Boolean(process.env.STEADFAST_API_KEY && process.env.STEADFAST_SECRET_KEY),
      active: true,
      baseUrl: process.env.STEADFAST_BASE_URL || 'https://portal.steadfast.com.bd/api/v1',
      message: process.env.STEADFAST_API_KEY ? 'Steadfast API Key loaded. Live dispatch ready.' : 'API keys missing in .env. Using fallback generator.',
    },
    {
      courier: 'Pathao Courier',
      configured: Boolean(process.env.PATHAO_CLIENT_ID && process.env.PATHAO_CLIENT_SECRET),
      active: true,
      baseUrl: process.env.PATHAO_BASE_URL || 'https://api-hermes.pathao.com',
      message: process.env.PATHAO_CLIENT_ID ? 'Pathao Client ID loaded. OAuth dispatch active.' : 'OAuth keys missing in .env. Using fallback generator.',
    },
    {
      courier: 'RedX',
      configured: Boolean(process.env.REDX_API_TOKEN),
      active: true,
      baseUrl: process.env.REDX_BASE_URL || 'https://openapi.redx.com.bd/v1.0.0',
      message: process.env.REDX_API_TOKEN ? 'RedX API Token loaded. Live tracking active.' : 'API Token missing in .env. Using fallback generator.',
    },
    {
      courier: 'Paperfly',
      configured: Boolean(process.env.PAPERFLY_API_KEY),
      active: true,
      baseUrl: process.env.PAPERFLY_BASE_URL || 'https://paperflybd.com/api/v1',
      message: process.env.PAPERFLY_API_KEY ? 'Paperfly API Key loaded. Ready.' : 'API Key missing in .env. Using fallback generator.',
    },
  ];
}
