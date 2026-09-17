import React, { useContext, useState } from 'react';
import MobileSide from '../components/MobileSide';
import { StateContext } from '../contexts/ContextProvider';

function initials(firstName, lastName) {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
}

function Profile() {
    const { user } = useContext(StateContext);

    const [ bio, setBio ] = useState(
        user.bio || 'Home baker turned small-batch bakery, specialising in custom celebration cakes.'
    );

    function handleSubmit(e) {
        e.preventDefault();
    }

    return (
        <>
            <div className="border p-4 border-[#000]/10 rounded-xl shadow-sm max-w-550">

                <div>
                    <h2 className="font-semibold text-xl font-poppins text-[#000]/80">Profile</h2>
                    <p className="text-sm">Manage your details and info</p>
                </div>
                <div className='flex overflow-x-auto py-2 md:hidden'>
                <MobileSide />
            </div>
            
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                    {/* Profile card */}
                    <div className="border border-[#000]/10 p-4 shadow-sm rounded-xl text-center">
                        <div className="w-20 h-20 rounded-full bg-rose-500 text-white font-poppins text-2xl font-semibold flex items-center justify-center mx-auto">
                            {initials(user.firstName, user.lastName)}
                        </div>
                        <h3 className="font-poppins font-semibold text-sm mt-3 text-[#000]/80">
                            {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-xs text-[#000]/40">Customer</p>
                        <button className="mt-3 w-full p-2 text-xs font-semibold border border-[#000]/10 rounded-md">
                            Change photo
                        </button>
                        <div className="flex justify-around mt-4 pt-4 border-t border-[#000]/10">
                            <div>
                                <p className="font-poppins text-lg font-semibold text-[#000]/80">-</p>
                                <p className="text-xs text-[#000]/40">Orders placed</p>
                            </div>
                            <div>
                                <p className="font-poppins text-lg font-semibold text-[#000]/80">4.9</p>
                                <p className="text-xs text-[#000]/40">Rating</p>
                            </div>
                        </div>
                    </div>

                    {/* Editable info */}
                    <form onSubmit={handleSubmit} className="md:col-span-2 border flex flex-col border-[#000]/10 p-4 shadow-sm rounded-xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex flex-col">
                                <label className="text-xs font-poppins font-semibold" htmlFor="firstname">First Name</label>
                                <input
                                    type="text"
                                    defaultValue={user.firstName}
                                    name="firstname"
                                    readOnly
                                    id="firstname"
                                    className="text-sm border border-gray-200 rounded-md p-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-poppins font-semibold" htmlFor="lastname">Last Name</label>
                                <input
                                    type="text"
                                    defaultValue={user.lastName}
                                    name="lastname"
                                    readOnly
                                    id="lastname"
                                    className="text-sm border border-gray-200 rounded-md p-2"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col mt-3">
                            <label className="text-xs font-poppins font-semibold" htmlFor="bio">bio</label>
                            <textarea
                                id="bio"
                                readOnly
                                name="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={3}
                                className="text-sm border border-gray-200 rounded-md p-2 resize-none"
                            />
                        </div>

                        <div className="mt-3">
                            <button className="p-2 px-3 text-sm text-[#fff] disabled rounded-md bg-[#000]/10">save profile</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Profile;