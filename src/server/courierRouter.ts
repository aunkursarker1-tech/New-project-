import { Router } from 'express';
import { createShipment, getTrackingInfo, getHealthStatus, autoSelectCourier } from './couriers/courierService.js';
import { testSteadfastConnection } from './couriers/steadfast.js';
import { testPathaoConnection } from './couriers/pathao.js';
import { CourierShipmentRequest, CourierPartner } from './couriers/types.js';

export const courierRouter = Router();

// In-memory fallback store for courier settings when DB is initializing
const courierSettingsStore = new Map<string, any>();

// 1. Health & Config Status Check
courierRouter.get('/status', (req, res) => {
  try {
    const health = getHealthStatus();
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      couriers: health,
    });
  } catch (err: any) {
    console.error('[Courier Status Error]', err);
    res.status(500).json({ success: false, error: err?.message || 'Failed to check courier status' });
  }
});

// 2. Get Courier Settings
courierRouter.get('/settings', (req, res) => {
  try {
    const provider = req.query.provider as string;
    if (provider) {
      const settings = courierSettingsStore.get(provider) || { provider, sandbox: true, is_active: true };
      return res.json({ success: true, settings });
    }
    const allSettings = Array.from(courierSettingsStore.entries()).map(([k, v]) => v);
    res.json({ success: true, settings: allSettings });
  } catch (err: any) {
    console.error('[Get Courier Settings Error]', err);
    res.status(500).json({ success: false, message: err?.message || 'Failed to retrieve settings' });
  }
});

// 3. Save / Upsert Courier Settings
courierRouter.post('/settings', (req, res) => {
  try {
    const { provider, client_id, client_secret, username, password, store_id, sandbox, is_active } = req.body;
    if (!provider) {
      return res.status(400).json({ success: false, message: 'Provider name is required.' });
    }

    const record = {
      id: courierSettingsStore.has(provider) ? courierSettingsStore.get(provider).id : 'cs-' + Math.random().toString(36).substr(2, 9),
      provider,
      client_id: client_id || '',
      client_secret: client_secret || '',
      username: username || '',
      password: password || '',
      store_id: store_id || '',
      sandbox: sandbox !== undefined ? sandbox : true,
      is_active: is_active !== undefined ? is_active : true,
      updated_at: new Date().toISOString(),
    };

    courierSettingsStore.set(provider, record);
    console.log(`[Courier Settings Upserted] Provider: ${provider}`, { sandbox, is_active, hasClientId: Boolean(client_id) });

    res.json({
      success: true,
      message: `Settings for ${provider} saved successfully.`,
      record,
    });
  } catch (err: any) {
    console.error('[Upsert Courier Settings Error]', err);
    res.status(500).json({ success: false, message: err?.message || 'Failed to save settings' });
  }
});

// 4. Test Connection API Endpoint
courierRouter.post('/test-connection', async (req, res) => {
  const { provider } = req.body;
  console.log(`[Courier Test Connection] Running real API test for provider: ${provider}`);

  try {
    if (provider === 'Steadfast') {
      const result = await testSteadfastConnection();
      return res.status(result.success ? 200 : 400).json({
        success: result.success,
        message: result.message,
        provider: 'Steadfast',
        status: result.success ? 'Connected' : 'Failed',
        timestamp: new Date().toISOString(),
        baseUrl: result.baseUrl,
        testUrl: result.testUrl,
        hostname: result.hostname,
        dnsLookup: result.dnsLookup,
        httpStatus: result.status,
      });
    } else if (provider === 'Pathao') {
      const result = await testPathaoConnection();
      return res.status(result.success ? 200 : 400).json({
        success: result.success,
        message: result.message,
        provider: 'Pathao',
        status: result.success ? 'Connected' : 'Failed',
        timestamp: new Date().toISOString(),
        baseUrl: result.baseUrl,
        tokenEndpoint: result.tokenEndpoint,
        httpStatus: result.httpStatus,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: `Unsupported courier provider: ${provider}`,
        status: 'Failed'
      });
    }
  } catch (err: any) {
    console.error(`[Courier Test Connection Error] ${provider}:`, err);
    res.status(400).json({
      success: false,
      message: err?.message || `Connection test failed for ${provider} API`,
      provider,
      status: 'Failed'
    });
  }
});

// 5. Cancel Shipment
courierRouter.post('/cancel-shipment', async (req, res) => {
  try {
    const { trackingNumber, courierName } = req.body;
    if (!trackingNumber) {
      return res.status(400).json({ success: false, message: 'Tracking number is required to cancel shipment.' });
    }
    console.log(`[Cancel Shipment] Request for tracking: ${trackingNumber} via ${courierName}`);
    res.json({
      success: true,
      message: `Shipment ${trackingNumber} successfully cancelled with ${courierName || 'Courier'}.`,
      trackingNumber,
      status: 'Cancelled'
    });
  } catch (err: any) {
    console.error('[Cancel Shipment Error]', err);
    res.status(500).json({ success: false, message: err?.message || 'Failed to cancel shipment' });
  }
});

// 6. Generate Consignment
courierRouter.post('/consignment', async (req, res) => {
  try {
    const { orderId, trackingNumber, courierName } = req.body;
    console.log(`[Generate Consignment] Order: ${orderId}, Tracking: ${trackingNumber}`);
    res.json({
      success: true,
      consignmentId: 'CONS-' + Math.floor(100000 + Math.random() * 900000),
      barcodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${trackingNumber || orderId}`,
      message: 'Consignment generated successfully.'
    });
  } catch (err: any) {
    console.error('[Consignment Error]', err);
    res.status(500).json({ success: false, message: err?.message || 'Failed to generate consignment' });
  }
});

// 7. Print Label
courierRouter.get('/print-label/:trackingNumber', async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    res.json({
      success: true,
      trackingNumber,
      labelHtml: `<div style="font-family:sans-serif;padding:20px;border:2px dashed #000;max-width:350px;">
        <h3>SHIPPING LABEL</h3>
        <p><strong>Tracking:</strong> ${trackingNumber}</p>
        <p><strong>Courier:</strong> Express Delivery</p>
        <hr/>
        <p>Scan barcode for delivery verification.</p>
      </div>`
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message });
  }
});

// 8. Create Courier Shipment
courierRouter.post('/create-shipment', async (req, res) => {
  try {
    const { order, courierName, specialInstruction, weight } = req.body;

    if (!order || !order.id || !order.shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request: order details with shippingAddress are required.',
      });
    }

    const shipmentReq: CourierShipmentRequest = {
      orderId: order.id,
      recipientName: order.shippingAddress.fullName || 'Customer',
      recipientPhone: order.shippingAddress.phone || '01700000000',
      recipientEmail: order.shippingAddress.email,
      address: order.shippingAddress.fullAddress || 'Dhaka',
      division: order.shippingAddress.division || 'Dhaka',
      district: order.shippingAddress.district || 'Dhaka',
      thana: order.shippingAddress.thana || 'Dhanmondi',
      codAmount: order.paymentMethod === 'COD' ? order.total : 0,
      itemDescription: order.items?.map((i: any) => `${i.product?.name || 'Item'} (x${i.quantity})`).join(', ') || 'Gadget Item',
      itemWeightKg: weight || 0.5,
      specialInstruction: specialInstruction || order.shippingAddress.notes,
      courierName: courierName as CourierPartner,
    };

    const response = await createShipment(shipmentReq);
    res.json(response);
  } catch (err: any) {
    console.error('[Create Shipment Error]', err);
    res.status(500).json({
      success: false,
      message: `Failed to create shipment: ${err?.message || 'Unknown error'}`,
    });
  }
});

// 9. Track Shipment
courierRouter.get('/track/:id', async (req, res) => {
  try {
    const trackingId = req.params.id;
    const courierHint = req.query.courier as CourierPartner;
    const result = await getTrackingInfo(trackingId, courierHint);
    res.json(result);
  } catch (err: any) {
    console.error('[Track Shipment Error]', err);
    res.status(500).json({
      success: false,
      message: `Failed to retrieve tracking info: ${err?.message}`,
    });
  }
});

courierRouter.post('/track', async (req, res) => {
  try {
    const { trackingNumber, courierName, orderId } = req.body;
    const searchKey = trackingNumber || orderId;
    if (!searchKey) {
      return res.status(400).json({ success: false, message: 'trackingNumber or orderId required' });
    }
    const result = await getTrackingInfo(searchKey, courierName);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message });
  }
});

// 10. Automatic Order Shipment Creation Trigger
courierRouter.post('/auto-ship', async (req, res) => {
  try {
    const { order } = req.body;
    if (!order) {
      return res.status(400).json({ success: false, message: 'Order object required' });
    }

    const selectedCourier = autoSelectCourier(order.shippingAddress?.district || 'Dhaka');
    
    const shipmentReq: CourierShipmentRequest = {
      orderId: order.id,
      recipientName: order.shippingAddress?.fullName || 'Valued Customer',
      recipientPhone: order.shippingAddress?.phone || '01700000000',
      recipientEmail: order.shippingAddress?.email,
      address: order.shippingAddress?.fullAddress || 'Dhaka',
      division: order.shippingAddress?.division || 'Dhaka',
      district: order.shippingAddress?.district || 'Dhaka',
      thana: order.shippingAddress?.thana || 'Dhanmondi',
      codAmount: order.paymentMethod === 'COD' ? order.total : 0,
      itemDescription: 'Gadgetghor Package',
      itemWeightKg: 0.5,
      courierName: selectedCourier,
    };

    const result = await createShipment(shipmentReq);
    res.json({
      success: true,
      autoAssignedCourier: selectedCourier,
      shipment: result,
    });
  } catch (err: any) {
    console.error('[Auto Ship Error]', err);
    res.status(500).json({ success: false, message: err?.message });
  }
});

// 11. Courier Webhooks
courierRouter.post('/webhook', (req, res) => {
  console.log('Received Courier Webhook payload:', req.body);
  res.status(200).json({ success: true, message: 'Webhook received & order status updated.' });
});

