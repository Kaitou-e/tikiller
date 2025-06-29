import {  getFlowdata } from "../core";
import WorkbookContext from "../react/src/context";
import { useContext } from "react";
import CustomButton from '../react/src/components/Toolbar/CustomButton.tsx'
import { downloadFile, findMinCoveringSubarray } from './utilities.tsx'

function iconDownload({size=24, color="currentColor", stroke=2, ...props}) {
    // Source:
    // https://github.com/lukeaelder/eldicons/blob/main/icons-react/Arrows/download.js
  return (
      <svg 
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    strokeWidth={stroke}
    stroke={color}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}>
      <path fill="none" stroke="none" d="M0 0h24v24H0z"/>
      <path d="M4 16V17A3 3 0 0 0 7 20L17 20A3 3 0 0 0 20 17V16M12 4V16M8 12L12 16L16 12"/>
  </svg>
  )
}

function arrayToCSV(data: (string | number)[][], delimiter = ','): string {
    console.log(data)
  return data
    .map(row =>
      row
        .map(cell => `"${
            cell.toString().replace(/"/g, '""')
        }"`) // Escape quotes
        .join(delimiter)
    )
    .join('\n');
}

// function downloadCSV(content: string, filename: string): void {
//   const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.href = url;
//   link.download = filename;
//   link.click();
//   URL.revokeObjectURL(url);
// }

// function downloadCSV(content: string, defaultFilename: string): void {
//   const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
//
//   // Handle IE/Edge browsers
//   if (window.navigator && (window.navigator as any).msSaveBlob) {
//     (window.navigator as any).msSaveBlob(blob, defaultFilename);
//     return;
//   }
//
//   // Handle modern browsers
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement('a');
//
//   // Prompt for filename
//   const userFilename = prompt('Enter filename:', defaultFilename);
//   if (!userFilename) return;  // User canceled prompt
//
//   link.href = url;
//   link.download = userFilename;
//   document.body.appendChild(link);  // Required for Firefox
//   link.click();
//   document.body.removeChild(link);
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

function DownloadCSVButton(){
    const tooltip= "Download to CSV"
    const icon= iconDownload({size:24, color:"#202020", stroke:1})
    const key="Download-to-CSV-new-customized-function"
    const { context } =useContext(WorkbookContext);
    const saveCSV= ()=>{
            console.log("Save clicked.")
        const flowdata = getFlowdata(context);
        if (flowdata == null){
            alert("The spreadsheet is empty.");
            return;
        }
        console.log(flowdata)
        const minArray=findMinCoveringSubarray(flowdata)
        console.log(minArray)
        // console.log(minArray[0][0].v)
        if (minArray.length===0) {
            alert("The spreadsheet is empty.");
            return;
        }
        const csvString = arrayToCSV(minArray.map(row =>
                                                    row.map(cell => (cell === null ? "" : cell.v))));
        downloadFile(csvString, 'output.csv');
            console.log("Saved.")
      }
    return (
      <CustomButton 
        key={key}
        tooltip={tooltip}
        icon = {icon}
        onClick={()=>{
            saveCSV();
        }} />
    )
}

export default DownloadCSVButton;

