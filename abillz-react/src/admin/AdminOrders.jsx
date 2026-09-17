import { useState, useEffect, useContext } from 'react';
import { StateContext } from '../contexts/ContextProvider';
import OrderStatusSelect from './components/OrderStatusSelect';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const statusStyles = {
    pending: 'bg-amber-100 text-amber-700',
    baking: 'bg-rose-100 text-rose-600',
    ready: 'bg-green-100 text-green-700',
    delivered: 'bg-gray-100 text-gray-500',
};

function AdminOrders() {
    const { token } = useContext(StateContext);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/all-orders`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setOrders(data.orders || data);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [token]);

    function handleStatusChange(orderId, newStatus) {
        setOrders((prev) =>
            prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
    }

    return (
        <div className="space-y-6">
            <div className='md:hidden'>
            <button onClick={() => navigate("/admin")} className='hover:underline flex items-center text-sm gap-1'><ArrowLeft size={14} />back</button>
            </div>

            <h1 className="font-poppins text-2xl font-bold text-gray-900">Orders</h1>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                {loading ? (
                    <p className="font-poppins text-sm text-gray-500">Loading...</p>
                ) : orders.length === 0 ? (
                    <p className="font-poppins text-sm text-gray-500">No orders found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-left border-b border-gray-200">
                                    <th className="py-2 font-poppins text-xs font-semibold text-gray-500">Order ID</th>
                                    <th className="py-2 font-poppins text-xs font-semibold text-gray-500">Customer</th>
                                    <th className="py-2 font-poppins text-xs font-semibold text-gray-500">Total</th>
                                    <th className="py-2 font-poppins text-xs font-semibold text-gray-500">Status</th>
                                    <th className="py-2 font-poppins text-xs font-semibold text-gray-500">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="border-b border-gray-100">
                                        <td className="py-3 font-poppins text-sm text-gray-800">#{order.id}</td>
                                        <td className="py-3 font-poppins text-sm text-gray-800">{order.firstName+ " "+ order.lastName}</td>
                                        <td className="py-3 font-poppins text-sm text-gray-800">₦{order.total}</td>
                                        <td className="py-3">
                                            <OrderStatusSelect
                                                order={order}
                                                token={token}
                                                onStatusChange={handleStatusChange}
                                            />
                                        </td>
                                        <td className="py-3 font-poppins text-sm text-red-400 p-2">
                                            <Link to={`/admin/orders/${order.order_id}`}>Details</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminOrders;