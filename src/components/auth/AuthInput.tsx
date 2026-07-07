"use client";

export default function AuthInput({
  autoComplete,
  id,
  label,
  onChange,
  placeholder,
  type,
  value,
}: {
  autoComplete: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  type: string;
  value: string;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-14 rounded-[1.35rem] border border-white/[0.06] bg-white/[0.10] px-5 text-base font-semibold text-white outline-none transition placeholder:text-white/45 focus:border-teal-300/40 focus:bg-white/[0.13] focus:ring-4 focus:ring-teal-400/10"
      />
    </div>
  );
}
