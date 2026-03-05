import { useEffect, useMemo, useState } from 'react';
import { inventoryService } from '../services';
import type { InventoryItem } from '../services';

const LOW_STOCK_THRESHOLD = 5;

function Dashboard() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await inventoryService.getAll();
        setItems(data);
      } catch (err) {
        setError((err as Error).message ?? 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const totalProducts = items.length;
  const lowStockCount = useMemo(
    () => items.filter((item) => item.quantity <= LOW_STOCK_THRESHOLD).length,
    [items],
  );
  const uniqueCategories = useMemo(
    () =>
      Array.from(
        new Set(
          items
            .map((item) => item.category?.trim())
            .filter((c): c is string => Boolean(c && c.length > 0)),
        ),
      ),
    [items],
  );

  return (
    <div className="container mt-4">
      <h1 className="h3 mb-1">Dashboard</h1>
      <p className="text-muted mb-3">Overview of your inventory.</p>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <div className="row g-3 mt-2">
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Total Products</h5>
                <p className="display-6 mb-0">{totalProducts}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Low Stock (≤ {LOW_STOCK_THRESHOLD})</h5>
                <p className="display-6 mb-0">{lowStockCount}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Categories</h5>
                <p className="display-6 mb-1">{uniqueCategories.length}</p>
                <p className="card-text text-muted mb-0">
                  {uniqueCategories.length > 0
                    ? uniqueCategories.join(', ')
                    : 'No categories yet'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
