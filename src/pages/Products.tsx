import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { inventoryService } from '../services';
import type { InventoryItem } from '../services';

interface EditableRow extends InventoryItem {
  isEditing?: boolean;
}

function Products() {
  const [items, setItems] = useState<EditableRow[]>([]);
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
        setError((err as Error).message ?? 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    try {
      await inventoryService.delete(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError((err as Error).message ?? 'Failed to delete product');
    }
  };

  const startEdit = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isEditing: true } : item)),
    );
  };

  const cancelEdit = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isEditing: false } : item)),
    );
  };

  const handleFieldChange = <K extends keyof InventoryItem>(
    id: string,
    field: K,
    value: InventoryItem[K],
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === 'quantity' || field === 'price'
                  ? Number(value)
                  : value,
            }
          : item,
      ),
    );
  };

  const saveEdit = async (id: string) => {
    const current = items.find((i) => i.id === id);
    if (!current) return;
    try {
      const { isEditing, ...payload } = current;
      const updated = await inventoryService.update(id, payload);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...updated, isEditing: false } : item)),
      );
    } catch (err) {
      setError((err as Error).message ?? 'Failed to update product');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1 className="h3 mb-1">Products</h1>
          <p className="text-muted mb-0">Manage your product inventory.</p>
        </div>
        <Link to="/add-product" className="btn btn-primary">
          + Add Product
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : items.length === 0 ? (
        <div className="alert alert-info">
          No products yet. Click <strong>Add Product</strong> to create your first one.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th className="text-end">Quantity</th>
                <th className="text-end">Price</th>
                <th>Category</th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.isEditing ? (
                      <input
                        className="form-control form-control-sm"
                        value={item.name}
                        onChange={(e) =>
                          handleFieldChange(item.id, 'name', e.target.value)
                        }
                      />
                    ) : (
                      item.name
                    )}
                  </td>
                  <td>
                    {item.isEditing ? (
                      <input
                        className="form-control form-control-sm"
                        value={item.sku}
                        onChange={(e) =>
                          handleFieldChange(item.id, 'sku', e.target.value)
                        }
                      />
                    ) : (
                      item.sku
                    )}
                  </td>
                  <td className="text-end">
                    {item.isEditing ? (
                      <input
                        type="number"
                        min={0}
                        className="form-control form-control-sm text-end"
                        value={item.quantity}
                        onChange={(e) =>
                          handleFieldChange(
                            item.id,
                            'quantity',
                            Number(e.target.value),
                          )
                        }
                      />
                    ) : (
                      item.quantity
                    )}
                  </td>
                  <td className="text-end">
                    {item.isEditing ? (
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        className="form-control form-control-sm text-end"
                        value={item.price}
                        onChange={(e) =>
                          handleFieldChange(
                            item.id,
                            'price',
                            Number(e.target.value),
                          )
                        }
                      />
                    ) : (
                      <>${item.price.toFixed(2)}</>
                    )}
                  </td>
                  <td>
                    {item.isEditing ? (
                      <input
                        className="form-control form-control-sm"
                        value={item.category ?? ''}
                        onChange={(e) =>
                          handleFieldChange(item.id, 'category', e.target.value)
                        }
                      />
                    ) : (
                      item.category ?? '—'
                    )}
                  </td>
                  <td>
                    {item.isEditing ? (
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={() => void saveEdit(item.id)}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => cancelEdit(item.id)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={() => startEdit(item.id)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => void handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Products;
