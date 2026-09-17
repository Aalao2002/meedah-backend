import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StateContext } from '../contexts/ContextProvider'
import { Search, ChevronLeft, ChevronRight, Cake, Truck, Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const slides = [
    {
        title: 'Cakes made for the moment',
        subtitle: 'Custom orders, baked fresh, decorated by hand',
        bg: 'from-rose-100 via-rose-50 to-white',
    },
    {
        title: 'Every layer, considered',
        subtitle: 'Wedding tiers, birthday sheets, cupcakes by the dozen',
        bg: 'from-amber-100 via-rose-50 to-white',
    },
    {
        title: 'Say it with sugar',
        subtitle: 'Tell us the occasion, we handle the rest',
        bg: 'from-pink-100 via-rose-50 to-white',
    },
];

const steps = [
    {
        title: 'Tell us the vision',
        description: 'Flavor, size, occasion, and any design ideas you have in mind.',
        icon: Sparkles,
    },
    {
        title: 'We bake and decorate',
        description: 'Made fresh in-house, with updates as your order comes together.',
        icon: Cake,
    },
    {
        title: 'Pickup or delivery',
        description: 'Choose what works, and we will have it ready on time.',
        icon: Truck,
    },
];

function Home() {
    const { token } = useContext(StateContext);
    const navigate = useNavigate();
    const [cakes, setCakes] = useState([]);
    const [activeSlide, setActiveSlide] = useState(0);
    const [search, setSearch] = useState('');
    const [cakesLoading, setCakesLoading] = useState(true);
    const [cakesVisible, setCakesVisible] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const fetchCake = async () => {
            setCakesLoading(true);
            setCakesVisible(false);
            try {
                const res = await fetch(`${API_URL}/products`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Error fetching products");
                if (cancelled) return;
                setCakes(data.slice(0, 5));
            } catch (err) {
                console.error(err);
            } finally {
                if (cancelled) return;
                setCakesLoading(false);
                
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => setCakesVisible(true));
                });
            }
        };

        fetchCake();
        return () => { cancelled = true; };
    }, [token]);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const handleSearch = () => {
        const trimmed = search.trim();
        if (!trimmed) return;
        navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
    }
        }

    const goToSlide = (index) => setActiveSlide(index);
    const nextSlide = () => setActiveSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="max-w-[1100px] mx-auto">
            {/* Hero with slider */}
            <div className="relative rounded-2xl overflow-hidden border border-[#000]/10 shadow-sm">
                <div className={`bg-gradient-to-br ${slides[activeSlide].bg} transition-colors duration-700`}>
                    <div className="grid md:grid-cols-2 gap-8 items-center px-8 md:px-14 py-16 md:py-20">
                        
                        <div>
                            <h1
                                className="text-[#000]/85 text-4xl md:text-5xl leading-tight"
                                style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
                            >
                                {slides[activeSlide].title}
                            </h1>
                            <p className="text-[#000]/50 text-base mt-4 max-w-[38ch]">
                                {slides[activeSlide].subtitle}
                            </p>

                            {/* Search bar */}
                            <div className="mt-8 flex items-center gap-2 bg-white border border-[#000]/10 rounded-full pl-4 pr-2 py-2 max-w-md shadow-sm">
                                <Search size={18} className="text-[#000]/30 shrink-0" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                    placeholder="Search cakes, flavors, occasions"
                                    className="flex-1 text-sm outline-none bg-transparent"
                                />
                                <button 
                                onClick={handleSearch}
                                className="text-xs font-semibold text-white bg-[#000] rounded-full px-4 py-2 whitespace-nowrap">
                                    Search
                                </button>
                            </div>

                            <div className="flex items-center gap-3 mt-6">
                                <button
                                    onClick={() => navigate('/shop')}
                                    className="text-sm font-semibold text-white bg-rose-600 rounded-md px-5 py-3"
                                >
                                    Browse cakes
                                </button>
                                <button
                                    onClick={() => navigate(token ? '/dashboard' : '/auth')}
                                    className="text-sm font-semibold text-[#000]/70 border border-[#000]/15 rounded-md px-5 py-3"
                                >
                                    {token ? 'Dashboard' : 'Sign in'}
                                </button>
                            </div>
                        </div>

                        
                        <div className="hidden md:block">
                            <div className="aspect-[4/3] rounded-xl bg-white/60 border border-[#000]/10 flex items-center justify-center">
                                <Cake size={64} className="text-[#000]/20" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Slider controls */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-sm"
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={18} />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-sm"
                    aria-label="Next slide"
                >
                    <ChevronRight size={18} />
                </button>
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goToSlide(i)}
                            aria-label={`Go to slide ${i + 1}`}
                            className={`h-1.5 rounded-full transition-all ${
                                i === activeSlide ? 'w-6 bg-rose-600' : 'w-1.5 bg-[#000]/20'
                            }`}
                        />
                    ))}
                </div>
            </div>

            
            <div className="mt-16">
                <h2 className="font-semibold text-xl font-poppins text-[#000]/80 mb-8 text-center">
                    From order to pickup
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <div key={step.title} className="border border-[#000]/10 rounded-xl p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-sm font-semibold">
                                        {i + 1}
                                    </div>
                                    <Icon size={20} className="text-[#000]/30" />
                                </div>
                                <h3 className="text-sm font-semibold text-[#000]/80">{step.title}</h3>
                                <p className="text-sm text-[#000]/50 mt-1">{step.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Featured cakes */}
            <div className="mt-16">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold text-xl font-poppins text-[#000]/80 flex items-center gap-2">
                        Popular right now <span role="img" aria-label="fire">🔥</span>
                    </h2>
                    <button onClick={() => navigate('/shop')} className="text-xs font-semibold text-rose-600">
                        View all
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {cakesLoading
                        ? Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={`skeleton-${i}`}
                                className="border border-[#000]/10 rounded-xl shadow-sm overflow-hidden animate-pulse"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <div className="aspect-square bg-rose-100" />
                                <div className="p-3 space-y-2">
                                    <div className="h-3 bg-rose-100 rounded w-3/4" />
                                    <div className="h-3 bg-rose-100 rounded w-1/3" />
                                </div>
                            </div>
                        ))
                        : cakes.map((cake, i) => (
                            <div
                                key={cake.name}
                                className={`border border-[#000]/10 rounded-xl shadow-sm overflow-hidden transition-opacity duration-500 ease-out ${
                                    cakesVisible ? 'opacity-100' : 'opacity-0'
                                }`}
                                style={{ transitionDelay: `${i * 80}ms` }}
                            >
                                <div className="aspect-square bg-rose-50 flex items-center justify-center">
                                    <Cake size={32} className="text-rose-200" />
                                </div>
                                <div className="p-3">
                                    <p className="text-sm text-[#000]/80">{cake.name}</p>
                                    <p className="text-xs text-[#000]/40 mt-1">{cake.price}</p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Testimonial */}
            <div className="mt-16 text-center max-w-2xl mx-auto">
                <p
                    className="text-2xl text-[#000]/70 leading-snug"
                    style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontWeight: 500 }}
                >
                    Every cake we've ordered has looked exactly like the picture we sent, and tasted even better.
                </p>
                <p className="text-sm text-[#000]/40 mt-4">Chidinma O., regular customer</p>
            </div>

            {/* Bottom CTA */}
            <div className="mt-16 mb-10 bg-[#000] rounded-2xl px-8 py-12 text-center">
                <h2
                    className="text-white text-3xl mb-3"
                    style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
                >
                    Ready to order?
                </h2>
                <p className="text-white/50 text-sm mb-6">Create an account to track your order from oven to doorstep</p>
                <button
                    onClick={() => navigate('/auth')}
                    className="text-sm font-semibold text-[#000] bg-white rounded-md px-6 py-3"
                >
                    Create an account
                </button>
            </div>
        </div>
    );
}

export default Home;