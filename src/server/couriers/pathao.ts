import { CourierShipmentRequest, CourierShipmentResponse, CourierTrackingResponse } from './types.js';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseServerClient, cleanString } from '../supabaseServer.js';
import { getStoredCourierSettings } from '../courierSettingsStore.js';

const DEFAULT_BASE_URL = 'https://api-hermes.pathao.com';

let cachedToken: { token: string; expiresAt: number } | null = null;

export function getPathaoBaseUrl(): string {
  let url = (process.env.PATHAO_BASE_URL || DEFAULT_BASE_URL).trim();
  url = url.replace(/^["']|["']$/g, '');
  url = url.replace(/\/+$/, '');
  if (!url || url === 'undefined' || url === 'null' || url === 'https://api.pathao.com') {
    url = DEFAULT_BASE_URL;
  }
  // Strip trailing /aladdin/api/v1 if included in PATHAO_BASE_URL env var
  url = url.replace(/\/aladdin\/api\/v1\/?$/i, '');
  return url;
}

function maskSensitiveFields(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(maskSensitiveFields);
  const clone: any = { ...obj };
  if ('client_secret' in clone && clone.client_secret) clone.client_secret = '***MASKED***';
  if ('password' in clone && clone.password) clone.password = '***MASKED***';
  if ('access_token' in clone && clone.access_token) clone.access_token = '***MASKED_TOKEN***';
  if ('refresh_token' in clone && clone.refresh_token) clone.refresh_token = '***MASKED_TOKEN***';
  return clone;
}

async function logDiagnostic(
  eventType: string,
  endpoint: string,
  requestPayload: any,
  responseData: any,
  statusCode: number,
  errorMsg: string | null
) {
  const maskedReq = maskSensitiveFields(requestPayload);
  const maskedRes = maskSensitiveFields(responseData);

  const logEntry = {
    provider: 'Pathao',
    event_type: eventType,
    endpoint,
    request_payload: maskedReq ? JSON.stringify(maskedReq) : null,
    response_data: maskedRes ? JSON.stringify(maskedRes) : null,
    status_code: statusCode,
    error_message: errorMsg,
    created_at: new Date().toISOString(),
  };

  console.log(`[Pathao Diagnostic Log] [${eventType}] Status: ${statusCode} Endpoint: ${endpoint}`, {
    request: maskedReq,
    response: maskedRes,
    error: errorMsg,
  });

  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      await supabase.from('courier_diagnostic_logs').insert([logEntry]);
    } catch (err) {
      console.warn('[Pathao Diagnostic Log] Could not insert into courier_diagnostic_logs table:', err);
    }
  }
}

export interface PathaoCredentialAudit {
  provider: 'Pathao';
  row_found: boolean;
  client_id_present: boolean;
  client_secret_present: boolean;
  username_present: boolean;
  password_present: boolean;
  store_id_present: boolean;
  sandbox: boolean;
  updated_at: string | null;
  credential_source: string;
  supabase_connected: boolean;
  missing_fields: string[];
  whitespace_detected: {
    client_id: boolean;
    client_secret: boolean;
    username: boolean;
    password: boolean;
    any: boolean;
  };
}

export interface PathaoCredentials {
  provider: 'Pathao';
  source: string;
  client_id: string;
  client_secret: string;
  username: string;
  password: string;
  store_id: string;
  sandbox: boolean;
  client_id_length: number;
  hasWhitespace: boolean;
}

export async function getPathaoCredentialsDetails(): Promise<{
  creds: PathaoCredentials | null;
  audit: PathaoCredentialAudit;
}> {
  const providerColumnValue = 'Pathao';

  let rawClientId = '';
  let rawClientSecret = '';
  let rawUsername = '';
  let rawPassword = '';
  let store_id = 'pth_store_dhanmondi_01';
  let sandbox = true;

  let row_found = false;
  let updated_at: string | null = null;
  let supabase_connected = false;

  let loadedFromSupabase = false;
  let loadedFromStore = false;
  let loadedFromEnv = false;

  // 1. Primary check: Supabase courier_settings table
  const supabase = getSupabaseServerClient();
  if (supabase) {
    supabase_connected = true;
    try {
      // Clean non-canonical provider rows
      const { data: ilikeRows } = await supabase
        .from('courier_settings')
        .select('id, provider')
        .ilike('provider', 'pathao');

      if (ilikeRows && ilikeRows.length > 0) {
        const nonCanonicalIds = ilikeRows
          .filter((r: any) => r.provider !== 'Pathao')
          .map((r: any) => r.id);

        if (nonCanonicalIds.length > 0) {
          console.log('[Pathao Credentials] Removing non-canonical duplicate rows:', nonCanonicalIds);
          await supabase.from('courier_settings').delete().in('id', nonCanonicalIds);
        }
      }

      // Query canonical Pathao row
      const { data, error } = await supabase
        .from('courier_settings')
        .select('*')
        .eq('provider', providerColumnValue)
        .order('updated_at', { ascending: false });

      if (error) {
        console.warn('[Pathao Credentials Warning] Supabase query returned error:', error.message);
      } else if (data && data.length > 0) {
        row_found = true;
        const row = data[0];
        updated_at = row.updated_at || null;

        if (row.client_id !== undefined && row.client_id !== null && String(row.client_id).trim() !== '') {
          rawClientId = String(row.client_id);
          loadedFromSupabase = true;
        }
        if (row.client_secret !== undefined && row.client_secret !== null && String(row.client_secret).trim() !== '') {
          rawClientSecret = String(row.client_secret);
          loadedFromSupabase = true;
        }
        if (row.username !== undefined && row.username !== null && String(row.username).trim() !== '') {
          rawUsername = String(row.username);
          loadedFromSupabase = true;
        }
        if (row.password !== undefined && row.password !== null && String(row.password).trim() !== '') {
          rawPassword = String(row.password);
          loadedFromSupabase = true;
        }
        if (row.store_id !== undefined && row.store_id !== null && String(row.store_id).trim() !== '') {
          store_id = String(row.store_id).trim();
        }
        if (row.sandbox !== undefined && row.sandbox !== null) {
          sandbox = Boolean(row.sandbox);
        }
      } else {
        console.log('[Pathao Credentials] No row found in courier_settings for provider = Pathao in Supabase.');
      }
    } catch (err: any) {
      console.warn('[Pathao Credentials Exception] Error querying courier_settings:', err?.message);
    }
  } else {
    console.warn('[Pathao Credentials] Supabase client is not initialized.');
  }

  // 2. Secondary check: In-memory store (saved via Admin Panel in this Node instance)
  const memSettings = getStoredCourierSettings('Pathao');
  if (memSettings) {
    if (memSettings.client_id && cleanString(memSettings.client_id) !== '') {
      rawClientId = memSettings.client_id;
      loadedFromStore = true;
    }
    if (memSettings.client_secret && cleanString(memSettings.client_secret) !== '') {
      rawClientSecret = memSettings.client_secret;
      loadedFromStore = true;
    }
    if (memSettings.username && cleanString(memSettings.username) !== '') {
      rawUsername = memSettings.username;
      loadedFromStore = true;
    }
    if (memSettings.password && cleanString(memSettings.password) !== '') {
      rawPassword = memSettings.password;
      loadedFromStore = true;
    }
    if (memSettings.store_id && cleanString(memSettings.store_id) !== '') {
      store_id = memSettings.store_id;
    }
    if (memSettings.sandbox !== undefined) {
      sandbox = Boolean(memSettings.sandbox);
    }
  }

  // 3. Fallback: Environment Variables
  if (!rawClientId && process.env.PATHAO_CLIENT_ID) {
    rawClientId = process.env.PATHAO_CLIENT_ID;
    loadedFromEnv = true;
  }
  if (!rawClientSecret && process.env.PATHAO_CLIENT_SECRET) {
    rawClientSecret = process.env.PATHAO_CLIENT_SECRET;
    loadedFromEnv = true;
  }
  if (!rawUsername && process.env.PATHAO_USERNAME) {
    rawUsername = process.env.PATHAO_USERNAME;
    loadedFromEnv = true;
  }
  if (!rawPassword && process.env.PATHAO_PASSWORD) {
    rawPassword = process.env.PATHAO_PASSWORD;
    loadedFromEnv = true;
  }
  if ((!store_id || store_id === 'pth_store_dhanmondi_01') && process.env.PATHAO_STORE_ID) {
    store_id = process.env.PATHAO_STORE_ID;
  }
  if (process.env.PATHAO_SANDBOX !== undefined) {
    sandbox = process.env.PATHAO_SANDBOX !== 'false';
  }

  // Determine credential source description
  let credentialSource = 'Neither';
  if (loadedFromSupabase) {
    credentialSource = 'Supabase (courier_settings)';
  } else if (loadedFromStore) {
    credentialSource = 'Admin Panel Store';
  } else if (loadedFromEnv) {
    credentialSource = 'Environment Variables';
  }

  const clientIdHasWhitespace = rawClientId !== cleanString(rawClientId);
  const clientSecretHasWhitespace = rawClientSecret !== cleanString(rawClientSecret);
  const usernameHasWhitespace = rawUsername !== cleanString(rawUsername);
  const passwordHasWhitespace = rawPassword !== cleanString(rawPassword);
  const hasWhitespace = clientIdHasWhitespace || clientSecretHasWhitespace || usernameHasWhitespace || passwordHasWhitespace;

  const client_id = cleanString(rawClientId);
  const client_secret = cleanString(rawClientSecret);
  const username = cleanString(rawUsername);
  const password = cleanString(rawPassword);
  store_id = cleanString(store_id);

  const client_id_present = Boolean(client_id);
  const client_secret_present = Boolean(client_secret);
  const username_present = Boolean(username);
  const password_present = Boolean(password);
  const store_id_present = Boolean(store_id);

  const missing_fields: string[] = [];
  if (!client_id_present) missing_fields.push('client_id');
  if (!client_secret_present) missing_fields.push('client_secret');
  if (!username_present) missing_fields.push('username');
  if (!password_present) missing_fields.push('password');

  const audit: PathaoCredentialAudit = {
    provider: 'Pathao',
    row_found,
    client_id_present,
    client_secret_present,
    username_present,
    password_present,
    store_id_present,
    sandbox,
    updated_at,
    credential_source: credentialSource,
    supabase_connected,
    missing_fields,
    whitespace_detected: {
      client_id: clientIdHasWhitespace,
      client_secret: clientSecretHasWhitespace,
      username: usernameHasWhitespace,
      password: passwordHasWhitespace,
      any: hasWhitespace,
    },
  };

  console.log('[Pathao Credential Audit Log]', audit);

  if (missing_fields.length > 0) {
    return { creds: null, audit };
  }

  const creds: PathaoCredentials = {
    provider: 'Pathao',
    source: credentialSource,
    client_id,
    client_secret,
    username,
    password,
    store_id,
    sandbox,
    client_id_length: client_id.length,
    hasWhitespace,
  };

  return { creds, audit };
}

export async function getPathaoCredentials(): Promise<PathaoCredentials | null> {
  const { creds } = await getPathaoCredentialsDetails();
  return creds;
}

export async function getPathaoAccessTokenResult(): Promise<{
  success: boolean;
  token: string | null;
  message: string;
  statusCode?: number;
  audit?: PathaoCredentialAudit;
  rawResponse?: any;
}> {
  const { creds, audit } = await getPathaoCredentialsDetails();
  const baseUrl = getPathaoBaseUrl();
  const tokenEndpoint = `${baseUrl}/aladdin/api/v1/issue-token`;

  if (!creds) {
    const missingStr = audit.missing_fields.join(', ');
    const missingCredsMsg = `Pathao OAuth error: Missing required credentials in ${audit.credential_source} (${missingStr}).`;
    console.error(`[Pathao OAuth] ${missingCredsMsg}`);
    await logDiagnostic('OAUTH_STOPPED', tokenEndpoint, null, { audit }, 400, missingCredsMsg);
    return {
      success: false,
      token: null,
      message: missingCredsMsg,
      statusCode: 400,
      audit,
    };
  }

  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) {
    return {
      success: true,
      token: cachedToken.token,
      message: 'Pathao OAuth token retrieved from cache.',
      statusCode: 200,
    };
  }

  const tokenRequestBody = {
    client_id: creds.client_id,
    client_secret: creds.client_secret,
    username: creds.username,
    password: creds.password,
    grant_type: 'password',
  };

  const maskedRequestBody = {
    client_id: creds.client_id,
    client_secret: '***MASKED***',
    username: creds.username,
    password: '***MASKED***',
    grant_type: 'password',
  };

  console.log(`[Pathao OAuth Request] POST ${tokenEndpoint}`, {
    endpoint: tokenEndpoint,
    sandbox: creds.sandbox,
    client_id: creds.client_id,
    username: creds.username,
    has_client_secret: Boolean(creds.client_secret),
    has_password: Boolean(creds.password),
    store_id: creds.store_id,
  });

  try {
    const res = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(tokenRequestBody),
    });

    const data = await res.json().catch(() => ({}));

    console.log(`[Pathao OAuth Response] HTTP Status: ${res.status} ${res.statusText}`, maskSensitiveFields(data));

    await logDiagnostic(
      res.ok ? 'OAUTH_SUCCESS' : 'OAUTH_ERROR',
      tokenEndpoint,
      maskedRequestBody,
      data,
      res.status,
      res.ok ? null : (data.message || (data.errors ? JSON.stringify(data.errors) : JSON.stringify(data)))
    );

    if (res.ok && data.access_token) {
      cachedToken = {
        token: data.access_token,
        expiresAt: Date.now() + (data.expires_in || 2592000) * 1000,
      };
      return {
        success: true,
        token: data.access_token,
        message: 'Pathao OAuth authenticated successfully',
        statusCode: res.status,
        rawResponse: maskSensitiveFields(data),
      };
    } else {
      // Clear invalid cached token on failure
      cachedToken = null;

      let safeApiMsg = data.message || (data.errors ? (typeof data.errors === 'string' ? data.errors : JSON.stringify(data.errors)) : null) || data.error || `HTTP ${res.status} ${res.statusText}`;

      console.error('[Pathao OAuth Error Details]', {
        status: res.status,
        statusText: res.statusText,
        safeMsg: safeApiMsg,
      });

      return {
        success: false,
        token: null,
        message: `Pathao OAuth failed: HTTP ${res.status} - ${safeApiMsg}`,
        statusCode: res.status,
        rawResponse: maskSensitiveFields(data),
      };
    }
  } catch (err: any) {
    // Clear invalid cached token on network exception
    cachedToken = null;

    const errMessage = err?.message || 'Network error during Pathao OAuth request';
    console.error('[Pathao OAuth Exception]', err);
    await logDiagnostic('OAUTH_EXCEPTION', tokenEndpoint, maskedRequestBody, { error: errMessage }, 500, errMessage);

    return {
      success: false,
      token: null,
      message: `Pathao Connection Error: ${errMessage}`,
      statusCode: 500,
    };
  }
}

export async function getPathaoAccessToken(): Promise<string | null> {
  const result = await getPathaoAccessTokenResult();
  return result.token;
}

export function resolveCodAmount(req: any): {
  isValid: boolean;
  finalAmountToCollect: number;
  originalCodAmountValue: any;
  originalCodAmountType: string;
  originalCodAmountPresent: boolean;
  finalAmountType: string;
  sourceField: string;
  isCodOrder: boolean;
  paymentMethod: string;
  errorReason?: string;
} {
  let paymentMethod = 'COD';
  if (req?.paymentMethod) paymentMethod = String(req.paymentMethod);
  else if (req?.order?.paymentMethod) paymentMethod = String(req.order.paymentMethod);
  else if (req?.payment_method) paymentMethod = String(req.payment_method);

  const normalizedPayment = paymentMethod.trim().toUpperCase();
  const isPrepaid = normalizedPayment === 'BKASH' || normalizedPayment === 'NAGAD' || normalizedPayment === 'CARD' || normalizedPayment === 'PAID';
  const isCodOrder = !isPrepaid;

  // Candidate fields in priority order
  const candidates: { field: string; value: any }[] = [
    { field: 'codAmount', value: req?.codAmount },
    { field: 'amount_to_collect', value: req?.amount_to_collect },
    { field: 'cod_amount', value: req?.cod_amount },
    { field: 'amount', value: req?.amount },
    { field: 'total', value: req?.total },
    { field: 'order.total', value: req?.order?.total },
    { field: 'order.codAmount', value: req?.order?.codAmount },
    { field: 'order.amount_to_collect', value: req?.order?.amount_to_collect },
    { field: 'order.cod_amount', value: req?.order?.cod_amount },
  ];

  let foundValue: any = undefined;
  let sourceField = 'none';
  let originalCodAmountPresent = false;

  for (const cand of candidates) {
    if (cand.value !== undefined && cand.value !== null && cand.value !== '') {
      originalCodAmountPresent = true;
      foundValue = cand.value;
      sourceField = cand.field;
      break;
    }
  }

  const originalCodAmountValue = foundValue;
  const originalCodAmountType = typeof foundValue;

  let parsedNum: number | null = null;

  if (typeof foundValue === 'number') {
    if (!isNaN(foundValue)) {
      parsedNum = foundValue;
    }
  } else if (typeof foundValue === 'string') {
    const cleanStr = foundValue.replace(/[৳\$,\s]/gi, '').replace(/BDT|Tk/gi, '').trim();
    if (cleanStr !== '') {
      const n = Number(cleanStr);
      if (!isNaN(n)) {
        parsedNum = n;
      }
    }
  }

  // Fallback calculation for COD orders if parsedNum is null or 0
  if ((parsedNum === null || parsedNum === 0) && isCodOrder) {
    const subtotal = Number(req?.subtotal ?? req?.order?.subtotal) || 0;
    const shippingFee = Number(req?.shippingFee ?? req?.deliveryFee ?? req?.shipping_fee ?? req?.delivery_fee ?? req?.order?.shippingFee ?? req?.order?.shipping_fee ?? req?.order?.delivery_fee) || 0;
    const discount = Number(req?.discountAmount ?? req?.discount ?? req?.coupon_discount ?? req?.couponDiscount ?? req?.order?.discountAmount ?? req?.order?.discount ?? req?.order?.coupon_discount) || 0;
    const tax = Number(req?.tax ?? req?.order?.tax) || 0;

    if (subtotal > 0) {
      const calculatedTotal = Math.max(0, subtotal + shippingFee + tax - discount);
      if (calculatedTotal > 0) {
        parsedNum = calculatedTotal;
        sourceField = `calculated (subtotal:${subtotal} + shipping:${shippingFee} + tax:${tax} - discount:${discount})`;
      }
    }
  }

  if (isPrepaid) {
    return {
      isValid: true,
      finalAmountToCollect: 0,
      originalCodAmountValue,
      originalCodAmountType,
      originalCodAmountPresent,
      finalAmountType: 'number',
      sourceField: sourceField !== 'none' ? sourceField : 'prepaid_order_default_0',
      isCodOrder: false,
      paymentMethod,
    };
  }

  if (parsedNum === null || isNaN(parsedNum) || parsedNum <= 0) {
    return {
      isValid: false,
      finalAmountToCollect: 0,
      originalCodAmountValue,
      originalCodAmountType,
      originalCodAmountPresent,
      finalAmountType: typeof parsedNum,
      sourceField,
      isCodOrder: true,
      paymentMethod,
      errorReason: `Pathao Shipment Error: Invalid or missing COD collection amount for COD order. Received: ${JSON.stringify(foundValue)} (type: ${originalCodAmountType}, field: ${sourceField}). COD amount must be a positive number.`,
    };
  }

  return {
    isValid: true,
    finalAmountToCollect: Math.round(parsedNum),
    originalCodAmountValue,
    originalCodAmountType,
    originalCodAmountPresent,
    finalAmountType: 'number',
    sourceField,
    isCodOrder: true,
    paymentMethod,
  };
}

export async function createPathaoShipment(req: CourierShipmentRequest): Promise<CourierShipmentResponse> {
  const creds = await getPathaoCredentials();
  const baseUrl = getPathaoBaseUrl();
  const orderEndpoint = `${baseUrl}/aladdin/api/v1/orders`;
  const orderId = String(req.orderId || req.order?.id || 'N/A');

  console.log(`[Pathao Shipment] Starting shipment creation for order #${orderId} via store: ${creds?.store_id}`);

  // Resolve & audit COD amount
  const codRes = resolveCodAmount(req);

  // Safe diagnostic log required by Requirement 7
  const codDiagnostic = {
    orderId,
    originalCodAmountType: codRes.originalCodAmountType,
    originalCodAmountPresent: codRes.originalCodAmountPresent,
    finalAmountToCollect: codRes.finalAmountToCollect,
    finalAmountType: codRes.finalAmountType,
    sourceField: codRes.sourceField,
    paymentMethod: codRes.paymentMethod,
    isCodOrder: codRes.isCodOrder,
  };

  console.log('[Pathao COD Diagnostic]', codDiagnostic);

  // Reject shipment creation if COD order has invalid or missing COD amount
  if (!codRes.isValid) {
    const errorMsg = codRes.errorReason || `Pathao Shipment Error: Invalid COD amount (${codRes.finalAmountToCollect}) for COD order #${orderId}.`;
    console.error(`[Pathao Shipment Error] ${errorMsg}`);
    await logDiagnostic('SHIPMENT_COD_INVALID', orderEndpoint, { orderId, codDiagnostic }, { error: errorMsg }, 400, errorMsg);
    return {
      success: false,
      courierName: 'Pathao Courier',
      trackingNumber: '',
      consignmentId: '',
      status: 'Failed',
      deliveryFee: 0,
      estimatedDeliveryDays: 'N/A',
      message: errorMsg,
      errorDetails: errorMsg,
      isMockFallback: false,
    };
  }

  const token = await getPathaoAccessToken();

  if (!token) {
    const errMsg = 'Pathao OAuth authentication failed: Unable to obtain access token due to missing or invalid credentials.';
    console.error(`[Pathao Shipment Error] ${errMsg}`);
    await logDiagnostic('SHIPMENT_AUTH_ERROR', orderEndpoint, { orderId }, { error: errMsg }, 401, errMsg);
    return {
      success: false,
      courierName: 'Pathao Courier',
      trackingNumber: '',
      consignmentId: '',
      status: 'Failed',
      deliveryFee: 0,
      estimatedDeliveryDays: 'N/A',
      message: errMsg,
      errorDetails: errMsg,
      isMockFallback: false,
    };
  }

  const recipientName = req.recipientName || req.order?.shippingAddress?.fullName || 'Customer';
  const recipientPhone = req.recipientPhone || req.order?.shippingAddress?.phone || '01700000000';
  const rawAddress = req.address || req.order?.shippingAddress?.fullAddress || 'Dhaka';
  const thana = req.thana || req.order?.shippingAddress?.thana || '';
  const district = req.district || req.order?.shippingAddress?.district || 'Dhaka';

  const payload = {
    store_id: creds?.store_id || 'pth_store_dhanmondi_01',
    merchant_order_id: orderId,
    recipient_name: recipientName,
    recipient_phone: recipientPhone,
    recipient_address: `${rawAddress}, ${thana}, ${district}`.replace(/,\s*,/g, ',').replace(/^,\s*|\s*,\s*$/g, ''),
    recipient_city: district.toLowerCase().includes('dhaka') ? 1 : 2,
    recipient_zone: 1,
    delivery_type: district.toLowerCase().includes('dhaka') ? 48 : 12,
    item_type: 2,
    special_instruction: req.specialInstruction || req.order?.shippingAddress?.notes || 'Handle with care - E-commerce order',
    item_quantity: 1,
    item_weight: req.itemWeightKg || 0.5,
    amount_to_collect: codRes.finalAmountToCollect,
  };

  console.log('[Pathao Shipment Request Body] POST', orderEndpoint, payload);

  try {
    const res = await fetch(orderEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    // Verify whether Pathao accepted/returned the COD amount
    const pathaoReturnedCod = data?.data?.amount_to_collect ?? data?.amount_to_collect ?? data?.data?.collectable_amount ?? null;
    const codAccepted = pathaoReturnedCod !== null ? Number(pathaoReturnedCod) === codRes.finalAmountToCollect : res.ok;

    console.log('[Pathao Shipment Response]', {
      status: res.status,
      ok: res.ok,
      sent_amount_to_collect: codRes.finalAmountToCollect,
      pathao_returned_cod: pathaoReturnedCod,
      cod_accepted: codAccepted,
      data,
    });

    const isSuccess = res.ok && (data.code === 200 || data.code === '200' || data.status === 'success' || data.data?.consignment_id);

    if (isSuccess && data.data) {
      const consignmentId = data.data.consignment_id || `PTH-C-${Math.floor(100000 + Math.random() * 900000)}`;
      const trackingNumber = data.data.tracking_code || consignmentId;

      await logDiagnostic('SHIPMENT_SUCCESS', orderEndpoint, payload, { ...data, cod_audit: codDiagnostic, cod_accepted: codAccepted }, res.status, null);

      return {
        success: true,
        courierName: 'Pathao Courier',
        trackingNumber,
        consignmentId,
        status: data.data.order_status || 'Pending Pickup',
        deliveryFee: district.toLowerCase().includes('dhaka') ? 60 : 120,
        estimatedDeliveryDays: district.toLowerCase().includes('dhaka') ? 'Express Same Day' : '2-3 Days',
        message: `✅ Consignment successfully created in Pathao merchant panel! Tracking #: ${trackingNumber} (COD Collection: ৳${codRes.finalAmountToCollect})`,
        rawResponse: data,
        isMockFallback: false,
      };
    } else {
      const exactError = data.message || (data.errors ? (typeof data.errors === 'string' ? data.errors : JSON.stringify(data.errors)) : null) || JSON.stringify(data) || `Pathao API error HTTP ${res.status}`;
      console.error(`[Pathao API Error] ${exactError}`);

      await logDiagnostic('SHIPMENT_API_ERROR', orderEndpoint, payload, { ...data, cod_audit: codDiagnostic }, res.status, exactError);

      return {
        success: false,
        courierName: 'Pathao Courier',
        trackingNumber: '',
        consignmentId: '',
        status: 'Failed',
        deliveryFee: 0,
        estimatedDeliveryDays: 'N/A',
        message: `Pathao API Error: ${exactError}`,
        errorDetails: exactError,
        isMockFallback: false,
      };
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Network connection timeout to Pathao API';
    console.error('[Pathao Shipment Exception]', error);

    await logDiagnostic('SHIPMENT_EXCEPTION', orderEndpoint, payload, { error: errorMsg, cod_audit: codDiagnostic }, 500, errorMsg);

    return {
      success: false,
      courierName: 'Pathao Courier',
      trackingNumber: '',
      consignmentId: '',
      status: 'Failed',
      deliveryFee: 0,
      estimatedDeliveryDays: 'N/A',
      message: `Pathao Connection Error: ${errorMsg}`,
      errorDetails: errorMsg,
      isMockFallback: false,
    };
  }
}

export async function getPathaoTracking(trackingCode: string): Promise<CourierTrackingResponse> {
  const token = await getPathaoAccessToken();
  const baseUrl = getPathaoBaseUrl();
  const trackingEndpoint = `${baseUrl}/aladdin/api/v1/orders/${encodeURIComponent(trackingCode)}/info`;
  const now = new Date().toISOString();

  if (token) {
    try {
      const res = await fetch(trackingEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.data) {
          const rawStatus = data.data.order_status || 'In_Transit';
          return {
            success: true,
            courierName: 'Pathao Courier',
            trackingNumber: trackingCode,
            currentStatus: rawStatus,
            rawCourierStatus: rawStatus,
            riderName: data.data.rider_name || 'Pathao Assigned Rider',
            riderPhone: data.data.rider_phone || '+880 1812-334455',
            location: 'Pathao Hub, Dhaka',
            updatedAt: now,
            events: [
              { timestamp: now, status: rawStatus, description: `Pathao Status: ${rawStatus}`, location: 'Pathao Hub' },
            ],
          };
        }
      }
    } catch (e) {
      console.error('[Pathao Tracking Error]', e);
    }
  }

  return {
    success: true,
    courierName: 'Pathao Courier',
    trackingNumber: trackingCode,
    currentStatus: 'Pending Pickup',
    rawCourierStatus: 'Pending',
    riderName: 'Assigned Rider',
    riderPhone: '+880 1812-000000',
    location: 'Merchant Warehouse',
    updatedAt: now,
    events: [
      { timestamp: now, status: 'Registered', description: 'Order consignment registered for Pathao delivery', location: 'Warehouse' },
    ],
  };
}

export async function testPathaoConnection(): Promise<{
  success: boolean;
  message: string;
  baseUrl: string;
  tokenEndpoint: string;
  httpStatus: number;
  audit: PathaoCredentialAudit;
  rawResponse?: any;
}> {
  const baseUrl = getPathaoBaseUrl();
  const tokenEndpoint = `${baseUrl}/aladdin/api/v1/issue-token`;
  const { audit } = await getPathaoCredentialsDetails();
  const result = await getPathaoAccessTokenResult();

  if (result.success) {
    return {
      success: true,
      message: '✅ Pathao OAuth authenticated successfully',
      baseUrl,
      tokenEndpoint,
      httpStatus: result.statusCode || 200,
      audit: result.audit || audit,
      rawResponse: result.rawResponse,
    };
  } else {
    return {
      success: false,
      message: `❌ ${result.message}`,
      baseUrl,
      tokenEndpoint,
      httpStatus: result.statusCode || 400,
      audit: result.audit || audit,
      rawResponse: result.rawResponse,
    };
  }
}

