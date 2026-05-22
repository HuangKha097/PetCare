import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UploadCloud, X, Plus, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getProductById, createProduct, updateProduct } from '../../services/productService';
import API from '../../api/axios';
import Button from '../../components/Button';

const CATEGORIES = ['Food', 'Toys', 'Accessories', 'Health', 'Grooming', 'Beds'];
const PET_TYPES = ['Dog', 'Cat', 'Bird', 'Fish', 'Small Pet', 'Universal'];

const ProductForm = () => {
    const { i18n, t } = useTranslation();
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        brand: '',
        category: CATEGORIES[0],
        pet_type: PET_TYPES[0],
        price: '',
        stock_quantity: '',
        description: '',
        ingredients: '',
        images: []
    });

    // Password Verification State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        if (isEdit) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await getProductById(id);
            const p = res.data;
            
            // Helper to get English text for the form
            const getEn = (val) => (val && typeof val === 'object') ? (val.en || '') : (val || '');

            setFormData({
                name: getEn(p.name),
                sku: p.sku || '',
                brand: p.brand || '',
                category: getEn(p.category) || CATEGORIES[0],
                pet_type: getEn(p.pet_type) || PET_TYPES[0],
                price: p.price || '',
                stock_quantity: p.stock_quantity || '',
                description: getEn(p.description),
                ingredients: getEn(p.ingredients),
                images: p.images || []
            });
        } catch (error) {
            console.error('Failed to load product', error);
            alert('Failed to load product details');
            navigate('/admin/products');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (formData.images.length >= 5) {
            alert('Maximum 5 images allowed');
            return;
        }

        setUploadingImage(true);
        const formPayload = new FormData();
        formPayload.append('images', file);

        try {
            const res = await API.post('/upload', formPayload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Backend returns { urls: [url1, url2, ...] }
            const uploadedUrls = res.data.urls || [];
            if (uploadedUrls.length > 0) {
                setFormData({ ...formData, images: [...formData.images, ...uploadedUrls] });
            }
        } catch (error) {
            console.error('Upload failed', error);
            alert(error.response?.data?.message || 'Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    const removeImage = (index) => {
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData({ ...formData, images: newImages });
    };

    const handleSubmitClick = (e) => {
        e.preventDefault();
        
        if (formData.images.length === 0 || formData.images.length > 5) {
            alert('Please provide between 1 and 5 images');
            return;
        }

        if (isEdit) {
            // Require password for edit
            setShowPasswordModal(true);
        } else {
            // Direct submit for create
            executeSubmit();
        }
    };

    const executeSubmit = async (password = '') => {
        setSubmitting(true);
        setPasswordError('');

        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                stock_quantity: parseInt(formData.stock_quantity)
            };

            if (isEdit) {
                await updateProduct(id, payload, password);
                alert(t('admin.update_success'));
                setShowPasswordModal(false);
            } else {
                await createProduct(payload);
                alert(t('admin.create_success'));
            }
            navigate('/admin/products');
        } catch (error) {
            console.error('Submit failed', error);
            if (error.response?.status === 401) {
                setPasswordError(t('admin.invalid_password'));
            } else {
                alert(error.response?.data?.message || t('admin.save_failed'));
                if (isEdit) setShowPasswordModal(false);
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="p-12 text-center">{t('admin.loading')}</div>;
    }

    return (
        <div className="w-full space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate('/admin/products')}
                    className="p-2 bg-white border border-surface-container-low rounded-xl text-on-surface-variant hover:text-on-background hover:bg-surface-container transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-on-background">{isEdit ? t('admin.edit_existing_product') : t('admin.add_new_product')}</h1>
                    <p className="text-on-surface-variant font-medium mt-1">{t('admin.form_desc')}</p>
                </div>
            </div>

            <form onSubmit={handleSubmitClick} className="space-y-6">
                {/* Basic Details */}
                <div className="bg-white rounded-2xl border border-surface-container-low shadow-sm p-6">
                    <h2 className="text-xl font-bold mb-6 text-on-background">{t('admin.basic_info')}</h2>
                    
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-on-surface-variant mb-1.5">{t('admin.product_name')} *</label>
                            <input 
                                type="text" 
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-4 py-2.5 bg-surface-container-lowest border border-surface-container-low rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="e.g., Premium Salmon Cat Food"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-on-surface-variant mb-1.5">SKU *</label>
                            <input 
                                required type="text" name="sku" value={formData.sku} onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-surface-container-lowest border border-surface-container-low rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all uppercase" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-on-surface-variant mb-1.5">{t('admin.brand')}</label>
                            <input 
                                type="text" 
                                value={formData.brand}
                                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                                className="w-full px-4 py-2.5 bg-surface-container-lowest border border-surface-container-low rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="e.g., Purina"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-on-surface-variant mb-1.5">{t('admin.category')} *</label>
                                <select 
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-surface-container-lowest border border-surface-container-low rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-on-surface-variant mb-1.5">{t('admin.pet_type')}</label>
                                <select 
                                    name="pet_type" value={formData.pet_type} onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-surface-container-lowest border border-surface-container-low rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                                >
                                    {PET_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="bg-white rounded-2xl border border-surface-container-low p-6 shadow-sm space-y-6">
                    <h3 className="font-bold text-lg border-b pb-4">{t('admin.pricing_stock')}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-on-surface-variant mb-2">{t('product.price')} (USD) <span className="text-error">*</span></label>
                            <input 
                                required type="number" step="0.01" min="0" name="price" value={formData.price} onChange={handleChange}
                                className="w-full px-4 py-2 bg-surface-container-lowest border rounded-xl font-medium outline-none focus:ring-2 focus:ring-primary/20" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-on-surface-variant mb-2">{t('admin.stock_quantity')} <span className="text-error">*</span></label>
                            <input 
                                required type="number" min="0" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange}
                                className="w-full px-4 py-2 bg-surface-container-lowest border rounded-xl font-medium outline-none focus:ring-2 focus:ring-primary/20" 
                            />
                        </div>
                    </div>
                </div>

                {/* Description & Details */}
                <div className="bg-white rounded-2xl border border-surface-container-low p-6 shadow-sm space-y-6">
                    <h3 className="font-bold text-lg border-b pb-4">{t('admin.details')}</h3>
                    
                    <div>
                        <label className="block text-sm font-bold text-on-surface-variant mb-2">{t('product.description')} <span className="text-error">*</span></label>
                        <textarea 
                            required name="description" rows="5" value={formData.description} onChange={handleChange}
                            className="w-full px-4 py-3 bg-surface-container-lowest border rounded-xl font-medium outline-none focus:ring-2 focus:ring-primary/20" 
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-on-surface-variant mb-2">{t('product.ingredients')} / Materials</label>
                        <textarea 
                            name="ingredients" rows="3" value={formData.ingredients} onChange={handleChange}
                            className="w-full px-4 py-3 bg-surface-container-lowest border rounded-xl font-medium outline-none focus:ring-2 focus:ring-primary/20" 
                        ></textarea>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white rounded-2xl border border-surface-container-low p-6 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                        <h3 className="font-bold text-lg">{t('admin.product_image')}</h3>
                        <span className="text-sm font-bold text-on-surface-variant">{formData.images.length}/5 Images</span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {formData.images.map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-xl border border-surface-container-low overflow-hidden group">
                                <img src={img} alt="Product" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button 
                                        type="button" onClick={() => removeImage(idx)}
                                        className="w-8 h-8 bg-error text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                {idx === 0 && <span className="absolute top-2 left-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">Main</span>}
                            </div>
                        ))}

                        {formData.images.length < 5 && (
                            <label className="aspect-square rounded-xl border-2 border-dashed border-surface-container-high hover:border-primary/50 hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer relative overflow-hidden">
                                {uploadingImage ? (
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                                ) : (
                                    <>
                                        <div className="w-10 h-10 bg-surface-container text-on-surface-variant rounded-full flex items-center justify-center">
                                            <UploadCloud size={20} />
                                        </div>
                                        <span className="text-xs font-bold text-on-surface-variant">Upload Image</span>
                                    </>
                                )}
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" disabled={uploadingImage} />
                            </label>
                        )}
                    </div>
                    {formData.images.length === 0 && (
                        <p className="text-sm font-medium text-error flex items-center gap-2 mt-2">
                            * At least 1 image is required
                        </p>
                    )}
                </div>

                {/* Submit Action */}
                <div className="flex justify-end gap-4 mt-8 border-t pt-6">
                    <Button 
                        variant="ghost" onClick={() => navigate('/admin/products')}
                        className="px-6 py-3"
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        loading={submitting}
                        disabled={uploadingImage || formData.images.length === 0}
                        className="px-8 py-3 bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark"
                    >
                        <Save size={20} /> Save Product
                    </Button>
                </div>
            </form>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <h2 className="text-xl font-black mb-2">Verify Identity</h2>
                        <p className="text-sm font-medium text-on-surface-variant mb-6">
                            Modifying product details requires administrative privileges. Please enter your password to confirm.
                        </p>
                        
                        {passwordError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-bold">
                                {passwordError}
                            </div>
                        )}

                        <input 
                            type="password"
                            placeholder={t('admin.admin_password')}
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && adminPassword && !submitting) {
                                    executeSubmit(adminPassword);
                                }
                            }}
                            className="w-full px-4 py-3 bg-surface-container-lowest border rounded-xl font-medium outline-none focus:ring-2 focus:ring-primary/20 mb-6"
                            autoFocus
                        />

                        <div className="flex justify-end gap-3">
                            <Button 
                                variant="ghost"
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setAdminPassword('');
                                    setPasswordError('');
                                }}
                                className="px-5 py-2.5"
                            >
                                {t('admin.cancel')}
                            </Button>
                            <Button 
                                onClick={() => executeSubmit(adminPassword)}
                                loading={submitting}
                                disabled={!adminPassword}
                                className="px-5 py-2.5 bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary-dark"
                            >
                                {t('admin.confirm_update')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductForm;
