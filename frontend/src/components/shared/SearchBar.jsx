export function SearchBar({ value, onChange, placeholder = 'Search mobiles, accessories, services...' }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">S</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field pl-11"
        placeholder={placeholder}
      />
    </div>
  );
}
