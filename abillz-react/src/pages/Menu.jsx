import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function Menu() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);

    const category = searchParams.get("category") || "all";

    useEffect(() => {
        if (!category) {
            setSearchParams({ category: "all" });
        }
    }, [category, setSearchParams]);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(true), 900);
        return () => clearTimeout(timer);
    }, [category]);

    const blogCat = [
        { id: 1, name: "All" },
        { id: 2, name: "Recipes" },
        { id: 3, name: "Baking Tips" },
        { id: 4, name: "Cake Ideas" },
        { id: 5, name: "Decorating" },
        { id: 6, name: "Events & Celebrations" },
        { id: 7, name: "Behind the Scenes" },
    ];

    return (
        <div>
            {/* Hero */}
            <div className='relative overflow-hidden rounded-xl bg-[#2B211D] h-60 md:h-80 w-full flex items-center flex-col p-4 mb-5 justify-center gap-3 text-center'>
                <div
                    className='absolute inset-0 opacity-[0.07] pointer-events-none'
                    style={{
                        backgroundImage: 'radial-gradient(circle, #E8B4A2 1px, transparent 1px)',
                        backgroundSize: '16px 16px',
                    }}
                />
                <span className='relative text-[#C89B3C] text-xs tracking-wide'>
                    From our kitchen
                </span>
                <h2 className='relative font-serif text-2xl md:text-4xl text-[#FBF3EA]'>
                    Notes from the workshop
                </h2>
                <p className='relative text-[#D8C7BC] text-xs md:text-sm max-w-md leading-relaxed'>
                    Recipes, techniques and the occasional mistake — everything we
                    learn while baking, written down so you can bake it too.
                </p>
            </div>

            {/* Category filters */}
            <div className='flex justify-center p-4 items-center'>
                <div className='flex flex-wrap gap-2 justify-center'>
                    {blogCat.map((blog) => {
                        const slug = blog.name.toLowerCase();
                        const active = category === slug;

                        return (
                            <button
                                key={blog.id}
                                onClick={() => navigate(`/blog?category=${encodeURIComponent(slug)}`)}
                                className={`rounded-full text-sm px-3 py-1.5 border transition-colors duration-200 cursor-pointer
                                    ${active
                                        ? "bg-[#6B2737] border-[#6B2737] text-[#FBF3EA]"
                                        : "border-[#D9CFC3] text-[#4A3B35] hover:border-[#C89B3C] hover:text-[#6B2737]"
                                    }`}
                            >
                                {blog.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Posts */}
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5 px-2 md:px-4 pb-8'>
                {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className='animate-pulse rounded-xl border border-[#EDE3D7] overflow-hidden'
                        >
                            <div className='h-36 bg-[#EDE3D7]' />
                            <div className='p-4 space-y-2'>
                                <div className='h-3 w-1/3 bg-[#EDE3D7] rounded' />
                                <div className='h-4 w-4/5 bg-[#EDE3D7] rounded' />
                                <div className='h-3 w-full bg-[#EDE3D7] rounded' />
                                <div className='h-3 w-2/3 bg-[#EDE3D7] rounded' />
                            </div>
                        </div>
                    ))
                    : Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className='rounded-xl border border-[#EDE3D7] overflow-hidden animate-[fadeIn_0.4s_ease-in]'
                        >
                            <div className='h-36 bg-[#E8B4A2]' />
                            <div className='p-4'>
                                <p className='text-xs text-[#C89B3C] mb-1'>
                                    {blogCat.find((b) => b.name.toLowerCase() === category)?.name || "All"}
                                </p>
                                <h3 className='font-serif text-lg mb-2'>Post coming soon</h3>
                                <p className='text-sm text-[#4A3B35] leading-relaxed'>
                                    We're still writing this one. Check back shortly.
                                </p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default Menu;