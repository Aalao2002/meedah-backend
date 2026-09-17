import { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom'
import { StateContext } from "../contexts/ContextProvider";
import { ArrowLeft } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL;

export default function AddProducts({ onCreated } = {}) {
  const { token } = useContext(StateContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
  });

  const [sizes, setSizes] = useState([
    { value: "", label: "", available: true, price: "", originalPrice: "" },
  ]);
  const [colors, setColors] = useState([{ value: "", name: "", hex: "#000000" }]);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);


  const updateField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const updateSize = (index, field, value) => {
    setSizes((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };
  const addSize = () =>
    setSizes((prev) => [
      ...prev,
      { value: "", label: "", available: true, price: "", originalPrice: "" },
    ]);
  const removeSize = (index) =>
    setSizes((prev) => prev.filter((_, i) => i !== index));

  const updateColor = (index, field, value) => {
    setColors((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };
  const addColor = () =>
    setColors((prev) => [...prev, { value: "", name: "", hex: "#000000" }]);
  const removeColor = (index) =>
    setColors((prev) => prev.filter((_, i) => i !== index));

  const effectivePrice = (size) =>
    size.price !== "" && size.price != null ? size.price : form.price;

  const effectiveOriginalPrice = (size) =>
    size.originalPrice !== "" && size.originalPrice != null
      ? size.originalPrice
      : form.originalPrice;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  async function uploadImageToCloudinary() {
    const sigRes = await fetch(`${API_BASE}/cloudinary/signature`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!sigRes.ok) throw new Error("Could not get upload signature");
    const { signature, timestamp, api_key, cloud_name, folder } = await sigRes.json();


    const uploadData = new FormData();
    uploadData.append("file", imageFile);
    uploadData.append("api_key", api_key);
    uploadData.append("timestamp", timestamp);
    uploadData.append("signature", signature);
    uploadData.append("folder", folder);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      { method: "POST", body: uploadData }
    );
    if (!uploadRes.ok) throw new Error("Image upload to Cloudinary failed");
    const uploaded = await uploadRes.json();

    return { url: uploaded.secure_url, publicId: uploaded.public_id };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!imageFile) {
      setError("Please choose a product image.");
      return;
    }

    try {
      setUploading(true);
      const { url, publicId } = await uploadImageToCloudinary();
      setUploading(false);

      setSubmitting(true);
      const payload = {
        name: form.name,
        description: form.description || null,
        price: Number(form.price),
        original_price: form.originalPrice ? Number(form.originalPrice) : null,
        image_url: url,
        image_public_id: publicId,
        sizes: sizes
          .filter((s) => s.value && s.label)
          .map((s) => ({
            value: s.value,
            label: s.label,
            available: s.available,
          
            price: Number(effectivePrice(s)),
            original_price:
              effectiveOriginalPrice(s) !== "" && effectiveOriginalPrice(s) != null
                ? Number(effectiveOriginalPrice(s))
                : null,
          })),
        colors: colors.filter((c) => c.value && c.name && c.hex),
        is_active: true,
      };

      const res = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Failed to create product");
      }

      const created = await res.json();
      onCreated?.(created);

      // reset form
      setForm({ name: "", description: "", price: "", originalPrice: "" });
      setSizes([{ value: "", label: "", available: true, price: "", originalPrice: "" }]);
      setColors([{ value: "", name: "", hex: "#000000" }]);
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  const busy = uploading || submitting;

  return (
    <form onSubmit={handleSubmit}  className="max-w-lg mx-auto
    rounded-xl shadow-md border border-gray-100 p-6 space-y-6">
      <div className='md:hidden'>
        <button onClick={() => navigate("/admin")} className='hover:underline flex items-center text-sm gap-1'><ArrowLeft size={14} />back</button>
        </div>
      <h1 className="text-2xl font-serif">Add product</h1>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded p-3">
          {error}
        </p>
      )}

      {/* Basic fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Base price (NGN)
            </label>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <p className="text-xs text-gray-400 mt-1">
              Used for any size that doesn't have its own price below.
            </p>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Base original price (optional)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.originalPrice}
              onChange={(e) => updateField("originalPrice", e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-medium mb-1">Product image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-3 w-32 h-32 object-cover rounded border"
          />
        )}
      </div>

      {/* Sizes */}
      <div className="overflow-x-auto">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Sizes</label>
          <button
            type="button"
            onClick={addSize}
            className="text-sm text-blue-600"
          >
            + Add size
          </button>
        </div>
        <div className="space-y-2">
          {sizes.map((size, i) => (
            <div key={i} className="border rounded p-2 space-y-2">
              <div className="flex gap-2 items-center flex-wrap">
                <input
                  placeholder="value (e.g. sm)"
                  value={size.value}
                  onChange={(e) => updateSize(i, "value", e.target.value)}
                  className="border rounded px-2 py-1 w-24 text-sm"
                />
                <input
                  placeholder="label (e.g. Small)"
                  value={size.label}
                  onChange={(e) => updateSize(i, "label", e.target.value)}
                  className="border rounded px-2 py-1 flex-1 text-sm"
                />
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={size.available}
                    onChange={(e) => updateSize(i, "available", e.target.checked)}
                  />
                  In stock
                </label>
                {sizes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSize(i)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="flex gap-2 items-center flex-wrap">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={`Price (default ₦${form.price || 0})`}
                  value={size.price}
                  onChange={(e) => updateSize(i, "price", e.target.value)}
                  className="border rounded px-2 py-1 w-40 text-sm"
                />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Original price (optional)"
                  value={size.originalPrice}
                  onChange={(e) => updateSize(i, "originalPrice", e.target.value)}
                  className="border rounded px-2 py-1 w-44 text-sm"
                />
                <span className="text-xs text-gray-500">
                  Effective: ₦{Number(effectivePrice(size) || 0).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="overflow-x-auto">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Colours</label>
          <button
            type="button"
            onClick={addColor}
            className="text-sm text-blue-600"
          >
            + Add colour
          </button>
        </div>
        <div className="space-y-2">
          {colors.map((color, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                placeholder="value (e.g. red)"
                value={color.value}
                onChange={(e) => updateColor(i, "value", e.target.value)}
                className="border rounded px-2 py-1 w-24 text-sm"
              />
              <input
                placeholder="name (e.g. Red)"
                value={color.name}
                onChange={(e) => updateColor(i, "name", e.target.value)}
                className="border rounded px-2 py-1 flex-1 text-sm"
              />
              <input
                type="color"
                value={color.hex}
                onChange={(e) => updateColor(i, "hex", e.target.value)}
                className="w-9 h-9 border rounded"
              />
              {colors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeColor(i)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={busy}
        className="w-full bg-black text-white py-3 rounded-md font-medium disabled:opacity-50"
      >
        {uploading ? "Uploading image..." : submitting ? "Saving..." : "Create product"}
      </button>
    </form>
  );
}