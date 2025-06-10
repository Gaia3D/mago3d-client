type FieldRowProps<T> = {
  id: string;
  label: string;
  type: 'text' | 'color' | 'number' | 'checkbox' | 'select';
  value: T;
  onChange: (value: T) => void;
  options?: { label: string; value: string }[]; // for select
  min?: number;
  max?: number;
  step?: number;
};

export const FieldRow = <T,>({
   id,
   label,
   type,
   value,
   onChange,
   options,
   min,
   max,
   step,
 }: FieldRowProps<T>) => (
  <div className="form-row">
    <label htmlFor={id}>{label}</label>

    {type === 'select' && Array.isArray(options) ? (
      <select
        id={id}
        value={value as string}
        onChange={e => onChange(e.target.value as T)}
      >
        <option value={undefined} hidden>선택</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ) : type === 'checkbox' ? (
      <input
        id={id}
        type="checkbox"
        checked={value as boolean}
        onChange={e => onChange(e.target.checked as T)}
      />
    ) : (
      <input
        id={id}
        type={type}
        value={value as string | number}
        onChange={e =>
          onChange(
            type === 'number' ? (+e.target.value as T) : (e.target.value as T)
          )
        }
        {...(type === 'number' && { min, max, step })}
      />
    )}
  </div>
);
