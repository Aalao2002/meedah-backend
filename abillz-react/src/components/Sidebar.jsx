import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { StateContext } from '../contexts/ContextProvider';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import LogoutOutlined from '@mui/icons-material/LogoutOutlined';
import AllInboxOutlinedIcon from '@mui/icons-material/AllInboxOutlined' 
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';

const API_URL = import.meta.env.VITE_API_URL;

function Sidebar() {
    const { user, token, setToken, setUser } = useContext(StateContext);

    async function handleLogout() {
        try{
            await fetch(`${API_URl}/logout`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
                
            },
        })
        
        setToken(null)
        setUser(null)
        } catch (err) {
            console.error(err);
        }
    }

    return (
            <aside className='border-r flex-col bg-gray-50/20 border-gray-200 h-screen p-2 w-60 hidden md:flex'>
                    <ul className='flex-1 space-y-2'>

                        <li><NavLink to={"/dashboard"} 
                            className={({isActive}) => `${isActive ? 'bg-gray-100': '' } font-poppins text-sm 
                            font-semibold text-[#000]/70 gap-2 items-center transition-all duration-400 hover:bg-gray-100 flex p-2 rounded-md`}>
                            <DashboardOutlined sx={{fontSize: 20}} />Dashboard</NavLink>
                        </li>

                        <li><NavLink to={"/orders"}
                            className={({isActive}) => `${isActive ? 'bg-gray-100': '' } font-poppins text-sm
                             font-semibold text-[#000]/70 gap-2 items-center transition-all duration-400 hover:bg-gray-100 flex p-2 rounded-md`}>
                            <AllInboxOutlinedIcon  sx={{fontSize: 20}}/> Orders</NavLink>
                        </li>

                        <li><NavLink to={"/profile"}
                            className={({isActive}) => `${isActive ? 'bg-gray-100': '' } font-poppins text-sm
                             font-semibold text-[#000]/70 gap-2 items-center transition-all duration-400 hover:bg-gray-100 flex p-2 rounded-md`}>
                            <PersonOutlined sx={{fontSize: 20}} /> Profile</NavLink>
                        </li>

                        <li><NavLink to={"/settings"}
                            className={({isActive}) => `${isActive ? 'bg-gray-100': '' } font-poppins text-sm
                             font-semibold text-[#000]/70 gap-2 items-center transition-all duration-400 hover:bg-gray-100 flex p-2 rounded-md`}>
                            <SettingsOutlined sx={{fontSize: 20}} /> Settings</NavLink>
                        </li>
                    </ul>
                    <div className='flex w-full'>
                        <button onClick={handleLogout}
                        className='hover:bg-gray-100 w-full p-2 transition-all duration-400 font-poppins text-sm font-semibold  gap-2 rounded-md text-red-600 flex items-center text-md' >
                            <LogoutOutlined sx={{fontSize: 20}} />Logout
                        </button>
                    </div>
                </aside>
    );
}

export default Sidebar;