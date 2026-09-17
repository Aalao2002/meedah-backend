import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StateContext } from '../contexts/ContextProvider';

const API_URL = import.meta.env.VITE_API_URL;

const statusStyles = {
    pending: 'bg-amber-100 text-amber-700',
    baking: 'bg-rose-100 text-rose-600',
    ready: 'bg-green-100 text-green-700',
    delivered: 'bg-gray-100 text-gray-500',
};

const statusSequence = ['pending', 'baking', 'ready', 'delivered'];

const statusCopy = {
    pending: 'Order received, waiting to go into the kitchen',
    baking: 'In the oven and being decorated',
    ready: 'Boxed up and waiting for pickup',
    delivered: 'Handed over to the customer',
};

function Orderdetails() {
    const { order_id } = useParams();
    const { token } = useContext(StateContext);
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getOrder = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${API_URL}/orders/${order_id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                });

                if (!res.ok) {
                    const errMssg = await res.json();
                    setError(errMssg.errors || 'This order could not be found.');
                    return;
                }

                const data = await res.json();
                setOrder(data.order || null);
            } catch (err) {
                setError('Something went wrong while loading this order.');
            } finally {
                setLoading(false);
            }
        };
        getOrder();
    }, [order_id, token]);

    if (loading) {
        return (
            <div className="max-w-550 mx-auto p-10 text-center text-sm text-[#000]/40">
                Loading order…
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="max-w-550 mx-auto border border-[#000]/10 rounded-xl p-10 text-center shadow-sm">
                <h2 className="font-semibold text-lg font-poppins text-[#000]/80 mb-2">
                    We couldn't find this order
                </h2>
                <p className="text-sm text-[#000]/40 mb-6">{error || 'Check the link and try again.'}</p>
                <button
                    onClick={() => navigate('/orders')}
                    className="text-sm font-semibold text-white bg-[#000] rounded-md px-4 py-2"
                >
                    Back to orders
                </button>
            </div>
        );
    }

    const currentStepIndex = statusSequence.indexOf(order.status);
    const customerName = `${order.firstName || ''} ${order.lastName || ''}`.trim();

    return (
        <div className="max-w-550 mx-auto">
            {/* Hero */}
            <div className="border border-[#000]/10 rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <p className="text-xs text-[#000]/40 mb-1">#{order.order_id}</p>
                        <h1 className="font-semibold text-2xl font-poppins text-[#000]/80">
                            {order.cake}
                        </h1>
                        <p className="text-sm text-[#000]/50 mt-1">for {customerName || 'a customer'}</p>
                    </div>
                    <div className="text-right">
                        <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusStyles[order.status]}`}>
                            {order.status}
                        </span>
                        <p className="text-2xl font-poppins font-semibold text-[#000]/80 mt-3">
                            {Number(order.total || 0).toLocaleString('en-NG', {
                                style: 'currency',
                                currency: 'NGN',
                            })}
                        </p>
                    </div>
                </div>

                {/* Status timeline — legitimate here since status is a real sequence */}
                <div className="flex items-center mt-8 mb-2">
                    {statusSequence.map((step, i) => (
                        <React.Fragment key={step}>
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-3 h-3 rounded-full ${
                                        i <= currentStepIndex ? 'bg-rose-600' : 'bg-[#000]/10'
                                    }`}
                                />
                                <p
                                    className={`text-xs mt-2 capitalize ${
                                        i <= currentStepIndex ? 'text-[#000]/70 font-medium' : 'text-[#000]/30'
                                    }`}
                                >
                                    {step}
                                </p>
                            </div>
                            {i < statusSequence.length - 1 && (
                                <div
                                    className={`flex-1 h-[2px] mb-5 ${
                                        i < currentStepIndex ? 'bg-rose-600' : 'bg-[#000]/10'
                                    }`}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
                <p className="text-sm text-[#000]/50">{statusCopy[order.status]}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Order items */}
                <div className="md:col-span-2 border border-[#000]/10 rounded-xl shadow-sm p-6">
                    <h2 className="font-semibold font-poppins text-[#000]/80 mb-4">Order items</h2>
                    <div className="divide-y divide-[#000]/5">
                        {(order.order_items || []).map((item) => (
                            <div key={item.id} className="flex items-center justify-between py-3">
                                <div>
                                    <p className="text-sm text-[#000]/80">{item.name}</p>
                                    <p className="text-xs text-[#000]/40">Qty {item.quantity}</p>
                                </div>
                                <div>
                                    {(item.size || item.color) && (
                                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                                        {item.size && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3B1220]/5 text-[#2B2320]/60 border border-[#3B1220]/10">
                                    Size: {item.size}
                                    </span>
                                    )}
                                    {item.color && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3B1220]/5 text-[#2B2320]/60 border border-[#3B1220]/10">
                                     Colour: {item.color}
                                    </span>
                                        )}
                                    </div>
                                    )}

                                </div>
                                <p className="text-sm text-[#000]/70">
                                    {Number(item.price || 0).toLocaleString('en-NG', {
                                        style: 'currency',
                                        currency: 'NGN',
                                    })}
                                </p>
                            </div>
                        ))}
                        {(!order.order_items || order.order_items.length === 0) && (
                            <p className="text-sm text-[#000]/40 py-4">No items listed for this order.</p>
                        )}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-[#000]/10 mt-2">
                        <p className="text-sm font-semibold text-[#000]/80">Total</p>
                        <p className="text-sm font-semibold text-[#000]/80">
                            {Number(order.total || 0).toLocaleString('en-NG', {
                                style: 'currency',
                                currency: 'NGN',
                            })}
                        </p>
                    </div>
                </div>

                {/* Customer & pickup */}
                <div className="border border-[#000]/10 rounded-xl shadow-sm p-6">
                    <h2 className="font-semibold font-poppins text-[#000]/80 mb-4">Customer</h2>
                    <p className="text-sm text-[#000]/80">{customerName || '—'}</p>
                    {order.email && <p className="text-xs text-[#000]/40 mt-1">{order.email}</p>}
                    {order.phone && <p className="text-xs text-[#000]/40">{order.phone}</p>}

                    <div className="mt-6 pt-6 border-t border-[#000]/10">
                        <h2 className="font-semibold font-poppins text-[#000]/80 mb-2">Pickup</h2>
                        <p className="text-sm text-[#000]/80">{order.created_at || 'Not scheduled yet'}</p>
                    </div>

                    <button
                        onClick={() => navigate('/orders')}
                        className="w-full mt-6 text-sm font-semibold text-[#000]/70 border border-[#000]/10 rounded-md px-4 py-2 hover:bg-[#000]/[0.03] transition-colors"
                    >
                        Back to all orders
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Orderdetails;