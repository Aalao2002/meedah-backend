import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { StateContext } from '../../contexts/ContextProvider';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import AllInboxOutlinedIcon from '@mui/icons-material/AllInboxOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import LogoutOutlined from '@mui/icons-material/LogoutOutlined';

function Sidebar() {
    const { token, setToken, setUser } = useContext(StateContext);

    async function handleLogout() {
        try {
            await fetch('http://localhost:8000/api/logout', {
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

                        <li><NavLink to={"/admin"} end
                            className={({isActive}) => `${isActive ? 'bg-gray-100': '' } font-poppins text-sm 
                            font-semibold text-[#000]/70 gap-2 items-center transition-all duration-400 hover:bg-gray-100 flex p-2 rounded-md`}>
                            <DashboardOutlined sx={{fontSize: 20}} />Dashboard</NavLink>
                        </li>

                        <li><NavLink to={"/admin/orders"}
                            className={({isActive}) => `${isActive ? 'bg-gray-100': '' } font-poppins text-sm
                             font-semibold text-[#000]/70 gap-2 items-center transition-all duration-400 hover:bg-gray-100 flex p-2 rounded-md`}>
                            <AllInboxOutlinedIcon  sx={{fontSize: 20}}/> Orders</NavLink>
                        </li>

                        <li><NavLink to={"/admin/add-products"}
                            className={({isActive}) => `${isActive ? 'bg-gray-100': '' } font-poppins text-sm
                             font-semibold text-[#000]/70 gap-2 items-center transition-all duration-400 hover:bg-gray-100 flex p-2 rounded-md`}>
                            <Inventory2Outlined sx={{fontSize: 20}} /> Products</NavLink>
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