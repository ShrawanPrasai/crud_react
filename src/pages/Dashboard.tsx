function Dashboard() {
  return (
    <div className="container mt-4">
      <h1>Dashboard</h1>
      <p className="lead">Overview of your inventory.</p>
      <div className="row g-3 mt-2">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Products</h5>
              <p className="card-text text-muted">—</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Low Stock</h5>
              <p className="card-text text-muted">—</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Categories</h5>
              <p className="card-text text-muted">—</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
