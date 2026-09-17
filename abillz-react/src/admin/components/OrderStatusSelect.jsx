import { useState } from 'react';

const STATUS_OPTIONS = ["pending", "baking", "ready", "delivered"];

const STATUS_STYLES = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    baking: "bg-orange-100 text-orange-700 border-orange-200",
    ready: "bg-blue-100 text-blue-700 border-blue-200",
    delivered: "bg-green-100 text-green-700 border-green-200",
};

function OrderStatusSelect({ order, token, onStatusChange }) {
    const [updating, setUpdating] = useState(false);

    async function handleChange(e) {
        const newStatus = e.target.value;
        setUpdating(true);
        try {
            const res = await fetch(`http://172.20.10.4:8000/api/all-orders/${order.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) throw new Error("Failed to update status");
            onStatusChange(order.id, newStatus);
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(false);
        }
    }

    return (
        <select
            value={order.status}
            onChange={handleChange}
            disabled={updating}
            className={`font-poppins text-xs font-semibold border rounded-md px-2 py-1 capitalize outline-none cursor-pointer disabled:opacity-50 ${STATUS_STYLES[order.status] || ""}`}
        >
            {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status} className="bg-white text-black">
                    {status}
                </option>
            ))}
        </select>
    );
}

export default OrderStatusSelect;