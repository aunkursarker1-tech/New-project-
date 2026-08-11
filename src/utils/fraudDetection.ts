import { Order, BlacklistItem, WhitelistItem, RiskLevel, FraudStatus, FraudAnalytics } from '../types';

// Common disposable email domains
const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com',
  'mailinator.com',
  'guerrillamail.com',
  '10minutemail.com',
  'trashmail.com',
  'yopmail.com',
  'dispostable.com',
  'sharklasers.com',
  'getnada.com',
  'temp-mail.org',
  'fakeinbox.com',
  'mohmal.com',
  'crazymailing.com',
];

// Initial seed blacklists for realistic demonstration
export const INITIAL_BLACKLISTS: BlacklistItem[] = [
  {
    id: 'blk-1',
    type: 'phone',
    value: '01911998877',
    reason: 'Multiple returned COD parcels and fake recipient names in Mirpur',
    addedAt: '2026-07-15T11:20:00Z',
    addedBy: 'Admin',
    matchedCount: 5,
  },
  {
    id: 'blk-2',
    type: 'phone',
    value: '01855443322',
    reason: 'Refused delivery at doorstep 3 times consecutively via Courier',
    addedAt: '2026-07-20T14:45:00Z',
    addedBy: 'Fraud System',
    matchedCount: 3,
  },
  {
    id: 'blk-3',
    type: 'email',
    value: 'fakeuser99@tempmail.com',
    reason: 'Disposable domain used for fake promotional coupon claims',
    addedAt: '2026-07-28T09:10:00Z',
    addedBy: 'Admin',
    matchedCount: 2,
  },
  {
    id: 'blk-4',
    type: 'address',
    value: 'Abandoned House 4, Unknown Block, Savar',
    reason: 'Known address scam location where couriers are intimidated',
    addedAt: '2026-06-10T16:30:00Z',
    addedBy: 'Pathao Courier Alert',
    matchedCount: 1,
  },
  {
    id: 'blk-5',
    type: 'ip',
    value: '103.112.44.18',
    reason: 'Automated bot ordering flood from overseas proxy server',
    addedAt: '2026-08-01T02:15:00Z',
    addedBy: 'System Firewall',
    matchedCount: 8,
  },
];

// Initial seed whitelists
export const INITIAL_WHITELISTS: WhitelistItem[] = [
  {
    id: 'wht-1',
    type: 'phone',
    value: '01712345678',
    note: 'VIP Loyal Customer - Over ৳50,000 total lifetime tech purchases',
    addedAt: '2026-05-01T10:00:00Z',
  },
  {
    id: 'wht-2',
    type: 'email',
    value: 'arafat.bd@gmail.com',
    note: 'Verified corporate tech buyer - Dhanmondi area',
    addedAt: '2026-05-15T12:00:00Z',
  },
];

export interface FraudEvaluationResult {
  score: number; // 0 to 100
  riskLevel: RiskLevel;
  reasons: string[];
  recommendation: string;
  isWhitelisted: boolean;
  isBlacklisted: boolean;
  deliverySuccessRate: number; // percentage e.g. 100%
  pastOrderCount: number;
}

/**
 * Validates Bangladeshi mobile phone numbers (11 digits starting with 013-019)
 */
export function isValidBDPhone(phone: string): boolean {
  if (!phone) return false;
  const clean = phone.replace(/[^0-9]/g, '');
  const digits = clean.startsWith('880') ? clean.slice(2) : clean;
  return /^01[3-9]\d{8}$/.test(digits);
}

/**
 * Checks if an email uses a known disposable or temporary email service
 */
export function isDisposableEmail(email?: string): boolean {
  if (!email || !email.includes('@')) return false;
  const domain = email.split('@')[1]?.toLowerCase().trim();
  return DISPOSABLE_EMAIL_DOMAINS.includes(domain);
}

/**
 * Calculates customer delivery success rate based on past order history
 */
export function getCustomerDeliveryHistory(
  phone: string,
  allOrders: Order[]
): { successRate: number; totalOrders: number; deliveredCount: number; cancelledCount: number } {
  if (!phone) return { successRate: 100, totalOrders: 0, deliveredCount: 0, cancelledCount: 0 };

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const pastOrders = allOrders.filter((o) => o.shippingAddress.phone.replace(/[^0-9]/g, '') === cleanPhone);

  if (pastOrders.length === 0) {
    return { successRate: 100, totalOrders: 0, deliveredCount: 0, cancelledCount: 0 };
  }

  const deliveredCount = pastOrders.filter((o) => o.status === 'Delivered' || o.status === 'Shipped').length;
  const cancelledCount = pastOrders.filter((o) => o.status === 'Cancelled').length;
  const totalOrders = pastOrders.length;

  const successRate = totalOrders > 0 ? Math.round((deliveredCount / totalOrders) * 100) : 100;

  return { successRate, totalOrders, deliveredCount, cancelledCount };
}

/**
 * Core Engine: Evaluates an order and returns comprehensive Fraud Risk analysis
 */
export function evaluateOrderFraudRisk(
  order: Partial<Order>,
  allOrders: Order[] = [],
  blacklists: BlacklistItem[] = INITIAL_BLACKLISTS,
  whitelists: WhitelistItem[] = INITIAL_WHITELISTS
): FraudEvaluationResult {
  let score = 0;
  const reasons: string[] = [];
  let isWhitelisted = false;
  let isBlacklisted = false;

  const address = order.shippingAddress;
  const phone = address?.phone || '';
  const email = address?.email || '';
  const fullAddr = address?.fullAddress || '';
  const ip = order.customerIp || '103.112.44.18';

  const cleanPhone = phone.replace(/[^0-9]/g, '');

  // 1. Whitelist Check
  const phoneWhitelisted = whitelists.some((w) => w.type === 'phone' && w.value.replace(/[^0-9]/g, '') === cleanPhone);
  const emailWhitelisted = email && whitelists.some((w) => w.type === 'email' && w.value.toLowerCase() === email.toLowerCase());

  if (phoneWhitelisted || emailWhitelisted) {
    isWhitelisted = true;
    reasons.push('Verified Trusted Customer: Listed on Store Whitelist');
  }

  // 2. Blacklist Check
  const phoneBlacklisted = blacklists.some((b) => b.type === 'phone' && b.value.replace(/[^0-9]/g, '') === cleanPhone);
  const emailBlacklisted = email && blacklists.some((b) => b.type === 'email' && b.value.toLowerCase() === email.toLowerCase());
  const addressBlacklisted = fullAddr && blacklists.some((b) => b.type === 'address' && fullAddr.toLowerCase().includes(b.value.toLowerCase()));
  const ipBlacklisted = blacklists.some((b) => b.type === 'ip' && b.value === ip);

  if (phoneBlacklisted) {
    isBlacklisted = true;
    score += 100;
    reasons.push('🚨 CRITICAL: Phone number matches known Blacklisted fraud record');
  }

  if (emailBlacklisted) {
    isBlacklisted = true;
    score += 100;
    reasons.push('🚨 CRITICAL: Email address is explicitly Blacklisted');
  }

  if (addressBlacklisted) {
    isBlacklisted = true;
    score += 85;
    reasons.push('🚨 High Risk: Delivery address matches a blacklisted high-fraud location');
  }

  if (ipBlacklisted) {
    isBlacklisted = true;
    score += 90;
    reasons.push('🚨 High Risk: IP address matched blacklisted suspicious network pool');
  }

  // If Whitelisted and not explicitly blacklisted, give drastic risk discount
  if (isWhitelisted && !isBlacklisted) {
    score = 5;
    return {
      score,
      riskLevel: 'Low Risk',
      reasons,
      recommendation: '✅ Safe: Whitelisted trusted customer. Auto-approved.',
      isWhitelisted,
      isBlacklisted,
      deliverySuccessRate: 100,
      pastOrderCount: 5,
    };
  }

  // 3. Phone Format Check
  if (!isValidBDPhone(phone)) {
    score += 35;
    reasons.push('Invalid phone format: Must be an 11-digit Bangladeshi number (013-019)');
  }

  // 4. Disposable Email Check
  if (isDisposableEmail(email)) {
    score += 40;
    reasons.push('Disposable Email: Temporary or fake email domain detected');
  }

  // 5. Customer History & Past Delivery Success
  const history = getCustomerDeliveryHistory(phone, allOrders);
  if (history.totalOrders > 0) {
    if (history.cancelledCount > 1 || history.successRate < 60) {
      score += 35;
      reasons.push(`Low Delivery Success Rate: ${history.successRate}% (${history.cancelledCount} past cancelled orders)`);
    }
  } else {
    // First time customer
    if ((order.total || 0) > 15000) {
      score += 25;
      reasons.push('High-Value First Order: Total exceeds ৳15,000 from new unverified customer');
    }
  }

  // 6. Payment Method Risk
  if (order.paymentMethod === 'COD') {
    if ((order.total || 0) > 20000) {
      score += 20;
      reasons.push('High COD Amount: Unverified Cash on Delivery exceeding ৳20,000');
    }
  }

  // 7. Duplicate Order / Velocity Checks
  const otherOrdersSamePhoneDifferentName = allOrders.filter(
    (o) =>
      o.id !== order.id &&
      o.shippingAddress.phone.replace(/[^0-9]/g, '') === cleanPhone &&
      o.shippingAddress.fullName.toLowerCase() !== (address?.fullName || '').toLowerCase()
  );

  if (otherOrdersSamePhoneDifferentName.length > 0) {
    score += 30;
    reasons.push(`Duplicate Phone: Same phone number used by ${otherOrdersSamePhoneDifferentName.length} different customer names`);
  }

  // 8. Address Quality Check
  if (fullAddr.trim().length < 10) {
    score += 25;
    reasons.push('Incomplete Address: Street address is too short (< 10 chars)');
  } else if (/^(.)\1{4,}/.test(fullAddr) || /test|asdf|qwerty|1234/i.test(fullAddr)) {
    score += 30;
    reasons.push('Suspicious Address: Street address contains repetitive or dummy characters');
  }

  // Caps score between 0 and 100
  const finalScore = Math.min(100, Math.max(0, score));

  // Determine Risk Level
  let riskLevel: RiskLevel = 'Low Risk';
  let recommendation = '✅ Safe: Low fraud probability. Process automatically.';

  if (finalScore >= 70) {
    riskLevel = 'High Risk';
    recommendation = '🚨 HOLD ORDER: High fraud probability! Require ৳200 bKash advance deposit or phone approval.';
  } else if (finalScore >= 30) {
    riskLevel = 'Medium Risk';
    recommendation = '⚠️ MANUAL REVIEW: Call customer to confirm mobile phone & delivery address before dispatch.';
  }

  if (reasons.length === 0) {
    reasons.push('All automated risk validation checks passed cleanly');
  }

  return {
    score: finalScore,
    riskLevel,
    reasons,
    recommendation,
    isWhitelisted,
    isBlacklisted,
    deliverySuccessRate: history.successRate,
    pastOrderCount: history.totalOrders,
  };
}

/**
 * Pre-populates orders with fraud risk evaluation if missing
 */
export function populateOrdersWithFraudRisk(
  orders: Order[],
  blacklists: BlacklistItem[] = INITIAL_BLACKLISTS,
  whitelists: WhitelistItem[] = INITIAL_WHITELISTS
): Order[] {
  return orders.map((ord) => {
    if (ord.fraudScore !== undefined && ord.riskLevel) {
      return ord;
    }

    const evalResult = evaluateOrderFraudRisk(ord, orders, blacklists, whitelists);

    let defaultFraudStatus: FraudStatus = 'Pending Review';
    if (evalResult.riskLevel === 'Low Risk') defaultFraudStatus = 'Approved';
    if (evalResult.riskLevel === 'High Risk') defaultFraudStatus = 'Held';

    return {
      ...ord,
      fraudScore: evalResult.score,
      riskLevel: evalResult.riskLevel,
      riskReasons: evalResult.reasons,
      fraudStatus: defaultFraudStatus,
      previousDeliverySuccessRate: evalResult.deliverySuccessRate,
      pastOrderCount: evalResult.pastOrderCount,
      customerIp: ord.customerIp || '103.112.44.18',
    };
  });
}
