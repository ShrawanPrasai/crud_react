// Inventory CRUD service backed by localStorage so the app
// is fully deployable without a separate backend API.

const STORAGE_KEY = 'inventory_items';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

function readAll(): InventoryItem[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as InventoryItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeAll(items: InventoryItem[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function generateId(): string {
  // Use crypto.randomUUID when available, otherwise fall back
  // to a simple random string.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export const inventoryService = {
  async getAll(): Promise<InventoryItem[]> {
    return readAll();
  },

  async getById(id: string): Promise<InventoryItem> {
    const items = readAll();
    const item = items.find((i) => i.id === id);
    if (!item) {
      throw new Error('Item not found');
    }
    return item;
  },

  async create(
    item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<InventoryItem> {
    const items = readAll();
    const now = new Date().toISOString();
    const newItem: InventoryItem = {
      ...item,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    const next = [...items, newItem];
    writeAll(next);
    return newItem;
  },

  async update(
    id: string,
    partial: Partial<Omit<InventoryItem, 'id' | 'createdAt'>>,
  ): Promise<InventoryItem> {
    const items = readAll();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new Error('Item not found');
    }
    const now = new Date().toISOString();
    const updated: InventoryItem = {
      ...items[index],
      ...partial,
      id,
      updatedAt: now,
    };
    const next = [...items];
    next[index] = updated;
    writeAll(next);
    return updated;
  },

  async delete(id: string): Promise<void> {
    const items = readAll();
    const next = items.filter((i) => i.id !== id);
    writeAll(next);
  },
};
