import React, { useContext } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { CartContext } from "../contexts/CartProvider";
import { useNavigate } from "react-router-dom";

function CartItemRow({ item, onUpdateQuantity, onRemove }) {
  const image = item.image || item.image_url;
  const price = Number(item.price) || 0;
  
  return (
    <div className="flex gap-3 p-3 border-b border-[#3B1220]/10 last:border-b-0">
      <img
        src={image}
        alt={item.name}
        className="w-16 h-16 rounded-lg object-cover bg-[#3B1220]/10 shrink-0"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-sm text-[#2B2320] font-medium leading-snug">
            {item.name}
          </h2>
          <button
            onClick={() => onRemove(item.key)}
            className="text-[#2B2320]/30 hover:text-red-500 transition-colors shrink-0"
            aria-label="Remove item"
          >
            <DeleteIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

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

        <div className="flex items-center justify-between mt-2.5">
          <span className="text-sm font-semibold text-[#8A6A2F]">
            {price.toLocaleString("en-NG", { style: "currency", currency: "NGN" })}
          </span>

          <div className="flex items-center border border-[#3B1220]/15 rounded-full overflow-hidden">
            <button
              onClick={() => onUpdateQuantity("dec", item.key)}
              className="w-7 h-7 flex items-center justify-center text-[#3B1220] hover:bg-[#3B1220]/5"
              aria-label="Decrease quantity"
            >
              <RemoveIcon sx={{ fontSize: 14 }} />
            </button>
            <span className="w-6 text-center text-xs text-[#2B2320]">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity("inc", item.key)}
              className="w-7 h-7 flex items-center justify-center text-[#3B1220] hover:bg-[#3B1220]/5"
              aria-label="Increase quantity"
            >
              <AddIcon sx={{ fontSize: 14 }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cart() {
  const navigate = useNavigate();
  const { cart, removeItem, updateQuantity } = useContext(CartContext);

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <h1 className="font-serif text-2xl text-[#2B2320] mb-5">Your Cart</h1>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Items */}
        <div className="flex-1 bg-white border border-[#3B1220]/10 rounded-xl overflow-hidden">
          {cart.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-center">
              <p className="text-sm text-[#2B2320]/50">Your cart is empty.</p>
              <button
                onClick={() => navigate("/shop")}
                className="text-xs text-[#3B1220] underline underline-offset-4"
              >
                Browse the shop
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <CartItemRow
                key={item.key}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))
          )}
        </div>

        {/* Summary */}
        <div className="md:w-[360px] shrink-0 bg-white border border-[#3B1220]/10 rounded-xl p-5 h-fit">
          <h2 className="font-serif text-lg text-[#2B2320] mb-4">Order Summary</h2>

          <div className="flex justify-between text-sm text-[#2B2320]/70 mb-2">
            <span>Items</span>
            <span>{cart.length}</span>
          </div>

          <div className="flex justify-between text-sm text-[#2B2320]/70 pb-3 border-b border-[#3B1220]/10">
            <span>Delivery</span>
            <span>
              {(0).toLocaleString("en-NG", { style: "currency", currency: "NGN" })}
            </span>
          </div>

          <div className="flex justify-between items-center py-3">
            <span className="text-sm font-semibold text-[#2B2320]">Total</span>
            <span className="text-base font-semibold text-[#8A6A2F]">
              {totalPrice.toLocaleString("en-NG", { style: "currency", currency: "NGN" })}
            </span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            disabled={cart.length === 0}
            className="w-full bg-[#3B1220] hover:bg-[#2B0D18] text-[#FAF6F1] rounded-md py-2.5 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;