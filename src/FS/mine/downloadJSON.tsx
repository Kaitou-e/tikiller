import {  getFlowdata } from "../core";
import WorkbookContext from "../react/src/context";
import { useContext } from "react";
import CustomButton from '../react/src/components/Toolbar/CustomButton.tsx'
import { downloadFile, findMinCoveringSubarray } from './utilities.tsx'

function saveIcon({size=24, color="currentColor", stroke=2, ...props}){
    return (
<svg xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24"
    width={size}
    height={size}
fill="none" stroke={color} 
strokeWidth={stroke} 
strokeLinecap="round" strokeLinejoin="round"
    {...props}>
  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
      <polyline points="7 3 7 8 15 8"/>
      </svg>
    )
}


// function downloadJson(content: string, filename: string): void {
//   const blob = new Blob([content], { type: 'text/json;charset=utf-8;' });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.href = url;
//   link.download = filename;
//   link.click();
//   URL.revokeObjectURL(url);
// }
//
// function findMinCoveringSubarray(grid) {
//   let maxRow = -1;
//   let maxCol = -1;
//
//   // Find the farthest non-null element's row and column
//   for (let row = 0; row < grid.length; row++) {
//     for (let col = 0; col < grid[row].length; col++) {
//       if (grid[row][col] !== null) {
//         maxRow = Math.max(maxRow, row);
//         maxCol = Math.max(maxCol, col);
//       }
//     }
//   }
//
//   // Handle all-null case
//   if (maxRow === -1 || maxCol === -1) return [];
//
//   // Slice the grid to the required bounds
//   return grid
//     .slice(0, maxRow + 1)
//     .map(row => row.slice(0, maxCol + 1));
// }

function DownloadJsonButton(){
    const tooltip= "Save to Json"
    const icon= saveIcon({size:24, color:"#202020", stroke:1})
    const key="Download-to-Json-new-customized-function"
    const { context } =useContext(WorkbookContext);
    const saveJson= ()=>{
            console.log("Save clicked.")
        const flowdata = getFlowdata(context);
        // if (flowdata == null) return;
        if (flowdata == null){
            alert("The spreadsheet is empty.");
            return;
        }
        console.log(flowdata)
        const minArray=findMinCoveringSubarray(flowdata)
        console.log(minArray)
        // console.log(minArray[0][0].v)
        // if (minArray.length===0) return
        if (minArray.length===0) {
            alert("The spreadsheet is empty.");
            return;
        }
        const jsonString = JSON.stringify(minArray, null, 2);
        downloadFile(jsonString, 'output.json');
            console.log("Saved.")
      }
    return (
      <CustomButton 
        key={key}
        tooltip={tooltip}
        icon = {icon}
        onClick={()=>{
            saveJson();
        }} />
    )
}

export default DownloadJsonButton;

