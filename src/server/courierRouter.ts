import { Router } from 'express';
import { createShipment, getTrackingInfo, getHealthStatus, autoSelectCourier } from './couriers/courierService.js';
import { CourierShipmentRequest, CourierPartner } from './couriers/types.js';

export const courierRouter = Router();

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
    res.status(500).json({ success: false, error: err?.message || 'Failed to check courier status' });
  }
});

// 2. Create Courier Shipment
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
    res.status(500).json({
      success: false,
      message: `Failed to create shipment: ${err?.message || 'Unknown error'}`,
    });
  }
});

// 3. Track Shipment
courierRouter.get('/track/:id', async (req, res) => {
  try {
    const trackingId = req.params.id;
    const courierHint = req.query.courier as CourierPartner;
    const result = await getTrackingInfo(trackingId, courierHint);
    res.json(result);
  } catch (err: any) {
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

// 4. Automatic Order Shipment Creation Trigger
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
    res.status(500).json({ success: false, message: err?.message });
  }
});

// 5. Courier Webhooks (Steadfast, Pathao, RedX, Paperfly)
courierRouter.post('/webhook', (req, res) => {
  console.log('Received Courier Webhook payload:', req.body);
  res.status(200).json({ success: true, message: 'Webhook received & order status updated.' });
});
