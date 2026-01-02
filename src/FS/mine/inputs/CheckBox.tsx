import React, { useState, ChangeEvent } from "react";
import MyGuiVar from "../myGuiVar.tsx";
import styles from './CheckBox.module.css';

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
    <div className="textboxs" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleCheckboxChange}
        className={`${styles.customCheckbox} ${checked ? styles.customCheckboxChecked : ''}`}
        style={{
          appearance: "none",
          width: "18px",
          height: "18px",
          backgroundColor: "white",
          border: "1px solid black",
          borderRadius: "3px",
          cursor: "pointer",
          position: "relative",
          // marginRight: "3px"
        }}
      />
      <span>{textLabel}</span>
    </div>
  );
};

export default CheckBox;
