import React from 'react';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import YouTubeIcon from '@mui/icons-material/YouTube';
import XIcon from '@mui/icons-material/X';
import { NavLink } from 'react-router-dom';


function Footer() {
    return (
        <footer className='flex  gap-16 border-t border-[#000]/20 bg-gray-100/10  p-4 items-center flex-col'>
            {/****first footer section */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                    <h3 className='font-semibold text-lg pb-2 md:text-md text-[#000]/80'>Meedah</h3>
                    <p className='text-sm'>Your go-to cake marketplace for delicious treats. Discover beautifully
                        crafted cakes, made with quality ingredients and perfect for every celebration
                        and special moment.

                    </p>
                    <div className='flex items-center py-2 gap-2'>
                        <div><InstagramIcon sx={{fontSize: 15}}/></div>
                        <NavLink to={"https://facebook.com/profile/"}><FacebookOutlinedIcon sx={{fontSize: 15}} /></NavLink>
                        <div><Xicon sx={{fontSize: 13}} /></div>
                        <div><YoutubeIcon sx={{fontSize: 17}} /></div>

                    </div>
                </div>

                {/*** second footer section */}
                <div>
                    <h2 className='font-bold py-2'>Quick Links</h2>
                    <ul>
                        <li><NavLink to={"/"} className="text-sm text-[#000]/40 font-semibold">Home</NavLink></li>
                        <li><NavLink to={"/about"} className="text-sm text-[#000]/40 font-semibold">About</NavLink></li>
                        <li><NavLink to={"/contact"} className="text-sm text-[#000]/40 font-semibold">Contact Us</NavLink></li>
                        <li><NavLink to={"/blog"} className="text-sm text-[#000]/40 font-semibold">Blog</NavLink></li>
                    </ul>
                </div>

                {/***third footer section */}
                <div>
                    <h2 className='font-bold py-2'>Customer Service</h2>
                    <ul>
                        <li><NavLink className="text-sm text-[#000]/40 font-semibold">Shipping Information</NavLink></li>
                        <li><NavLink className="text-sm text-[#000]/40 font-semibold">Returns & Exchanges</NavLink></li>
                        <li><NavLink className="text-sm text-[#000]/40 font-semibold">FAQ</NavLink></li>
                    </ul>
                </div>

                {/**fourth footer section */}
                <div>
                    <h2 className='font-bold py-2'>Contact</h2>
                    <ul>
                        <li className="text-sm text-[#000]/40 font-semibold">Email: support@meedahcakes.com</li>
                        <li className="text-sm text-[#000]/40 font-semibold">Phone: +1 (666) 123-4567</li>
                        <li className="text-sm text-[#000]/40 font-semibold">Address: 123 Market Street, Ilorin, Nigeria</li>
                    </ul>
                </div>


            </div>

        </footer>
    );
}

export default Footer;
