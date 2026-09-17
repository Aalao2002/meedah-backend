import { useContext, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../contexts/CartProvider";


export function CakeCardSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="h-44 sm:h-52 w-full rounded-xl bg-[#3B1220]/10" />
      <div className="mt-3 h-3 w-2/3 rounded bg-[#3B1220]/10" />
      <div className="mt-2 h-3 w-1/3 rounded bg-[#3B1220]/10" />
      <div className="mt-3 h-8 w-full rounded-md bg-[#3B1220]/5" />
    </div>
  );
}

function CakeCard({ cake }) {
  const { addToCart } = useContext(CartContext);
  const [imgLoaded, setImgLoaded] = useState(false);

  const sizes = cake.sizes || [];
  const hasSizes = sizes.length > 0;

  
  const [selectedSize, setSelectedSize] = useState(() =>
    hasSizes ? sizes.find((s) => s.available !== false) || sizes[0] : null
  );

    const price = useMemo(() => {
    if (selectedSize?.price != null && selectedSize.price !== "") {
      return Number(selectedSize.price) || 0;
    }
    return Number(cake.price) || 0;
  }, [selectedSize, cake.price]);

  const originalPrice = useMemo(() => {
    const raw =
      selectedSize?.original_price != null && selectedSize.original_price !== ""
        ? selectedSize.original_price
        : cake.original_price;
    return raw ? Number(raw) : null;
  }, [selectedSize, cake.original_price]);

  const hasDiscount = originalPrice && originalPrice > price;
  const discountPct = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  const image = cake.image_url || cake.image;
  const inStock =
    cake.is_active !== false && (!hasSizes || selectedSize?.available !== false);

  const handleSelectSize = (e, size) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (size.available === false) return;
    setSelectedSize(size);
  };

  return (
    <Link
      to={`/products/${cake.id}`}
      className="group flex flex-col"
      aria-disabled={!inStock}
    >
      <div className="relative h-44 sm:h-52 w-full overflow-hidden rounded-xl bg-[#3B1220]/10">
        
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-[#3B1220]/10" />
        )}
        <img
          src={image}
          alt={cake.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
            imgLoaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-105"
          }`}
        />

        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded-full bg-[#8A6A2F] text-[#FAF6F1] text-[10px] font-semibold px-2.5 py-1">
            {discountPct}% off
          </span>
        )}

        {!inStock && (
          <div className="absolute inset-0 bg-[#2B2320]/50 flex items-center justify-center">
            <span className="text-[#FAF6F1] text-xs font-medium tracking-wide">
              Unavailable
            </span>
          </div>
        )}
      </div>

      <h3 className="mt-3 text-sm text-[#2B2320] leading-snug line-clamp-1">
        {cake.name}
      </h3>

      
      {hasSizes && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {sizes.map((size) => {
            const isSelected = selectedSize?.value === size.value;
            const disabled = size.available === false;
            return (
              <button
                key={size.value}
                type="button"
                disabled={disabled}
                onClick={(e) => handleSelectSize(e, size)}
                className={`text-[11px] px-2 py-1 rounded-full border transition-colors
                  ${
                    isSelected
                      ? "bg-[#3B1220] text-[#FAF6F1] border-[#3B1220]"
                      : "border-[#3B1220]/20 text-[#2B2320] hover:border-[#3B1220]/50"
                  }
                  disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#3B1220]/20`}
              >
                {size.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-sm font-semibold text-[#8A6A2F]">
          {price.toLocaleString("en-NG", { style: "currency", currency: "NGN" })}
        </span>
        {hasDiscount && (
          <span className="text-xs text-[#2B2320]/40 line-through">
            {originalPrice.toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
            })}
          </span>
        )}
      </div>

      <div className="mt-2 border-t border-[#3B1220]/10 pt-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            if (!inStock) return;
                        addToCart(
              { ...cake, price, original_price: originalPrice },
              { size: selectedSize?.value ?? null, color: null }
            );
          }}
          disabled={!inStock}
          className="w-full text-xs font-medium text-[#3B1220] py-1.5 rounded-md
                     hover:bg-[#3B1220] hover:text-[#FAF6F1] transition-colors
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#3B1220]"
        >
          Add to order
        </button>
      </div>
    </Link>
  );
}

export default CakeCard;