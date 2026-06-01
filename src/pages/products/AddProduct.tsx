import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX, FiUpload } from 'react-icons/fi';
import { useToast } from '@/components/common/Toast';
import { getBrands } from '../../services/brandService';
import * as categoryService from '../../services/categoryService';
import * as productService from '../../services/productService';

const AddProduct = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { id } = useParams();
  const isEdit = !!id;
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [brands, setBrands] = useState<Array<{id:number;name:string}>>([]);
  const [categories, setCategories] = useState<Array<{id:number;name:string}>>([]);
  const [loadingProduct, setLoadingProduct] = useState(isEdit);

  // Fetch product from API on edit
  useEffect(() => {
    if (!isEdit) return;
    setLoadingProduct(true);
    productService.getProduct(Number(id))
      .then(res => {
        const p = res.data.data;
        setFormData(prev => ({
          ...prev,
          name: p.name || '',
          sku: p.sku || '',
          category: String(p.category_id || ''),
          brand: String(p.brand_id || ''),
          unit: p.unit || '',
          purchasePrice: p.purchase_price?.toString() || '',
          sellingPrice: p.selling_price?.toString() || '',
          quantity: p.quantity?.toString() || '',
          alertQuantity: p.alert_quantity?.toString() || '',
          tax: p.tax?.toString() || '',
          description: p.description || '',
        }));
        if (p.image) setImagePreview(p.image);
      })
      .catch(() => showToast({ type: 'error', title: 'Error', message: 'Failed to load product!' }))
      .finally(() => setLoadingProduct(false));
  }, []);

  useEffect(() => {
    getBrands().then(r => setBrands(r.data.data)).catch(() => {});
    categoryService.getCategories().then(r => setCategories(r.data.data)).catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('sku', formData.sku);
    // backend expects `category` and `brand` fields (IDs), include both variants for compatibility
    payload.append('category_id', formData.category);
    payload.append('brand_id', formData.brand);
    payload.append('unit', formData.unit);
    payload.append('purchase_price', formData.purchasePrice);
    payload.append('selling_price', formData.sellingPrice);
    payload.append('quantity', formData.quantity);
    payload.append('alert_quantity', formData.alertQuantity);
    payload.append('tax', formData.tax);
    payload.append('description', formData.description);
    if (formData.image) payload.append('image', formData.image);

    if (isEdit && id) {
      productService.updateProduct(Number(id), payload)
        .then(() => {
          showToast({ type: 'success', title: 'Success', message: 'Product updated successfully!' });
          navigate('/products');
        })
        .catch(() => showToast({ type: 'error', title: 'Error', message: 'Update failed!' }));
    } else {
      productService.createProduct(payload)
        .then(() => {
          showToast({ type: 'success', title: 'Success', message: 'Product added successfully!' });
          navigate('/products');
        })
        .catch(() => showToast({ type: 'error', title: 'Error', message: 'Create failed!' }));
    }
  };

  return (
    <div className="add-product-page">
      {/* Page Header */}
      <div className="page-header">
        <h4>{isEdit ? 'Edit Product' : 'Add Product'}</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <span>{isEdit ? 'Edit Product' : 'Add Product'}</span>
        </div>
      </div>

      {loadingProduct ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
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
                      {categories.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
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
                      {brands.map(b => <option key={b.id} value={String(b.id)}>{b.name}</option>)}
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
                  background: 'var(--table-header-bg)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: '100%', maxHeight: '180px', objectFit: 'contain', borderRadius: '8px', marginBottom: '10px' }}
                    />
                    <label className="btn btn-outline-secondary btn-sm d-flex align-items-center">
                      Change Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData(prev => ({ ...prev, image: file }));
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      className="btn btn-link btn-sm text-danger mt-1 p-0"
                      onClick={() => { setImagePreview(null); setFormData(prev => ({ ...prev, image: null })); }}
                    >
                      Remove Image
                    </button>
                  </>
                ) : (
                  <>
                    <FiUpload size={48} color="#888" />
                    <p className="mt-2 mb-2" style={{ color: '#555' }}>Drag and drop image here</p>
                    <p className="text-muted small mb-2">or</p>
                    <label className="btn btn-outline-primary btn-sm align-items-center d-flex">
                      Browse Files
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData(prev => ({ ...prev, image: file }));
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                  </>
                )}
              </div>
              
              <p className="text-muted small">
                Allowed formats: JPG, PNG, GIF. Max size: 2MB
              </p>
            </div>

            {/* Actions */}
            <div className="form-card mt-4">
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary-custom d-flex align-items-center justify-content-center">
                  <FiSave className="me-2" /> {isEdit ? 'Update Product' : 'Save Product'}
                </button>
                <Link to="/products" className="btn btn-secondary-custom d-flex align-items-center justify-content-center">
                  <FiX className="me-2" /> Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
      )}
    </div>
  );
};

export default AddProduct;
