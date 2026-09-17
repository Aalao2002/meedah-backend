import React, { useEffect, useState } from 'react';

function Contact() {
    const [ message, setMessage ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [formData, setFormData] = useState({
                                                name: "",
                                                email: "",
                                                message: "",
                                            })
    
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name] : e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        console.log(formData)
        try {
            const res = await fetch('http://172.20.10.4:8000/api/contact',{
                method: "POST",
                headers: {
                    'Accept' : 'application/json',
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json();
            setMessage(data.message);
            setLoading(false);
            setFormData({
                name: '',
                email:'',
                message: '',
            })

        }
        catch (err) {
            setLoading(false);
            console.error(err);
        }
    }
    useEffect(() => {
        const timer = setTimeout(() => {setMessage("")},3000)
        return () => clearTimeout(timer);
    },[message])

    return (
        <div>
            <div className='flex max-w-500 p-4 sm:p-8 my-2 rounded-xl shadow-md flex-col'>
                <div className=''>
                    <h2 className='font-semibold text-2xl py-2'>Let's chat</h2>
                    <p className='text-xs'>Tell us a bit about what you're working
                        on and we'll get back to you within a day or two.
                    </p>
                </div>

                <div className='w-full mt-4'>
                    <form className='w-full' onSubmit={handleSubmit}>
                        <label className='font-poppins text-xs' htmlFor="name">Name</label><br />
                        <input className='w-full bg-gray-100/10 text-[#000]/30 p-2 mt-2 text-sm rounded-lg border border-[#000]/10'
                         type="text" name='name' value={formData.name} onChange={handleChange} id="name" placeholder='abillz dev' required/>

                        <label className='font-poppins text-xs' htmlFor="email">Email</label><br />
                        <input className='w-full bg-gray-100/10 text-[#000]/30 p-2 mt-2 text-sm rounded-lg border border-[#000]/10'
                         type="email" name="email" value={formData.email} onChange={handleChange} id="email" placeholder='abillzdev123@gmail.com' required/>

                        <label className='font-poppins text-xs' htmlFor="message">Message</label><br />
                        <textarea name="message" value={formData.message} onChange={handleChange} className='w-full resize-none h-28 bg-gray-100/10 p-2 mt-2 text-sm rounded-lg border 
                        border-[#000]/10 text-[#000]/30'
                         type="text" id="name" placeholder='what can we help with?' required/>
                        
                        {message && <div className='bg-green-200/20 text-green-300 rounded-lg p-4'>
                            {message}
                        </div>}

                         <div className='flex my-5 justify-between'>
                            <div className='text-[#000]/40 text-sm'>
                                We reply within 1-2 business days.
                            </div>
                            <div>
                                <button className={`text-sm rounded ${loading ? 'bg-[#000]/60' : ''} hover:bg-[#000]/60 py-2 px-4 bg-[#000] text-[#fff]`}>
                                    {loading? 'Sending....' : 'Send message'}</button>
                            </div>
                         </div>
                    </form>
                </div>

            </div>
            
        </div>
    );
}

export default Contact;