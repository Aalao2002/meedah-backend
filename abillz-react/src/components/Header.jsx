import React, { useState, useEffect, useRef, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { CartContext } from '../contexts/CartProvider';

function Header() {
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const { cart } = useContext(CartContext);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const handleClickOutisde = (e) => {
            if(open && menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("click",handleClickOutisde);

        return () => {
            document.removeEventListener("click",handleClickOutisde)
        }
    },[open]);
    const cartCount = cart.reduce((total, item) => {
        return total + item.quantity 
    },0);
    
    return (
        <header className='sticky bg-gray-100/10 top-0 backdrop-blur-md left-0 right-0 flex z-50 border-b border-gray-100  items-center p-4 justify-between shadow-xs  w-full'>
            {/**** logo *****/}
            <div>
                <h2 className='text-xl font-bold text-gray-800/60'>Meedah <span className='text-pink-300'>Cakes</span></h2>
            </div>

            {/****navlinks mobile*****/}
            {open && <ul className='absolute md:hidden z-50  p-2 top-15 left-0 right-0 
            flex-col bg-gray-100 flex gap-1'>
                <li><NavLink to="/shop" className={({ isActive }) =>
                `p-2 rounded-md transition-all duration-500 hover:bg-gray-200 font-semibold text-sm flex ${
                isActive ? 'bg-gray-200' : ''}`}>Shop</NavLink></li>
                <li><NavLink className={({ isActive }) =>
                `p-2 rounded-md transition-all duration-500 hover:bg-gray-200 font-semibold text-sm flex ${
                isActive ? 'bg-gray-200' : ''}`}  to={"/blog"}>Blog</NavLink></li>
                <li><NavLink className={({ isActive }) =>
                `p-2 rounded-md transition-all duration-500 hover:bg-gray-200 font-semibold text-sm flex ${
                isActive ? 'bg-gray-200' : ''}`} to={"/about"}>About</NavLink></li>
                <li><NavLink className={({ isActive }) =>
                `p-2 rounded-md transition-all duration-500 hover:bg-gray-200 font-semibold text-sm flex ${
                isActive ? 'bg-gray-200' : ''}`} to={"/contact"}>Contact Us</NavLink></li>
            </ul>}

            {/**** navlinks desktop ***/}
            <ul className='hidden md:flex gap-2 transition-all duration-500'>
                <li className='font-semibold text-sm'><NavLink to={"/shop"}>Shop</NavLink></li>
                <li className='font-semibold text-sm'><NavLink to={"/blog"}>Blog</NavLink></li>
                <li className='font-semibold text-sm'><NavLink to={"/about"}>About</NavLink></li>
                <li className='font-semibold text-sm'><NavLink to={"/contact"}>Contact Us</NavLink></li>
            </ul>
            {/***** icons *****/}
            <div className='flex items-center gap-2'>
                <div ref={menuRef} className='md:hidden'>
                    <MenuOutlinedIcon  className='font-semibold border border-gray-200 rounded-md cursor-pointer' 
                    onClick={() => setOpen(!open)} sx={{fontSize: 19,color: 'gray'}} />
                </div>
                    <div>
                    <ShoppingBagOutlinedIcon onClick={() =>navigate('/cart')} className='border border-gray-200 rounded-md relative cursor-pointer' 
                    sx={{fontSize: 19, color: 'gray'}} />
                    <div className='absolute w-3 h-4 text-center top-4 right-3 font-semibold text-white 
                    bg-pink-300  text-[10px] rounded-full'>{cartCount}</div>
                    </div>
            </div>
        </header>
    );
}

export default Header;