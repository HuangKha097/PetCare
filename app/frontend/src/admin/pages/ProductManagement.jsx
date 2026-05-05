import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, MoreVertical, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { getAllProductsAdmin, updateProductStatus, deleteProduct } from '../../services/productService';

const ProductManagement = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [adminPassword, setAdminPassword] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await getAllProductsAdmin();
            setProducts(res.data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleToggleActive = async (product) => {
        try {
            const newStatus = !product.is_active;
            await updateProductStatus(product.id, newStatus);
            // Optimistic update
            setProducts(products.map(p => p.id === product.id ? { ...p, is_active: newStatus } : p));
        } catch (error) {
            console.error('Failed to update product status', error);
            alert('Failed to update status');
        }
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        setDeleteError('');
        try {
            await deleteProduct(productToDelete.id, adminPassword);
            alert('Product deactivated successfully!');
            setShowDeleteModal(false);
            setProductToDelete(null);
            setAdminPassword('');
            fetchProducts();
        } catch (error) {
            console.error('Delete failed', error);
            if (error.response?.status === 401) {
                setDeleteError('Invalid admin password');
            } else {
                setDeleteError('Failed to delete product');
            }
        } finally {
            setIsDeleting(false);
        }
    };

    const openDeleteModal = (product) => {
        setProductToDelete(product);
        setAdminPassword('');
        setDeleteError('');
        setShowDeleteModal(true);
    };

    const filteredProducts = products.filter(p => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
            (p.name && p.name.toLowerCase().includes(searchLower)) || 
            (p.sku && p.sku.toLowerCase().includes(searchLower)) ||
            (p.category && p.category.toLowerCase().includes(searchLower)) ||
            (p.brand && p.brand.toLowerCase().includes(searchLower));
            
        const matchesStatus = statusFilter === 'all' ? true : statusFilter === 'active' ? p.is_active : !p.is_active;
        return matchesSearch && matchesStatus;
    });

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-on-background mb-1">Products</h1>
                    <p className="text-on-surface-variant font-medium">Manage your catalog, stock, and visibility.</p>
                </div>
                <button 
                    onClick={() => navigate('/admin/products/add')}
                    className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                >
                    <Plus size={20} /> Add Product
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-surface-container-low shadow-sm overflow-hidden flex flex-col">
                {/* Toolbar */}
                <div className="p-4 border-b border-surface-container-low flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-container-lowest/50">
                    <div className="relative w-full sm:w-80">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
                        <input 
                            type="text" 
                            placeholder="Search by Name, SKU, Category, Brand..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-surface-container-low rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full sm:w-auto px-4 py-2 bg-white border border-surface-container-low rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Hidden</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-surface-container-lowest border-b border-surface-container-low text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                                <th className="p-4 pl-6 font-semibold w-24">Image</th>
                                <th className="p-4 font-semibold">Product Details</th>
                                <th className="p-4 font-semibold">Price</th>
                                <th className="p-4 font-semibold">Stock</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 pr-6 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                                    </td>
                                </tr>
                            ) : currentProducts.length > 0 ? (
                                currentProducts.map((product) => (
                                    <tr key={product.id} className="border-b border-surface-container-low last:border-0 hover:bg-surface-container-lowest/50 transition-colors">
                                        <td className="p-4 pl-6">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden border border-surface-container-low bg-white">
                                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-on-background text-base line-clamp-1">{product.name}</div>
                                            <div className="text-on-surface-variant font-medium mt-1 flex gap-3">
                                                <span>SKU: {product.sku || 'N/A'}</span>
                                                <span>•</span>
                                                <span>{product.category}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 font-bold text-on-background">${Number(product.price).toFixed(2)}</td>
                                        <td className="p-4">
                                            {product.stock_quantity > 10 ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-green-50 text-green-700 font-bold text-xs">{product.stock_quantity} in stock</span>
                                            ) : product.stock_quantity > 0 ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 font-bold text-xs">{product.stock_quantity} low stock</span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-red-50 text-red-700 font-bold text-xs">Out of stock</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <button 
                                                onClick={() => handleToggleActive(product)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                                                    product.is_active 
                                                    ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                                                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                                                }`}
                                            >
                                                {product.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                                                {product.is_active ? 'Active' : 'Hidden'}
                                            </button>
                                        </td>
                                        <td className="p-4 pr-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => navigate('/admin/products/edit/' + product.id)}
                                                    className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => openDeleteModal(product)}
                                                    className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-on-surface-variant font-medium">
                                        No products found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {!loading && filteredProducts.length > 0 && (
                    <div className="p-4 border-t border-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-lowest/50">
                        <div className="text-sm font-medium text-on-surface-variant">
                            Showing <span className="font-bold text-on-background">{indexOfFirstItem + 1}</span> to <span className="font-bold text-on-background">{Math.min(indexOfLastItem, filteredProducts.length)}</span> of <span className="font-bold text-on-background">{filteredProducts.length}</span> entries
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 rounded-lg border border-surface-container-low text-sm font-bold text-on-background disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-low transition-colors"
                            >
                                Prev
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                                    // Complex logic to show pages around current page
                                    let pageNum = idx + 1;
                                    if (totalPages > 5) {
                                        if (currentPage > 3) {
                                            pageNum = currentPage - 2 + idx;
                                        }
                                        if (currentPage > totalPages - 2) {
                                            pageNum = totalPages - 4 + idx;
                                        }
                                    }
                                    if (pageNum > totalPages) return null;

                                    return (
                                        <button 
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center transition-colors ${currentPage === pageNum ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-background'}`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 rounded-lg border border-surface-container-low text-sm font-bold text-on-background disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-low transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Password Verification Modal */}
            {showDeleteModal && productToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 bg-red-50 text-error rounded-full flex items-center justify-center mb-4">
                            <Trash2 size={24} />
                        </div>
                        <h2 className="text-xl font-black mb-2">Delete Product?</h2>
                        <p className="text-sm font-medium text-on-surface-variant mb-4">
                            Are you sure you want to deactivate <span className="font-bold text-on-background">"{productToDelete.name}"</span>? It will be hidden from the public store.
                        </p>
                        <p className="text-xs font-bold text-error mb-6 uppercase tracking-wider">
                            Requires Admin Password
                        </p>
                        
                        {deleteError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-bold">
                                {deleteError}
                            </div>
                        )}

                        <input 
                            type="password"
                            placeholder="Enter Admin Password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-surface-container-lowest border rounded-xl font-medium outline-none focus:ring-2 focus:ring-error/20 mb-6"
                            autoFocus
                        />

                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setAdminPassword('');
                                }}
                                className="px-5 py-2.5 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete}
                                disabled={!adminPassword || isDeleting}
                                className="px-5 py-2.5 bg-error text-white rounded-xl font-bold shadow-md shadow-error/20 hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                                {isDeleting ? 'Verifying...' : 'Delete Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
