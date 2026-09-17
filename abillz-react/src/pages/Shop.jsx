import { useEffect, useState } from "react";
import CakeCard, { CakeCardSkeleton } from "../components/CakeCard";

const API_URL = import.meta.env.VITE_API_URL;

function CakeMark() {
  return (
    <svg
      viewBox="0 0 220 220"
      className="w-40 h-40 md:w-56 md:h-56 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M40 120h140v50a10 10 0 0 1-10 10H50a10 10 0 0 1-10-10v-50Z" />
      <path d="M52 120v-28a8 8 0 0 1 8-8h100a8 8 0 0 1 8 8v28" />
      <path d="M64 84V60a6 6 0 0 1 6-6h80a6 6 0 0 1 6 6v24" />
      <path d="M40 150h140" />
      <path d="M96 54V34" />
      <path d="M124 54V34" />
      <path d="M96 34c0-6 6-8 6-14" />
      <path d="M124 34c0-6 6-8 6-14" />
    </svg>
  );
}

function ShopHero({ itemCount }) {
  return (
    <div className="w-full rounded-2xl bg-[#3B1220] text-[#FAF6F1] overflow-hidden">
      <div className="flex flex-col-reverse md:flex-row items-center md:items-end justify-between gap-6 px-6 py-10 md:px-12 md:py-14">
        <div className="max-w-md text-center md:text-left">
          <h2 className="font-serif text-3xl md:text-5xl leading-tight">
            Cakes made for the moment
          </h2>
          <p className="mt-3 text-sm md:text-base text-[#FAF6F1]/70">
            Baked fresh to order, ready when you need them.
            {typeof itemCount === "number" && itemCount > 0 && (
              <> Currently {itemCount} on the menu.</>
            )}
          </p>
        </div>
        <CakeMark />
      </div>
    </div>
  );
}

function ProductGrid({ cakes, loading }) {
  if (loading) {
    return (
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 lg:gap-x-8 px-2 py-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <CakeCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (cakes.length === 0) {
    return (
      <p className="text-center text-sm text-[#2B2320]/50 py-16">
        Nothing here yet — check back soon.
      </p>
    );
  }

  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 lg:gap-x-8 px-2 py-8">
      {cakes.map((cake) => (
        <CakeCard key={cake.id} cake={cake} />
      ))}
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full flex items-center justify-center gap-6 py-10 text-sm">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="text-[#3B1220] disabled:opacity-30 disabled:cursor-default hover:underline underline-offset-4"
      >
        Previous
      </button>

      <div className="flex items-center gap-3">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={
              currentPage === page
                ? "text-[#3B1220] font-semibold underline underline-offset-4"
                : "text-[#2B2320]/50 hover:text-[#3B1220]"
            }
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="text-[#3B1220] disabled:opacity-30 disabled:cursor-default hover:underline underline-offset-4"
      >
        Next
      </button>
    </div>
  );
}

function Shop() {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_URL}/products?page=${currentPage}`);
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();

        if (cancelled) return;

        if (Array.isArray(data)) {
          setProducts(data);
          setTotalPages(1);
          setTotalCount(data.length);
        } else {
          setProducts(data.data ?? []);
          setTotalPages(data.last_page ?? 1);
          setTotalCount(data.total ?? data.data?.length ?? 0);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [currentPage]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <ShopHero itemCount={totalCount} />

      {error && (
        <p className="mt-6 text-center text-sm text-red-500 bg-red-50 border border-red-200 rounded p-3">
          {error}
        </p>
      )}

      <ProductGrid cakes={products} loading={loading} />

      {!loading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

export default Shop;