import React, { useContext, useEffect, useState } from 'react';
import { StateContext } from '../contexts/ContextProvider';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Cake, ArrowLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;


function Auth() {
    const navigate = useNavigate();
    const { token, setToken, user, setUser, isAdmin } = useContext(StateContext);
    const [isSignup, setIsSignup] = useState(false);
    const [errors, setErrors] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        cfpassword: ""
    });

    useEffect(() => {
        if (token && user) {
            if(user.user_role === "admin"){
                navigate("/admin", { replace: true });
                return;
                
            }
            navigate("/dashboard", { replace: true });
        }
    }, [token, navigate, user, isAdmin]);

    async function handleSubmit(e) {
        e.preventDefault()
        setErrors(null);

        const url = isSignup ? `${API_URL}/signup` : `${API_URL}/login`;
        const body = isSignup ? formData : { email: formData.email, password: formData.password }
        if (isSignup && formData.password !== formData.cfpassword) {
            setErrors("Passwords do not match");
            return;
        }
        const hasEmptyField = Object.values(body).some(val => !val.trim());
        if (hasEmptyField) {
            setErrors("Fields cannot be empty!")
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(body)
            })
            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || data?.errors || data.errors?.email?.[0] || 'request failed')
            }

            setToken(data.token)
            setUser(data.user)
        } catch (err) {
            console.error(err)
            setErrors(err.message)
        } finally {
            setSubmitting(false);
        }
    }

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        const timer = setTimeout(() => { setErrors("") }, 5000)
        return () => clearTimeout(timer)
    }, [errors])

    return (
        <>
        <div className='pl-5 md:hidden'>
            <button onClick={() => navigate("/")} className='hover:underline flex items-center text-sm gap-1'><ArrowLeft size={14} />back</button>
        </div>
        <div className="h-170 md:min-h-screen grid md:grid-cols-2">
            <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-rose-100 
            via-rose-50 to-white p-10">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-[#000] flex items-center justify-center">
                        <Cake size={18} className="text-white" />
                    </div>
                    <span className="font-semibold font-poppins text-[#000]/80">Meedah Cakes</span>
                </div>

                <div>
                    <h1
                        className="text-4xl text-[#000]/85 leading-tight max-w-[16ch]"
                        style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
                    >
                        {isSignup ? 'Every order starts with an account' : 'Welcome back, let\u2019s get baking'}
                    </h1>
                    <p className="text-sm text-[#000]/50 mt-4 max-w-[34ch]">
                        Track your orders from oven to doorstep, save your favorites, and reorder in seconds.
                    </p>
                </div>

                <p className="text-xs text-[#000]/30">&copy; {new Date().getFullYear()} Meedah Cakes</p>
            </div>

            {/* Form panel */}
            <div className="flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-[360px]">
                    <div className="md:hidden flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 rounded-full bg-[#000] flex items-center justify-center">
                            <Cake size={16} className="text-white" />
                        </div>
                        <span className="font-semibold font-poppins text-[#000]/80">Meedah Cakes</span>
                    </div>

                    <h2 className="font-semibold text-2xl font-poppins text-[#000]/80">
                        {isSignup ? 'Create an account' : 'Log in'}
                    </h2>
                    <p className="text-sm text-[#000]/40 mt-1 mb-6">
                        {isSignup ? 'Takes less than a minute' : 'Enter your details to continue'}
                    </p>

                    {errors && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-md px-4 py-3 mb-5">
                            {errors}
                        </div>
                    )}

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        {isSignup && (
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-[#000]/50 mb-1 block">First name</label>
                                    <input
                                        name="firstName"
                                        className="w-full text-sm p-3 rounded-md border border-[#000]/10 
                                        text-[#000]/50 outline-none focus:border-rose-400 transition-colors"
                                        type="text"
                                        value={formData.firstName}
                                        placeholder="Chidinma"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-[#000]/50 mb-1 block">Last name</label>
                                    <input
                                        name="lastName"
                                        className="w-full text-sm p-3 rounded-md text-[#000]/50 border border-[#000]/10 outline-none focus:border-rose-400 transition-colors"
                                        type="text"
                                        value={formData.lastName}
                                        placeholder="Okoye"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="text-xs text-[#000]/50 mb-1 block">Email</label>
                            <input
                                name="email"
                                className="w-full text-sm p-3 text-[#000]/50 rounded-md border border-[#000]/10 outline-none focus:border-rose-400 transition-colors"
                                type="email"
                                value={formData.email}
                                placeholder="you@example.com"
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="text-xs text-[#000]/50 mb-1 block">Password</label>
                            <div className="relative">
                                <input
                                    name="password"
                                    className="w-full text-sm p-3 text-[#000]/50 pr-10 rounded-md border border-[#000]/10 outline-none focus:border-rose-400 transition-colors"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#000]/30"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        {!isSignup && <span
                            className="font-semibold text-rose-600 text-[14px] cursor-pointer"
                            onClick={() => navigate("/auth/forgot-password")}
                        >forgot password</span>}

                        {isSignup && (
                            <div>
                            <label className="text-xs text-[#000]/50 mb-1 block">Confirm Password</label>
                            <div className="relative">
                                <input
                                    name="cfpassword"
                                    className="w-full text-sm p-3 text-[#000]/50 pr-10 rounded-md border border-[#000]/10 outline-none focus:border-rose-400 transition-colors"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.cfpassword}
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#000]/30"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-[#000] text-white text-sm font-semibold rounded-md p-3 mt-2 disabled:opacity-50 transition-opacity"
                        >
                            {submitting ? 'Please wait…' : (isSignup ? 'Create account' : 'Log in')}
                        </button>
                    </form>

                    <p className="text-sm text-[#000]/50 text-center mt-6">
                        {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                        <span
                            className="font-semibold text-rose-600 cursor-pointer"
                            onClick={() => setIsSignup(!isSignup)}
                        >
                            {isSignup ? 'Log in' : 'Sign up'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
        </>
    );
    
}

export default Auth;