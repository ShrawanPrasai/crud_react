// Inventory CRUD API service
// Replace with your actual API base URL
const API_BASE = '/api/inventory';

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

export const inventoryService = {
  async getAll(): Promise<InventoryItem[]> {
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error('Failed to fetch inventory');
    return response.json();
  },

  async getById(id: string): Promise<InventoryItem> {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch item');
    return response.json();
  },

  async create(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to create item');
    return response.json();
  },

  async update(id: string, item: Partial<InventoryItem>): Promise<InventoryItem> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to update item');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete item');
  },
};
