import React, { useState, ChangeEvent } from 'react';
import MyGuiVar from './myGuiVar.tsx'

interface DropdownSelectionProps {
    variable:MyGuiVar;
  options: string[];
  // onChange: (selectedValue: string) => void;
  defaultValue?: string;
  width?: number;
  textLabel?: string;
}

const DropdownSelection = ({ 
    options=[" "], 
        variable,
    defaultValue=null, width=50,
        textLabel=""
}: DropdownSelectionProps) => {
    // let initValue:string;
    // if (!defaultValue){
    //     initValue=options[0] || '';}
    // else{
    //     initValue=defaultValue;
    // }

  const [selectedValue, setSelectedValue] = useState<string>(
  defaultValue===null?variable.value.toString():defaultValue.toString()
  );

 const onChange=(v: string)=>{
      variable.setValue(v);
  }

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedValue(value);
    onChange(value as string);
  };

  return (
          <div className="textboxs">
              {textLabel}
    <select       value={selectedValue}
          onChange={handleChange}
          style={{
                      width: `${width}px`,
          }}
          >
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select></div>
  );
};

export default DropdownSelection;
 
