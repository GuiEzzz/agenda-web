type FloatingInputProps = {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
  };
  
  export default function FloatingInput({ label, value, onChange, type = 'text', required = false }: FloatingInputProps) {
    const inputId = label.toLowerCase().replace(/\s+/g, '-');
  
    return (
      <div className="relative mb-6">
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder=" "
          className="peer w-full border border-gray-300 rounded px-3 pt-8 pb-1 text-sm focus:border-gray-900 focus:ring-2 focus:ring-gray-500"
        />
        <label
          htmlFor={inputId}
          className="absolute text-gray-500 text-sm left-3 top-3 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-3 peer-focus:text-sm peer-focus:text-gray-500"
        >
          {label}
        </label>
      </div>
    );
  }
  