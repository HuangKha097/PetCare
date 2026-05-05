import React, { useState, useEffect } from 'react';
import { AlertTriangle, ArrowRight, PackageX, PackageSearch, CheckCircle2 } from 'lucide-react';
import { getAllProductsAdmin, updateProduct } from '../../services/productService';

const InventoryMonitoring = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const res = await getAllProductsAdmin();
            // Sort by lowest stock first
            const sorted = res.data.sort((a, b) => a.stock_quantity - b.stock_quantity);
            setProducts(sorted);
        } catch (error) {
            console.error('Failed to fetch inventory', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleQuickRestock = async (productId, currentStock, restockAmount) => {
        try {
            const newStock = currentStock + restockAmount;
            await updateProduct(productId, { stock_quantity: newStock });
            // Optimistic update
            setProducts(products.map(p => p.id === productId ? { ...p, stock_quantity: newStock } : p).sort((a, b) => a.stock_quantity - b.stock_quantity));
        } catch (error) {
            console.error('Failed to restock', error);
            alert('Failed to update stock');
        }
    };

    const lowStockThreshold = 10;
    const lowStockItems = products.filter(p => p.stock_quantity <= lowStockThreshold && p.stock_quantity > 0);
    const outOfStockItems = products.filter(p => p.stock_quantity === 0);

    return (
        <div className="w-full space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-on-background mb-1">Inventory Alert</h1>
                <p className="text-on-surface-variant font-medium">Prevent out-of-stock issues by monitoring inventory levels.</p>
            </div>

            {/* Alert Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 border border-red-200 p-6 rounded-2xl flex items-start gap-4 shadow-sm">
                    <div className="p-3 bg-red-100 text-red-600 rounded-xl shrink-0">
                        <PackageX size={24} />
                    </div>
                    <div>
                        <h3 className="text-red-900 font-bold text-lg mb-1">Out of Stock</h3>
                        <p className="text-red-700 text-sm font-medium mb-3">You have {outOfStockItems.length} products with 0 stock.</p>
                        <div className="text-3xl font-black text-red-600">{outOfStockItems.length}</div>
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex items-start gap-4 shadow-sm">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-xl shrink-0">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h3 className="text-amber-900 font-bold text-lg mb-1">Low Stock Warning</h3>
                        <p className="text-amber-700 text-sm font-medium mb-3">Products running below {lowStockThreshold} items.</p>
                        <div className="text-3xl font-black text-amber-600">{lowStockItems.length}</div>
                    </div>
                </div>
            </div>

            {/* Action Required Table */}
            <div className="bg-white rounded-2xl border border-surface-container-low shadow-sm overflow-hidden">
                <div className="p-6 border-b border-surface-container-low flex items-center gap-3 bg-surface-container-lowest">
                    <PackageSearch size={20} className="text-primary" />
                    <h3 className="font-bold text-lg text-on-background">Needs Restocking</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-lowest/50 border-b border-surface-container-low text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                                <th className="p-4 pl-6 font-semibold">Product</th>
                                <th className="p-4 font-semibold">SKU</th>
                                <th className="p-4 font-semibold">Current Stock</th>
                                <th className="p-4 pr-6 font-semibold">Quick Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                                    </td>
                                </tr>
                            ) : products.filter(p => p.stock_quantity <= lowStockThreshold).length > 0 ? (
                                products.filter(p => p.stock_quantity <= lowStockThreshold).map(product => (
                                    <tr key={product.id} className="border-b border-surface-container-low last:border-0 hover:bg-surface-container-lowest/50">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-surface-container-low shrink-0 bg-white">
                                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                                </div>
                                                <span className="font-bold text-on-background line-clamp-1">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-on-surface-variant font-medium">{product.sku || 'N/A'}</td>
                                        <td className="p-4">
                                            {product.stock_quantity === 0 ? (
                                                <span className="bg-error text-white px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider">Out of Stock</span>
                                            ) : (
                                                <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md text-xs font-black">{product.stock_quantity} left</span>
                                            )}
                                        </td>
                                        <td className="p-4 pr-6">
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => handleQuickRestock(product.id, product.stock_quantity, 50)}
                                                    className="px-3 py-1.5 bg-surface-container hover:bg-primary hover:text-white rounded-lg text-xs font-bold transition-colors"
                                                >
                                                    +50
                                                </button>
                                                <button 
                                                    onClick={() => handleQuickRestock(product.id, product.stock_quantity, 100)}
                                                    className="px-3 py-1.5 bg-surface-container hover:bg-primary hover:text-white rounded-lg text-xs font-bold transition-colors"
                                                >
                                                    +100
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center text-on-surface-variant font-medium flex flex-col items-center">
                                        <CheckCircle2 size={48} className="text-green-500 mb-4" />
                                        <p>All products have healthy stock levels!</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InventoryMonitoring;
