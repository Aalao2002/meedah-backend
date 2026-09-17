import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StateContext } from '../contexts/ContextProvider';
import OrderStatusSelect from './components/OrderStatusSelect';

const API_URL = import.meta.env.VITE_API_URL

function AdminDashboard() {
    const { token } = useContext(StateContext);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_URL}/products`, {
            headers: { Authorization: `Bearer ${token}` },
        })
      .then((res) => res.json())
      .then((data) => setProducts(data.data || data))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingProducts(false));
    },[token]);

    // Fetch orders
    useEffect(()=> {
        fetch(`${API_URL}/all-orders`, {
            headers: { Authorization: `Bearer ${token}` },
        })
       .then((res) => res.json())
       .then((data) => setOrders(data.orders || data))
       .catch((err) => setError(err.message))
       .finally(() => setLoadingOrders(false));
    }, [token]);

    const handleDelete = async (product_id) => {
      if (!window.confirm("Delete this product?")) return;
      setDeletingId(product_id);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/products/${product_id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Failed to delete");
        setProducts(products.filter(p => p.id!== product_id))
        alert("Product deleted")
      } catch (err) {
          setError(err.message);
      } finally {
          setDeletingId(null);
      }
    };

    function handleStatusChange(orderId, newStatus) {
        setOrders((prev) =>
            prev.map((o) => (o.id === orderId? {...o, status: newStatus } : o))
        );
    }

    const totalOrders = orders.length;
    const pendingCount = orders.filter((o) => o.status === "pending").length;
    const bakingCount = orders.filter((o) => o.status === "baking").length;
    const readyCount = orders.filter((o) => o.status === "ready").length;
    const deliveredCount = orders.filter((o) => o.status === "delivered").length;

    const recentOrders = orders.slice(0, 5);

    const statCards = [
        { label: "Total Orders", value: totalOrders, color: "text-gray-900" },
        { label: "Pending", value: pendingCount, color: "text-yellow-600" },
        { label: "Baking", value: bakingCount, color: "text-orange-600" },
        { label: "Ready", value: readyCount, color: "text-blue-600" },
        { label: "Delivered", value: deliveredCount, color: "text-green-600" },
    ];

    return (
        <div className="space-y-6">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className='flex items-center justify-between'>
                <h1 className="font-poppins text-2xl font-bold text-gray-900">Dashboard</h1>
                <button onClick={()=> navigate('/admin/add-products')}
                    className='text-bold px-2 rounded text-lg bg-[#000] text-[#fff]'>+</button>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {statCards.map((card) => (
                    <div key={card.label} className="bg-white border-gray-200 rounded-lg shadow-sm p-4">
                        <p className="font-poppins text-xs font-semibold text-gray-500">{card.label}</p>
                        <p className={`font-poppins text-2xl font-bold mt-1 ${card.color}`}>
                            {loadingOrders? "-" : card.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Recent orders */}
            <div className="bg-white border-gray-200 rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-poppins text-lg font-semibold text-gray-900">Recent Orders</h2>
                    <Link to="/admin/orders" className="font-poppins text-sm font-semibold text-blue-600 hover:underline">View All</Link>
                </div>
                {loadingOrders? (
                    <p className="font-poppins text-sm text-gray-500">Loading...</p>
                ) : recentOrders.length === 0? (
                    <p className="font-poppins text-sm text-gray-500">No orders yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-left border-b border-gray-200">
                                    <th className="py-2 font-poppins text-xs font-semibold text-gray-500">Order ID</th>
                                    <th className="py-2 font-poppins text-xs font-semibold text-gray-500">Customer</th>
                                    <th className="py-2 font-poppins text-xs font-semibold text-gray-500">Total</th>
                                    <th className="py-2 font-poppins text-xs font-semibold text-gray-500">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-gray-100">
                                        <td className="py-3 font-poppins text-sm text-gray-800">#{order.id}</td>
                                        <td className="py-3 font-poppins text-sm text-gray-800">{order.firstName+ " "+ order.lastName}</td>
                                        <td className="py-3 font-poppins text-sm text-gray-800">
                                            
                                            ₦{order.total.toLocaleString("en-NG", { style: "currency", currency: "NGN" })}
                                        </td>
                                        <td className="py-3">
                                            <OrderStatusSelect order={order} token={token} onStatusChange={handleStatusChange} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-poppins text-lg font-semibold text-gray-900">Products</h2>
                    <Link to="/admin/products" className="font-poppins text-sm font-semibold text-blue-600 hover:underline">View All</Link>
                </div>
                {loadingProducts? (
                    <p className="font-poppins text-sm text-gray-500">Loading...</p>
                ) : products.length === 0? (
                    <p className="font-poppins text-sm text-gray-500">No products found.</p>
                ) : (
                <div className='overflow-x-auto'>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-left border-b border-gray-200">
                                <th className="py-2 font-poppins text-xs font-semibold text-gray-500">Name</th>
                                <th className="py-2 font-poppins text-xs font-semibold text-gray-500">Price</th>
                                <th className='py-2 font-poppins text-xs font-semibold text-gray-500'>Image</th>
                                <th className="py-2 font-poppins text-xs font-semibold text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="border-b border-gray-100">
                                    <td className="py-3 font-poppins text-sm text-gray-800">{product.name}</td>
                                    <td className="py-3 font-poppins text-sm text-gray-800">
                                        ₦{product.price.toLocaleString("en-NG", { style: "currency", currency: "NGN" })}
                                    </td>
                                    <td className="py-3 font-poppins text-sm text-gray-800">
                                        <div className='p-2 w-[60px] h-[60px]'>
                                            <img src={product.image_url} className='w-full h-full' alt={product.name} />
                                        </div>
                                    </td>
                                    <td className="py-3 font-poppins text-sm text-gray-800">
                                        <div className='flex gap-2'>
                                            <button disabled={deletingId === product.id} onClick={() => navigate(`/admin/products/${product.id}/edit`)} className='rounded p-2 hover:scale-110 transition-all duration-400 bg-yellow-400 text-[#fff] font-semibold'>edit</button>
                                            <button disabled={deletingId === product.id} onClick={() => handleDelete(product.id)} className='rounded p-2 hover:scale-110 transition-all duration-400 bg-red-500 text-xs text-[#fff] font-semibold'>
                                                {deletingId === product.id? 'Deleting...' : 'delete'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>)}
            </div>
        </div>
    );
}

export default AdminDashboard;