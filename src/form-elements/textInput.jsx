import React, { useState, useEffect } from "react";

const delay = 500;

function useDebounce(props) {
  const { value } = props;

  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup the timeout on each value change
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function DebouncedInput(props) {
  const { id, style, value, onChange } = props;

  const [inputValue, setInputValue] = useState(value);
  const debouncedValue = useDebounce({ value: inputValue });

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue]);

  return (
    <input
      id={id}
      type="text"
      className="form-control"
      style={style}
      value={inputValue}
      onChange={handleChange}
    />
  );
}

export default DebouncedInput;
