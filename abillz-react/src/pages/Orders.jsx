import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { StateContext } from '../contexts/ContextProvider';
import MobileSide from '../components/MobileSide';

const API_URL = import.meta.env.VITE_API_URL;

const statusStyles = {
    pending: 'bg-amber-100 text-amber-700',
    baking: 'bg-rose-100 text-rose-600',
    ready: 'bg-green-100 text-green-700',
    delivered: 'bg-gray-100 text-gray-500',
};

const filters = ['all', 'pending', 'baking', 'ready', 'delivered'];

function Orders() {
    const [ orders, setOrders ] = useState([]);
    const [ activeFilter, setActiveFilter ] = useState('all');
    const [ search, setSearch ] = useState('');

     
    const visibleOrders = Array.isArray(orders) ? orders.filter((o) => {
        const matchesFilter = activeFilter === 'all' || o.status === activeFilter;

        const customer = o.firstName+""+o.lastName;
        const matchesSearch =
            customer.toLowerCase().includes(search.toLowerCase()) ||
            o.order_id.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    }) : [];

    const { token } = useContext(StateContext);
    useEffect(() => {
        const getProducts = async () => {
            const res = await fetch(`${API_URL}/my-orders`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept' : 'application/json',
                },
            })
            if(!res.ok) {
                const errMssg = await res.json();
                console.log(errMssg.errors);
                return;
            }
            const data = await res.json();
            setOrders(data.orders || []);
        }
        getProducts();
    },[token]);

    function countFor(status) {
        return status === 'all' ? orders.length : orders.filter((o) => o.status === status).length;
    }
    const navigate = useNavigate();

    return (
        <>
            <div className="border p-4 border-[#000]/10 rounded-xl shadow-sm max-w-550">
                <div className="flex items-center mb-10 justify-between flex-wrap gap-3">
                    <div className='mt-2'>
                        <h2 className="font-semibold text-xl font-poppins text-[#000]/80">Orders</h2>
                        <p className="text-sm">Track every cake from request to pickup</p>
                    </div>
                    <div className='flex overflow-x-auto py-2 md:hidden'>
                         <MobileSide />
                    </div>
                                
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by customer or order ID"
                            className="text-sm border border-gray-200 rounded-md p-2"
                        />
                        <button onClick={() => navigate("/shop")} className="p-2 px-3 text-sm text-[#fff] rounded-md bg-[#000] whitespace-nowrap">
                            + New order
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`text-xs font-semibold capitalize px-3 py-2 rounded-full border transition-colors ${
                                activeFilter === f
                                    ? 'bg-[#000] text-white border-[#000]'
                                    : 'bg-white text-[#000]/50 border-[#000]/10'
                            }`}
                        >
                            {f} ({countFor(f)})
                        </button>
                    ))}
                </div>

                <div className="border overflow-x-auto border-[#000]/10 mb-10 p-4 shadow-sm
                 rounded-xl mt-4">
                    <table className="min-w-[600px] text-sm w-full">
                        <thead>
                            <tr className="text-left text-xs text-[#000]/40 font-poppins">
                                <th className="pb-2 font-medium">Order Id</th>
                                <th className="pb-2 font-medium">Customer</th>
                                <th className="pb-2 font-medium">Order date</th>
                                <th className="pb-2 font-medium">Status</th>
                                <th className="pb-2 font-medium">Amount</th>
                                <th className="pb-2 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleOrders.map((o) => (
                                
                                <tr key={o.id} className="border-t border-[#000]/5">
                                    <td className="py-2">
                                        <p className="text-sm">{o.cake}</p>
                                        <p className="text-xs text-[#000]/40">#{o.order_id}</p>
                                    </td>
                                    <td className="py-2">{o.firstName+" "+o.lastName}</td>
                                    <td className="py-2">{new Date(o.created_at).toDateString("en-NG",
                                    {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric"
                                    }
                                    )}</td>
                                    <td className="py-2">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${statusStyles[o.status]}`}>
                                            {o.status}
                                        </span>
                                    </td>
                                    <td className="py-2">{Number(o.total).toLocaleString("en-NG", {
                                        style: 'currency',
                                        currency : 'NGN',
                                    })}</td>
                                    <td className="py-2">
                                        <NavLink to={`/orders/${encodeURIComponent(o.order_id)}`} className="text-xs font-semibold text-rose-600">
                                        Details</NavLink>
                                    </td>
                                </tr>
                            ))}
                            {visibleOrders.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="py-6 text-center text-sm text-[#000]/40">
                                        No orders match this filter yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Orders;