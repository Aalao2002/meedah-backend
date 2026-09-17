import { NavLink, useSearchParams } from 'react-router-dom';
import CakeCard from '../components/CakeCard'
import { useState, useEffect, useContext } from 'react';
import { StateContext } from '../contexts/ContextProvider';
import { ArrowLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

function Search() {

    const [searchParams] = useSearchParams();
    const { token } = useContext(StateContext);
    const query = searchParams.get("q") || "";
    const [cakes, setCakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try{
                const res = await fetch(`${API_URL}/products`, {
                    headers: { Authorization: `Bearer ${token}`}
                })
                if(!res.ok) {
                    const errMssg = await res.json()
                    throw new Error(errMssg.message || "something went wrong")
                }
                const data = await res.json()
                setCakes(data.data || data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    },[query, token]);

    const filteredProducts = cakes.filter((cake) =>
        cake.name.toLowerCase().includes(query.toLowerCase())
    )

    return (
        <div className='w-full'>
            <div className='w-full p-2'>
                <div className='text-center p-2'>
                    <NavLink className="flex items-center text-sm" to={"/"}><ArrowLeft  size={14}/>home</NavLink>
                </div>

                <h2 className='text-center py-4 text-lg font-semibold'>
                    Search result for: <span className='text-sm text-[#000]/60'>"{query}"</span>
                </h2>

                {error && <p className="text-center text-red-500">{error}</p>}

                {loading? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    <div className={`${filteredProducts.length === 1? "flex items-center flex-col justify-center" : "grid grid-cols-2"}
                    sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-4 border border-dashed px-2
                    border-gray-200/80 rounded-lg justify-items-center`}>
                        { filteredProducts.length > 0?
                        filteredProducts.map((cake) =>
                            <CakeCard cake={cake} key={cake.id} />
                        ) : (
                            <div className='h-90 w-full text-center text-[#000]/40 flex items-center justify-center'>
                            
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Search;