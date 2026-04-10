export default function InputField({ label, type = 'text', name, placeholder, value, onChange }) {
  return (
    <label className="block text-sm">
      <div className="mb-1 font-medium">{label}</div>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}          // ← ini penting
        onChange={onChange}    // ← ini juga penting
        className="w-full border p-2 rounded-md"
      />
    </label>
  );
}
