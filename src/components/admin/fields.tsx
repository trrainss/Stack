import { cn } from "@/lib/utils";

const inputBase =
  "h-10 w-full border border-[#2a2a2a] bg-[#0d0d0d] px-3 text-sm text-fg outline-none transition-colors duration-300 placeholder:text-[#5f5f5f] focus:border-white/55 focus-visible:outline-none disabled:opacity-60";

export function Field({
  label,
  name,
  defaultValue,
  hint,
  required,
  type = "text",
  placeholder,
  className,
  min,
  max,
  step,
  readOnly,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  hint?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  readOnly?: boolean;
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <label htmlFor={`field-${name}`} className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9a9a9a]">
        {label} {required ? <span aria-hidden="true">*</span> : null}
      </label>
      <input
        id={`field-${name}`}
        name={name}
        type={type}
        defaultValue={defaultValue ?? undefined}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        readOnly={readOnly}
        className={inputBase}
      />
      {hint ? <p className="text-[11px] leading-relaxed text-[#6f6f6f]">{hint}</p> : null}
    </div>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  hint,
  rows = 5,
  required,
  placeholder,
  className,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  hint?: string;
  rows?: number;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <label htmlFor={`field-${name}`} className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9a9a9a]">
        {label} {required ? <span aria-hidden="true">*</span> : null}
      </label>
      <textarea
        id={`field-${name}`}
        name={name}
        defaultValue={defaultValue ?? undefined}
        rows={rows}
        required={required}
        placeholder={placeholder}
        className={cn(inputBase, "h-auto min-h-[96px] resize-y py-2.5 leading-relaxed")}
      />
      {hint ? <p className="text-[11px] leading-relaxed text-[#6f6f6f]">{hint}</p> : null}
    </div>
  );
}

export function SelectField({
  label,
  name,
  defaultValue,
  options,
  hint,
  className,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <label htmlFor={`field-${name}`} className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9a9a9a]">
        {label}
      </label>
      <select id={`field-${name}`} name={name} defaultValue={defaultValue} className={inputBase}>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-[#0d0d0d]">
            {option.label}
          </option>
        ))}
      </select>
      {hint ? <p className="text-[11px] leading-relaxed text-[#6f6f6f]">{hint}</p> : null}
    </div>
  );
}

export function Toggle({
  label,
  name,
  defaultChecked,
  hint,
  value = "on",
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  hint?: string;
  value?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 border border-[#262626] bg-[#0d0d0d] px-3.5 py-3">
      <input
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 accent-[#f5f5f5]"
      />
      <span>
        <span className="block text-sm text-fg">{label}</span>
        {hint ? <span className="mt-1 block text-[11px] leading-relaxed text-[#6f6f6f]">{hint}</span> : null}
      </span>
    </label>
  );
}

export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border border-[#242424] bg-[#0f0f0f]", className)}>
      <div className="border-b border-[#242424] px-5 py-4">
        <h2 className="text-sm font-medium tracking-tight text-fg">{title}</h2>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-[11px] leading-relaxed text-[#7c7c7c]">{description}</p>
        ) : null}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
