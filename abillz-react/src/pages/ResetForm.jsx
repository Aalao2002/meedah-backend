import { useState } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;

export default function ResetForm() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        const firstError = body.errors ? Object.values(body.errors)[0]?.[0] : null;
        throw new Error(
          firstError || body.message || "Could not reset password. The link may have expired."
        );
      }

      setSuccess(true);
      setTimeout(() => navigate("/auth"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="max-w-sm mx-auto rounded-xl shadow-md border border-gray-100 p-6 text-center space-y-3">
        <h1 className="text-2xl font-serif">Invalid link</h1>
        <p className="text-sm text-gray-500">
          This password reset link is missing required info. Please request a new one.
        </p>
        <Link to="/auth/forgot-password" className="text-sm text-blue-600">
          Request a new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-sm mx-auto rounded-xl shadow-md border border-gray-100 p-6 text-center space-y-3">
        <h1 className="text-2xl font-serif">Password reset</h1>
        <p className="text-sm text-gray-500">
          Your password has been updated. Redirecting you to sign in...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto rounded-xl shadow-md border border-gray-100 p-6 space-y-6"
    >
      <div>
        <h1 className="text-2xl font-serif">Reset password</h1>
        <p className="text-sm text-gray-500 mt-1">
          Setting a new password for{" "}
          <span className="font-medium">{email}</span>
        </p>
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded p-3">
          {error}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">New password</label>
        <input
          required
          type="password"
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Confirm new password</label>
        <input
          required
          type="password"
          minLength={8}
          autoComplete="new-password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-black text-white py-3 rounded-md font-medium disabled:opacity-50"
      >
        {submitting ? "Resetting..." : "Reset password"}
      </button>
    </form>
  );
}