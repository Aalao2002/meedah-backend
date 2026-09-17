import React, { useEffect, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { StateContext } from '../contexts/ContextProvider';

function GuestLayout() {
    const {token, user} = useContext(StateContext);
    const navigate = useNavigate();

    useEffect(() => {
            if(token && user) {
                if(user.user_role?.toLowerCase() === "admin") {
                    navigate("/admin", {replace: true});
                } else {
                    navigate("/dashboard", {replace: true});
                }
            }
        },[token, user, navigate]);

        if(token) return null;
        
    return (
        <div className='max-w-[1080px] mx-auto min-h-screen flex flex-col'>
            <Header />
                <main className='flex-1 px-2 py-2'>
                    <Outlet />
                </main>
            <Footer />
        </div>
    );
}

export default GuestLayout;