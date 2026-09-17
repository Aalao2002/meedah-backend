import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'


function Notfound() {
    const navigate = useNavigate();
    return (
        <div className='flex items-center justify-center'>
            <div className='flex gap-3 items-center flex-col'>
                <h2 className='font-semibold text-center text-3xl mt-60 text-gray-400'>
                     404 - Page not found.</h2>
                <p className='text-center'>This page you're looking for does not exist, it might have been moved.</p>
                <div>
                    <button className="border border-black hover:scale-110 text-sm transition-all duration-400 
                    flex items-center justify-center bg-[#000] p-2 text-xs rounded-md text-[#fff]"
                     onClick={() => navigate("/")}>
                    <span><HomeOutlinedIcon sx={{fontSize: 16}}/></span>Home</button>
                </div>
                
            </div>
            
        </div>
    );
}

export default Notfound;