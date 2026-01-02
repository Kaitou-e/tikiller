import React, { useState, ChangeEvent } from "react";
import MyGuiVar from "../myGuiVar.tsx";

interface TextInputProps {
  // onChange: (value: string) => void;
  variable: MyGuiVar;
  textLabel?: string;
  defaultValue?: string;
}

const TextInput = ({
  variable,
  textLabel = "",
  defaultValue = null,
}: TextInputProps) => {
  const [value, setValue] = useState<string>(
    // defaultValue.toString()
    defaultValue === null ? variable.value.toString() : defaultValue.toString()
  );

  const onChange = (v: string) => {
    variable.setValue(v);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    onChange(inputValue);
  };

  return (
    <div className="textboxs">
      {textLabel}
      <input
        style={{ backgroundColor: "white", color: "black", border: "1px solid black" }}
        type="string"
        value={value}
        onChange={handleChange}
        onFocus={(e) => e.target.select()}
      />
    </div>
  );
};

export default TextInput;
