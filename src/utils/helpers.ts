export function formatPrice(amount: number): string {
  const val = typeof amount === 'number' ? amount : (Number(amount) || 0);
  return `৳${val.toLocaleString('en-IN')}`;
}

export function formatPriceBn(amount: number): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const val = typeof amount === 'number' ? amount : (Number(amount) || 0);
  const formatted = val.toLocaleString('en-IN');
  return `৳${formatted.replace(/\d/g, (d) => bnDigits[parseInt(d)])}`;
}

export function getDeliveryFee(division: string): number {
  if (division.toLowerCase().includes('dhaka')) {
    return 60;
  }
  return 120;
}

export function generateOrderId(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `GDB-${randomNum}`;
}

export function generateTrackingNumber(courier: string): string {
  const prefix = courier.includes('Steadfast')
    ? 'STF'
    : 'PTH';
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-BD-${random}`;
}

export const BANGLADESH_DIVISIONS = [
  'Dhaka',
  'Chittagong',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Sylhet',
  'Rangpur',
  'Mymensingh',
];

export const POPULAR_DISTRICTS: Record<string, string[]> = {
  Dhaka: ['Dhaka', 'Gazipur', 'Narayanganj', 'Tangail', 'Faridpur', 'Manikganj'],
  Chittagong: ['Chittagong', 'Cox’s Bazar', 'Comilla', 'Feni', 'Noakhali', 'Brahmanbaria'],
  Rajshahi: ['Rajshahi', 'Bogra', 'Pabna', 'Naogaon', 'Natore'],
  Khulna: ['Khulna', 'Jessore', 'Kushtia', 'Satkhira'],
  Barisal: ['Barisal', 'Bhola', 'Patuakhali'],
  Sylhet: ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
  Rangpur: ['Rangpur', 'Dinajpur', 'Gaibandha'],
  Mymensingh: ['Mymensingh', 'Jamalpur', 'Netrokona'],
};
