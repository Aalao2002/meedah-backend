import { NavLink } from 'react-router-dom';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import LogoutOutlined from '@mui/icons-material/LogoutOutlined';
import AllInboxOutlinedIcon from '@mui/icons-material/AllInboxOutlined' 
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';


export default function MobileSide(){

    return (
                <>
                        <ul className='flex px-2 items-center justify-center gap-2 bg-gray-50/20 border-gray-200'>
    
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
                    </>
        );
}