import { useState } from "react";
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        const firstError = body.errors ? Object.values(body.errors)[0]?.[0] : null;
        throw new Error(firstError || body.message || "Could not send reset link.");
      }

      
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="max-w-sm mx-auto rounded-xl shadow-md border border-gray-100 p-6 text-center space-y-3">
        <div className='md:hidden'>
          <button onClick={() => navigate("/auth")} className='hover:underline flex items-center text-sm gap-1'><ArrowLeft size={14} />back</button>
          </div>
        <h1 className="text-2xl font-serif">Check your email</h1>
        <p className="text-sm text-gray-500">
          If an account exists for <span className="font-medium">{email}</span>,
          we've sent a link to reset your password.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="text-sm text-blue-600"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto rounded-xl shadow-md border border-gray-100 p-6 space-y-6"
    >
      <div>
        <div className='mt-[-19px] py-4 md:hidden'>
          <button onClick={() => navigate("/auth")} className='hover:underline flex items-center text-sm gap-1'><ArrowLeft size={14} />back</button>
          </div>
        <h1 className="text-2xl font-serif">Forgot password</h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded p-3">
          {error}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          required
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="you@example.com"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-black text-white py-3 rounded-md font-medium disabled:opacity-50"
      >
        {submitting ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}