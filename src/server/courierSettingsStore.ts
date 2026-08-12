export interface CourierSettingsRecord {
  id?: string;
  provider: string;
  client_id?: string;
  client_secret?: string;
  username?: string;
  password?: string;
  store_id?: string;
  sandbox?: boolean;
  is_active?: boolean;
  updated_at?: string;
}

const store = new Map<string, CourierSettingsRecord>();

export function getStoredCourierSettings(provider: string): CourierSettingsRecord | undefined {
  const canonical = (provider || '').trim().toLowerCase() === 'pathao'
    ? 'Pathao'
    : (provider || '').trim().toLowerCase() === 'steadfast'
    ? 'Steadfast'
    : provider;
  return store.get(canonical);
}

export function setStoredCourierSettings(provider: string, record: CourierSettingsRecord): void {
  const canonical = (provider || '').trim().toLowerCase() === 'pathao'
    ? 'Pathao'
    : (provider || '').trim().toLowerCase() === 'steadfast'
    ? 'Steadfast'
    : provider;
  store.set(canonical, { ...record, provider: canonical });
}

export function getAllStoredCourierSettings(): CourierSettingsRecord[] {
  return Array.from(store.values());
}
