import React, { useState } from 'react';
import MyGuiVar from './myGuiVar.tsx';

interface MultiSelectBoxProps {
  items: string[];
  defaultRowCount?: number;
  width?: number;
  variable:MyGuiVar;
  // onSelectionChange: (selectedItems: string[]) => void;
}

function ensureLength(arr: string[], len:number) {
    const filler='\u200B';
      return Array.from({ length: len}, (_, i) => arr[i] || filler.repeat(i+1));
}

const MultiSelectBox: React.FC<MultiSelectBoxProps> = ({
  items,
  defaultRowCount = 5,
  width=300,
  variable,
  // onSelectionChange
}) => {
  if (items.length<defaultRowCount){
      items=ensureLength(items, defaultRowCount);
  }
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);

  const onSelectionChange=(newSelectedItems: string[])=>{
        variable.setValue(newSelectedItems);
  }
  
  const handleItemClick = (index: number, event: React.MouseEvent) => {
    let newSelectedItems = [...selectedItems];

    if (event.ctrlKey) {
      // Ctrl-click: Toggle selection
      const item = items[index];
      if (newSelectedItems.includes(item)) {
        newSelectedItems = newSelectedItems.filter((i) => i !== item);
      } else {
        newSelectedItems.push(item);
      }
    } else if (event.shiftKey && lastSelectedIndex !== null) {
      // Shift-click: Select range
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      const rangeItems = items.slice(start, end + 1);
      newSelectedItems = Array.from(new Set([...newSelectedItems, ...rangeItems]));
    } else {
      // Regular click: Select single item
      const item = items[index];
      // if (newSelectedItems.includes(item)) {
      //   newSelectedItems = newSelectedItems.filter((i) => i !== item);
      // } else {
        newSelectedItems = [item];
      // }
    }

    setLastSelectedIndex(index);
    setSelectedItems(newSelectedItems);
    onSelectionChange(newSelectedItems);
  };

  return (
    <div
      style={{
        border: '0px solid #000000',
        borderRadius: '4px',
        overflowY: 'auto',
        maxHeight: `${defaultRowCount * 30}px`, // Adjust height based on row count
        width: `${width}px`,
        padding: '2px',
        // borderColor: '#777777'
      }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          onClick={(event) => handleItemClick(index, event)}
          style={{
            padding: '0px',
            cursor: 'pointer',
            backgroundColor: selectedItems.includes(item) ? '#007BFF' : '#242424',
            color: '#ffffff',
                // selectedItems.includes(item) ? '#fff' : '#000',
            borderBottom: '1px solid #eee',
        borderColor: '#777777'
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default MultiSelectBox;
 
