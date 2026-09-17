import React, { useContext, useEffect, useState } from 'react';
import { StateContext } from '../contexts/ContextProvider';
import MobileSide from '../components/MobileSide';

const API_URL = import.meta.env.VITE_API_URL;

function Settings() {
    const { user, setUser, token, setToken } = useContext(StateContext);

    const [ formData, setFormData ] = useState({
                                                firstName: '',
                                                lastName: '',
                                                email: '',
                                                phone: ''
                                                });
    
    function handleChange(e){
        setFormData({...formData, [e.target.name] : e.target.value });
    }
    
    async function handleSubmit(e) {
        e.preventDefault();
        try{
            const res = await fetch(`${API_URL}/update`, {
            method: "PUT",
            headers: {
                Authorization:  `Bearer ${token}`,
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(formData)
            })
            const data = await res.json()
            if(!res.ok) {
                throw new Error(data.message || "Update failed" );
            }
            setUser(data.user);

        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() =>  {
    if(!token) return;
    
    const getUser = async () => {
      try{
        const res = await fetch(`${API_URL}/user`,{
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                'Accept' : 'application/json'
            },
        })
        const data = await res.json()

        if(!res.ok) {throw new Error(data.message || "invalid request")}
        setUser(data.user);
      }
     catch(err) {
      console.error(err);
      }
    }
    getUser();
  },[token, setUser])



    useEffect(() => {
        if(user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || ''
 
            });
        }
    },[user]);


        async function handleLogout() {
            try{
                await fetch(`${API_URL}/logout`, {
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
        <>
            <div className="border p-4 border-[#000]/10 rounded-xl shadow-sm max-w-550">
                <div>
                    <h2 className="font-semibold text-xl font-poppins text-[#000]/80">Settings</h2>
                    <p className="text-sm">Manage Your profile, security, and preferences </p>
                </div>
                <div className='flex overflow-x-auto py-2 md:hidden'>
                    <MobileSide />
                </div>
            
                <div className="p-2 mt-5">
                    <form onSubmit={handleSubmit} className="border flex flex-col border-[#000]/10 p-4 shadow-sm rounded-xl">

                        <div className="mb-4">
                            <h2 className="font-poppins text-sm text-[#000]/70 font-bold">Personal Information</h2>
                            <p className="text-xs">update your contact details.</p>
                        </div>

                        <label  className="text-xs font-poppins font-semibold" htmlFor="firstname">First Name</label>
                        <input type="text" value={formData.firstName} onChange={handleChange} name="firstName" 
                        className="text-sm border border-gray-200 rounded-md p-2" id="firstname" placeholder="abillz"
                         required/><br />

                        <label  className="text-xs font-poppins font-semibold" htmlFor="lastname">Last Name</label>
                        <input type="text" value={formData.lastName} name="lastName" onChange={handleChange}
                         id="lastname" className="text-sm border border-gray-200 rounded-md p-2" placeholder="dev"
                          required/><br />

                        <label  className="text-xs font-poppins font-semibold" htmlFor="email">Email</label>
                        <input type="email" value={formData.email} onChange={handleChange} name="email" 
                        readOnly id="email" className="text-sm border border-gray-200 rounded-md p-2"
                         placeholder="aalao2002@gmail.com" required/><br />

                        <label  className="text-xs font-poppins font-semibold" htmlFor="phone">Phone</label>
                        <input type="text" value={formData.phone} name="phone" onChange={handleChange} 
                        className="text-sm border text-[#000]/50 border-gray-200 rounded-md p-2" id="phone" 
                        placeholder="e.g 070...." required/>

                        <div className="mt-2">
                            <button className="p-2 text-sm text-[#fff] rounded-sm bg-[#000]">save profile</button>
                        </div>
                    </form>
                </div>

                {/*******connected accounts*****/}
                <div className="p-2">
                    <div className="rounded-xl bg-[#FFD8B1]/80 flex flex-col gap-2 p-4 border border-red-300 shadow-md">
                        <div className="text-sm text-red-600 font-poppins font-semibold">
                            Danger Zone
                        </div>
                        <div className="text-xs text-[#000]/40">
                            Once you sign out, you will need to log in again to access your account.
                        </div>
                        <div>
                            <button onClick={handleLogout}
                            className="hover:bg-red-700 transition-all duration-300 font-semibold font-fairplay rounded-md bg-red-600 border shadow-sm border-red-700/20 text-[#fff] text-xs p-2">
                            Sign Out
                            </button>
                        </div>
                    </div>
                </div>


            </div>
        </>
    );
}

export default Settings;