import { useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";

interface DebouncedInputProps {
  value?: string;
  onDebounce: (value: string) => void;
  delay?: number;
  placeholder?: string;
  className?: string;
}

const DebouncedInput = ({
  value = "",
  onDebounce,
  delay = 300,
  placeholder = "",
  className = "",
}: DebouncedInputProps) => {
  const [inputValue, setInputValue] = useState(value);

  const debounced = useMemo(
    () => debounce((val: string) => onDebounce(val), delay),
    [onDebounce, delay]
  );

  useEffect(() => {
    debounced(inputValue);
    return () => {
      debounced.cancel();
    };
  }, [inputValue]);

  return (
    <input
      type="search"
      value={inputValue}
      className={className}
      placeholder={placeholder}
      onChange={(e) => setInputValue(e.target.value)}
    />
  );
};

export default DebouncedInput;
