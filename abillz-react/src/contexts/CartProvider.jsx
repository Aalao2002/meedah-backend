import React, { useState, useEffect, createContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const CartContext = createContext();

function lineKey(id, size, color) {
  return `${id}::${size ?? "none"}::${color ?? "none"}`;
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(product, options = {}) {
    const { size = null, color = null } = options;
    const key = lineKey(product.id, size, color);
    const image = product.image || product.image_url;

    setCart((prev) => {
      const exists = prev.find((item) => item.key === key);
      if (exists) {
        toast.info(
          <div className="text-xs">{product.name} quantity updated</div>,
          {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
            toastId: `update-${key}`,
          }
        );
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        toast.success(
          <div className="flex items-center gap-2">
            <img src={image} width={30} height={40} alt={product.name} />
            <p className="text-xs font-semibold">{product.name} added to cart!</p>
          </div>,
          {
            position: "top-right",
            theme: "colored",
            autoClose: 3000,
            toastId: `update-${key}`,
          }
        );
        return [...prev, { ...product, key, size, color, quantity: 1 }];
      }
    });
  }

  function updateQuantity(type, key) {
  setCart((prev) => {
    const newCart = prev
      .map((item) =>
        item.key === key
          ? { ...item, quantity: type === "inc" ? item.quantity + 1 : item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);
        return newCart;
  });
}
  function removeItem(key) {
    const item = cart.find((i) => i.key === key);
    setCart((prev) => prev.filter((item) => item.key !== key));
    if (item) {
      const image = item.image || item.image_url;
      toast.warn(
        <div className="flex items-center gap-2">
          <img src={image} height={30} width={30} alt={item.name} />
          <p className="text-xs font-semibold">{item.name} removed from cart!</p>
        </div>,
        {
          position: "top-right",
          autoClose: 2500,
          theme: "colored",
          toastId: `${key}`,
        }
      );
    }
  }

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, setCart, addToCart, updateQuantity, total, removeItem }}
    >
      {children}
    </CartContext.Provider>
  );
};