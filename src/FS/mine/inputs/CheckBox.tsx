import React, { useState, ChangeEvent } from "react";
import MyGuiVar from "../myGuiVar.tsx";

interface CheckTextInputProps {
  // onCheckChange: (checked: boolean) => void;
  variable: MyGuiVar;
  defaultValue?: boolean;
  textLabel?: string;
  // onTextChange: (text: string) => void;
}

const CheckBox = ({
  variable,
  defaultValue = null,
  textLabel = "Checkboxdefault",
}: CheckTextInputProps) => {
  const onChange = (v: boolean) => {
    variable.setValue(v);
  };
  if (defaultValue === null) {
    defaultValue = variable.value as boolean;
  }
  const [checked, setChecked] = useState<boolean>(defaultValue);

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setChecked(isChecked);
    onChange(isChecked);
  };

  return (
    <div className="textboxs">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleCheckboxChange}
      />
      {textLabel}
    </div>
  );
};

export default CheckBox;
