import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSave, FiX, FiUpload } from 'react-icons/fi';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    brand: '',
    unit: '',
    purchasePrice: '',
    sellingPrice: '',
    quantity: '',
    alertQuantity: '',
    tax: '',
    description: '',
    image: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send data to the server
    console.log('Form submitted:', formData);
    alert('Product added successfully!');
    navigate('/products');
  };

  return (
    <div className="add-product-page">
      {/* Page Header */}
      <div className="page-header">
        <h4>Add Product</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <span>Add Product</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Product Information */}
          <div className="col-12 col-lg-8">
            <div className="form-card">
              <h5 className="mb-4">Product Information</h5>
              
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Product Name *</label>
                    <input 
                      type="text" 
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>SKU *</label>
                    <input 
                      type="text" 
                      className="form-control"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      placeholder="Enter SKU"
                      required
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Category *</label>
                    <select 
                      className="form-select"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="electronics">Electronics</option>
                      <option value="laptops">Laptops</option>
                      <option value="audio">Audio</option>
                      <option value="accessories">Accessories</option>
                      <option value="wearables">Wearables</option>
                    </select>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Brand</label>
                    <select 
                      className="form-select"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                    >
                      <option value="">Select Brand</option>
                      <option value="apple">Apple</option>
                      <option value="samsung">Samsung</option>
                      <option value="sony">Sony</option>
                      <option value="dell">Dell</option>
                      <option value="logitech">Logitech</option>
                    </select>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Unit</label>
                    <select 
                      className="form-select"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                    >
                      <option value="">Select Unit</option>
                      <option value="piece">Piece</option>
                      <option value="box">Box</option>
                      <option value="kg">Kilogram</option>
                      <option value="liter">Liter</option>
                    </select>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Tax (%)</label>
                    <input 
                      type="number" 
                      className="form-control"
                      name="tax"
                      value={formData.tax}
                      onChange={handleChange}
                      placeholder="Enter tax percentage"
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group mb-0">
                    <label>Description</label>
                    <textarea 
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Enter product description"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="form-card mt-4">
              <h5 className="mb-4">Pricing & Stock</h5>
              
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Purchase Price *</label>
                    <input 
                      type="number" 
                      className="form-control"
                      name="purchasePrice"
                      value={formData.purchasePrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Selling Price *</label>
                    <input 
                      type="number" 
                      className="form-control"
                      name="sellingPrice"
                      value={formData.sellingPrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Quantity *</label>
                    <input 
                      type="number" 
                      className="form-control"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Alert Quantity</label>
                    <input 
                      type="number" 
                      className="form-control"
                      name="alertQuantity"
                      value={formData.alertQuantity}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Image */}
          <div className="col-12 col-lg-4">
            <div className="form-card">
              <h5 className="mb-4">Product Image</h5>
              
              <div 
                className="upload-area p-4 mb-2"
                style={{ 
                  border: '2px dashed #ddd', 
                  borderRadius: '12px',
                  background: '#f8f9fa',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <FiUpload size={48} color="#888" />
                <p className="mt-2 mb-2" style={{ color: '#555' }}>
                  Drag and drop image here
                </p>
                <p className="text-muted small mb-2">or</p>
                <label className="btn btn-outline-primary btn-sm">
                  Browse Files
                  <input 
                    type="file" 
                    hidden 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setFormData(prev => ({ ...prev, image: file }));
                    }}
                  />
                </label>
              </div>
              
              <p className="text-muted small">
                Allowed formats: JPG, PNG, GIF. Max size: 2MB
              </p>
            </div>

            {/* Actions */}
            <div className="form-card mt-4">
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary-custom d-flex align-items-center justify-content-center">
                  <FiSave className="me-2" /> Save Product
                </button>
                <Link to="/products" className="btn btn-secondary-custom d-flex align-items-center justify-content-center">
                  <FiX className="me-2" /> Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
