import React, { useState, useEffect, useContext } from 'react';
import { useNavigate,NavLink } from 'react-router-dom';
import { StateContext } from '../contexts/ContextProvider';
import MobileSide from '../components/MobileSide';

const API_URL = import.meta.env.VITE_API_URL;

const statusStyles = {
    pending: 'bg-amber-100 text-amber-700',
    baking: 'bg-rose-100 text-rose-600',
    ready: 'bg-green-100 text-green-700',
    delivered: 'bg-gray-100 text-gray-500',
};

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

function DashboardHome() {
    const { user, token } = useContext(StateContext);
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const wishlist = [];

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const res = await fetch(`${API_URL}/my-orders`, {
                    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
                });
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data.orders || []);
                }
            } catch (err) {
                console.log('Failed to load orders', err);
            } finally {
                setLoading(false);
            }
        };
        loadOrders();
    }, [token]);

    const today = new Date();
    const dayName = today.toLocaleDateString('en-NG', { weekday: 'long' });
    const dateLabel = today.toLocaleDateString('en-NG', { month: 'long', day: 'numeric' });

    const latestOrders = orders.slice(0, 5);
    const pendingCount = orders.filter((o) => o.status === 'pending' || o.status === 'baking').length;

    if (loading) {
        return <div className="max-w-550 mx-auto p-10 text-center text-sm text-[#000]/40">Loading your dashboard…</div>;
    }

    return (
        <div className="max-w-550 mx-auto">
            {/* Greeting */}
            <div className="mb-6 py-2">
                <h1 className="font-semibold text-2xl font-poppins text-[#000]/80 mt-1">
                    {getGreeting()}{user?.firstName ? `, ${user.firstName}` : ''}
                </h1>
                <p className="text-sm text-[#000]/40">{dayName}, {dateLabel}</p>
            </div>
            <div className='flex overflow-x-auto py-2 md:hidden'>
                <MobileSide />
            </div>
            

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="border border-[#000]/10 rounded-xl shadow-sm p-4">
                    <p className="text-xs text-[#000]/40">Total orders</p>
                    <p className="text-2xl font-poppins font-semibold text-[#000]/80 mt-1">{orders.length}</p>
                </div>
                <div className="border border-[#000]/10 rounded-xl shadow-sm p-4">
                    <p className="text-xs text-[#000]/40">In progress</p>
                    <p className="text-2xl font-poppins font-semibold text-[#000]/80 mt-1">{pendingCount}</p>
                </div> 
                <div className="border border-[#000]/10 rounded-xl shadow-sm p-4">
                    <p className="text-xs text-[#000]/40">Wishlist</p>
                    <p className="text-2xl font-poppins font-semibold text-[#000]/80 mt-1">{wishlist.length}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Latest orders */}
                <div className="md:col-span-2 border border-[#000]/10 rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold font-poppins text-[#000]/80">Recent orders</h2>
                        <button onClick={() => navigate('/orders')} className="text-xs font-semibold text-rose-600">
                            View all
                        </button>
                    </div>

                    {latestOrders.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-sm text-[#000]/40 mb-4">You haven't placed an order yet.</p>
                            <button
                                onClick={() => navigate('/shop')}
                                className="text-sm font-semibold text-white bg-[#000] rounded-md px-4 py-2"
                            >
                                Order a cake
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#000]/5">
                            {latestOrders.map((o) => (
                                <div
                                    key={o.id}
                                    onClick={() => navigate(`/orders/${o.order_id}`)}
                                    className="flex items-center justify-between py-3 cursor-pointer"
                                >
                                    <div>
                                        <p className="text-sm text-[#000]/80">{o.cake}</p>
                                        <p className="text-xs flex gap-4 text-[#000]/40">#{o.order_id}
                                        <span>{new Date(o.created_at).toLocaleDateString("en-NG", {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}</span></p>
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${statusStyles[o.status]}`}>
                                        {o.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Wishlist — placeholder, not built yet */}
                <div className="border border-[#000]/10 rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold font-poppins text-[#000]/80">Wishlist</h2>
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-rose-100 text-rose-600">
                            {wishlist.length}
                        </span>
                    </div>
                    <div className="text-center py-6">
                        <p className="text-sm text-[#000]/40">Save cakes you love here.</p>
                        <p className="text-xs text-[#000]/30 mt-1">Coming soon</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardHome;