import React, { useState, ChangeEvent } from "react";
import MyGuiVar from "../myGuiVar.tsx";
import styles from "./input.css";

interface NumberInputProps {
  // onChange: (value: number) => void;
  variable: MyGuiVar;
  textLabel?: string;
  defaultValue?: number | string;
  step?: number | string;
}

const NumberInput = ({
  variable,
  // onChange,
  textLabel = "",
  defaultValue = null,
  step = 0.01,
}: NumberInputProps) => {
  const onChange = (v: number) => {
    variable.setValue(v);
  };

  if (defaultValue === null) {
    defaultValue = variable.value as number;
  }
  const [value, setValue] = useState<string>(defaultValue.toString());

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);

    // Convert to number only if valid
    const numericValue = parseFloat(inputValue);
    if (!isNaN(numericValue)) {
      onChange(numericValue as number);
    } else {
      // Handle invalid input (optional)
      onChange(defaultValue as number); // Fallback to default
    }
  };

  return (
    <div className="textboxs">
      {textLabel}
      <input
        style={{ backgroundColor: "white", color: "black" }}
        type="number"
        step={step.toString()}
        value={value}
        onChange={handleChange}
        onFocus={(e) => e.target.select()}
      />
    </div>
  );
};

export default NumberInput;
