import { useState, useEffect, useContext, useRef } from "react";
import { CartContext } from '../contexts/CartProvider'
import { useNavigate } from "react-router-dom";
import { StateContext } from "../contexts/ContextProvider";

const API_URL = import.meta.env.VITE_API_URL;

export default function Checkout(){

  const { token, setUser, user } = useContext(StateContext);
  const { cart, setCart, total } = useContext(CartContext);
  const [readonly, setReadOnly] = useState(false);
  const [ formData, setFormData ] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: "",
  });

  const navigate = useNavigate();
  const hasFetched = useRef(false);
  useEffect(() => {
    if(!token || hasFetched.current) return;
    hasFetched.current = true;
    const getUser = async () => {
      try{
        const res = await fetch(`${API_URL}/user`,{
            method: "GET",
            headers: { Authorization: `Bearer ${token}`, 'Accept' : 'application/json' },
        })
        const data = await res.json()
        if(!res.ok) {throw new Error(data.message || "invalid request")}
        setUser(data.user);
      } catch(err) { console.error(err); }
    }
    getUser();
  },[token])

  useEffect(() => {
    if(user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        address: user.address || "",
        phone: user.phone || "",
      })
    }
  },[user])

  async function saveOrder (reference, orderDetails) {
    try {
      const headers = {
        "Content-Type" : "application/json",
        "Accept" : "application/json",
       ...(token && {"Authorization" : `Bearer ${token}`})
      };

      const res = await fetch(`${API_URL}/payment/verify`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({ 
            payment_reference: reference,
            ...orderDetails }),
      })
      
      if (!res.ok) {
        const errorMssg = await res.json();
        throw new Error(errorMssg.message || JSON.stringify(errorMssg.errors))
      }
      const data = await res.json();

      navigate(`/orders/${data.order_id}`);
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
  }

  function handleCheckout(e) {
    e.preventDefault();

    const firstName = user? user.firstName : formData.firstName;
    const lastName = user? user.lastName : formData.lastName;
    const phone = formData.phone;
    const customerEmail = user? user.email : formData.email;

    const orderDetails = {
      firstName,
      lastName,
      email: customerEmail,
      phone,
      address: formData.address,
      order_items: cart,
      total,
      user_id: user? user.id : null,
    }
    console.log(orderDetails)
    const handler = PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: customerEmail, 
        amount: total * 100,
        currency: "NGN",
        ref: `MC-${Date.now()}`,
        onClose: () => {
            console.log("Payment window closed.");
        },
        callback: (response) => {
            saveOrder(response.reference, orderDetails);
            setCart([]);
            localStorage.removeItem("cart");
        }
    });

    handler.openIframe();
  }

  function guestChange(e) {
    setFormData({...formData, [e.target.name] : e.target.value})
  }

  function goToLogin() {
    navigate('/auth?=/checkout');
  }

  return (
    <div>
      <div className="flex max-w-[900px] mx-auto lg:px-2 px-8 gap-4 flex-col my-5">
        <div>
            <h2 className="text-lg font-semibold">Checkout</h2>
            {!token && <p className="text-sm">Choose how you'd like to checkout.</p>}
        </div>

        {/* Guest section */}
        {!token && (
          <div className="max-w-550 p-4 border border-gray-100 shadow-md rounded-lg flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-medium">Already have an account?</p>
              <p className="text-xs text-gray-500 mt-1">Log in to check out faster with your saved details.</p>
            </div>
            <button
              type="button"
              onClick={goToLogin}
              className="text-sm font-semibold text-white bg-[#000] rounded-md px-5 py-2 whitespace-nowrap"
            >
              Login to continue
            </button>
          </div>
        )}

        <div className="max-w-550 p-4 border border-gray-100 shadow-md rounded-lg">
          <form onSubmit={handleCheckout} className="flex flex-col gap-2">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col">
                <label className="text-sm" htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" className="border border-gray-200 p-2 rounded-lg"
                 value={formData.firstName} readOnly={token && !readonly}
                  onChange={guestChange} required/>
              </div>
              <div className="flex flex-col">
                <label className="text-sm" htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" className="border border-gray-200 p-2 rounded-lg"
                 value={formData.lastName} readOnly={token && !readonly} onChange={guestChange} required/>
              </div>
            </div>

            <label htmlFor="email" className="text-sm">Email</label>
            <input type="email" name="email" className="border border-gray-200 rounded-lg p-2" 
            value={formData.email} onChange={guestChange} id="email" readOnly={token && !readonly} required/>

            <label htmlFor="phone" className="text-sm">Phone</label>
            <input type="text" name="phone" className="border border-gray-200 rounded-lg p-2" 
            value={formData.phone} onChange={guestChange} id="phone" required/>

            <label htmlFor="address" className="text-sm">Address</label>
            <textarea name="address" required onChange={guestChange} 
            value={formData.address} className="h-30 resize-none p-2 rounded-lg border text-sm border-gray-200" id="address"/>

              <div>
                <button type="submit"
                className="bg-[#000] text-white p-2 text-sm rounded-md">Place Order</button>
              </div>
          </form>
        </div>
      </div>
    </div>
  );
}