import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../services';

function AddProduct() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !sku.trim()) {
      setError('Name and SKU are required.');
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      await inventoryService.create({
        name: name.trim(),
        sku: sku.trim(),
        quantity: Number.isNaN(quantity) ? 0 : quantity,
        price: Number.isNaN(price) ? 0 : price,
        category: category.trim() || undefined,
      });
      navigate('/products');
    } catch (err) {
      setError((err as Error).message ?? 'Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 640 }}>
      <h1 className="h3 mb-3">Add Product</h1>
      <p className="text-muted">
        Fill in the details below to add a new product to your inventory.
      </p>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name<span className="text-danger">*</span>
          </label>
          <input
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Wireless Mouse"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="sku" className="form-label">
            SKU<span className="text-danger">*</span>
          </label>
          <input
            id="sku"
            className="form-control"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="e.g. WM-001"
            required
          />
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="quantity" className="form-label">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min={0}
                className="form-control"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="price" className="form-label">
                Price
              </label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  id="price"
                  type="number"
                  min={0}
                  step="0.01"
                  className="form-control"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <input
            id="category"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Accessories"
          />
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate('/products')}
            disabled={submitting}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
