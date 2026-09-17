import { useState, useEffect, useContext, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartProvider";

const API_BASE = import.meta.env.VITE_API_URL;

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();

        if (!cancelled) {
          setProduct(data);
          const defaultSize =
            data.sizes?.find((s) => s.available !== false) ?? data.sizes?.[0] ?? null;
          setSelectedSize(defaultSize);
          setSelectedColor(data.colors?.[0] ?? null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProduct();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const price = useMemo(() => {
    if (!product) return 0;
    if (selectedSize?.price != null && selectedSize.price !== "") {
      return Number(selectedSize.price) || 0;
    }
    return Number(product.price) || 0;
  }, [product, selectedSize]);

  const originalPrice = useMemo(() => {
    if (!product) return null;
    const raw =
      selectedSize?.original_price != null && selectedSize.original_price !== ""
        ? selectedSize.original_price
        : product.original_price;
    return raw ? Number(raw) : null;
  }, [product, selectedSize]);

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      setValidationError("Please select a size");
      return;
    }
    if (product.sizes?.length > 0 && selectedSize?.available === false) {
      setValidationError("That size is currently unavailable");
      return;
    }
    if (product.colors?.length > 0 && !selectedColor) {
      setValidationError("Please select a colour");
      return;
    }
    setValidationError(null);

    addToCart(
      { ...product, price, original_price: originalPrice },
      {
        size: selectedSize?.value ?? null,
        color: selectedColor?.value ?? null,
      }
    );
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!product) return null;

  const image = product.image || product.image_url;

  return (
    <div className="max-w-md mx-auto p-6">
      <img
        src={image}
        alt={product.name}
        className="w-full rounded-lg mb-6 object-cover"
      />

      <h1 className="text-2xl font-serif mb-2">{product.name}</h1>

      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-xl font-semibold">
          {price.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
        </span>
        {originalPrice && originalPrice > price && (
          <span className="text-gray-400 line-through">
            {originalPrice.toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
            })}
          </span>
        )}
      </div>

      {/* Color selection */}
      {product.colors?.length > 0 && (
        <div className="mb-6">
          <p className="mb-2 font-medium">Colour:</p>
          <div className="flex gap-3">
            {product.colors.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color)}
                className={`w-9 h-9 rounded border-2 ${
                  selectedColor?.value === color.value
                    ? "border-black"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color.hex }}
                aria-label={color.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size selection */}
      {product.sizes?.length > 0 && (
        <div className="mb-6">
          <p className="mb-2 font-medium">Size:</p>
          <div className="flex flex-wrap gap-3">
            {product.sizes.map((size) => {
              const isAvailable = size.available !== false;
              return (
                <button
                  key={size.value}
                  disabled={!isAvailable}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded border flex items-center justify-center
                    ${selectedSize?.value === size.value ? "border-black" : "border-gray-300"}
                    ${!isAvailable ? "text-gray-300 line-through cursor-not-allowed" : ""}
                  `}
                >
                  {size.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {validationError && (
        <p className="text-red-500 text-sm mb-2">{validationError}</p>
      )}

      <button
        onClick={handleAddToCart}
        className="w-full bg-black text-white py-4 rounded-md font-medium"
      >
        Add to Bag
      </button>
    </div>
  );
}