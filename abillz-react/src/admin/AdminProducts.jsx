import { useState, useEffect, useContext } from 'react';
import { StateContext } from '../contexts/ContextProvider';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

function AdminProducts() {
    const { token } = useContext(StateContext);
    const [products, setProducts] = useState([]);
    const [deletingId, setDeletingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_URL}/products`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        })
       .then((res) => res.json())
       .then((data) => setProducts(data.data || data))
       .catch((err) => setError(err.message))
       .finally(() => setLoading(false));
    },[token])

    const handleDelete = async (product_id) => {
      if (!window.confirm("Delete this product?")) return;
      setDeletingId(product_id);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/products/${product_id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Failed to delete");
        setProducts(products.filter(p => p.id!== product_id))
        alert("Product deleted")
      } catch (err) {
          setError(err.message);
      } finally {
          setDeletingId(null);
      }
    };

    return (
        <div className="space-y-6">
            <div className='md:hidden'>
            <button onClick={() => navigate("/admin")} className='hover:underline flex items-center text-sm gap-1'><ArrowLeft size={14} />back</button>
            </div>
            <h1 className="font-poppins text-2xl font-bold text-gray-900">Manage Products</h1>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                {loading ? (
                    <p className="font-poppins text-sm text-gray-500">Loading...</p>
                ) : products.length === 0 ? (
                    <p className="font-poppins text-sm text-gray-500">No product created.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="text-left border-b border-gray-200">
                                <th className="py-2 font-poppins text-xs font-semibold text-gray-500">Name</th>
                                <th className="py-2 font-poppins text-xs font-semibold text-gray-500">Price</th>
                                <th className="py-2 font-poppins text-xs font-semibold text-gray-500">image</th>
                                <th className="py-2 font-poppins text-xs font-semibold text-gray-500">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-b border-gray-100">
                                        <td className="py-3 font-poppins text-sm text-gray-800">{product.name}</td>
                                        <td className="py-3 font-poppins text-sm text-gray-800">₦{product.price.toLocaleString('en-NG',{
                                            style: "currency",
                                            currency: "NGN"
                                        })}</td>
                                        <td className="py-3 font-poppins text-sm text-gray-800">
                                            <div className='rounded p-2 w-[60px] h-[60px]'>
                                                <img src={product.image_url} className='w-full h-full' 
                                                alt={product.name} />
                                            </div>
                                        </td>
                                        <td className="py-3 font-poppins text-sm text-gray-800">
                                            <div className='flex gap-2'>
                                            <button onClick={() => navigate(`/admin/products/${product.id}/edit`)} className='rounded p-2 hover:scale-110 transition-all duration-400 bg-yellow-400 text-[#fff] font-semibold'>edit</button>
                                            <button onClick={()=> handleDelete(product.id)} className='rounded p-2 hover:scale-110 transition-all duration-400 bg-red-500 text-xs text-[#fff] font-semibold'>delete</button>
                                        </div>
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
export default AdminProducts;