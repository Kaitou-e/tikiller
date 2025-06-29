import WorkbookContext from "../react/src/context";
import {  getFlowdata } from "../core";
import { useContext } from "react";
import CustomButton from '../react/src/components/Toolbar/CustomButton.tsx'
import { setCellValue } from "../core/src/modules/cell.ts"
import { insertRowOrColumn, deleteRowOrColumn } from '../core/src/api/rowcol.ts'
import * as XLSX from 'xlsx';

function iconLoad({size=24, color="currentColor", stroke=2, ...props}) {
    // Source: Deepseek
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
      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" />
        <path d="M14 2V8H20" />
          <path d="M12 18V12" />
            <path d="M9 15L12 12L15 15" />
  </svg>
  )
}

async function openFileDialog(): Promise<File | null> {
  return new Promise((resolve, reject) => {
    // Create a hidden file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.json,.xls,.xlsx'; // Specify allowed file types
    input.style.position = 'fixed';
    input.style.top = '-1000px'; // Move off-screen
    input.style.left = '-1000px';
    input.style.opacity = '0'; // Ensure it's visually hidden

    // Cleanup function to safely remove the input element
    const cleanup = () => {
      if (document.body.contains(input)) {
        document.body.removeChild(input);
      }
    };

    // Handle file selection or cancellation
    input.addEventListener('change', () => {
      if (input.files && input.files.length > 0) {
        resolve(input.files[0]); // Return the selected file
      } else {
        resolve(null); // No file selected (cancelled)
      }
      cleanup();
    });

    input.addEventListener('error', (error) => {
      reject(error); // Handle errors
      cleanup();
    });

    // Append the input to the DOM and trigger the file dialog
    document.body.appendChild(input);
    input.click();
  });
}
 

// async function openFileDialog(): Promise<File | null> {
//   return new Promise((resolve, reject) => {
//     // Create a hidden file input element
//     const input = document.createElement('input');
//     input.type = 'file';
//     input.accept = '.csv,.json,.xls,.xlsx'; // Specify allowed file types
//
//     // Add a change event listener to handle file selection
//     input.onchange = (event: Event) => {
//       const target = event.target as HTMLInputElement;
//       if (target.files && target.files.length > 0) {
//         resolve(target.files[0]); // Return the selected file
//       } else {
//         resolve(null); // No file selected
//       }
//       document.body.removeChild(input); // Clean up the DOM
//     };
//
//     // Reject the promise if there is an error
//     input.onerror = (error) => {
//       reject(error);
//       document.body.removeChild(input); // Clean up the DOM
//     };
//
//     // Append to the DOM and trigger the click event
//     document.body.appendChild(input);
//     input.click();
//   });
// }
//
//
// async function openFileDialog() {
//   try {
//     const [fileHandle] = await window.showOpenFilePicker({
//       types: [{
//         description: 'Data Files',
//         accept: {
//           'text/csv': ['.csv'],
//           'application/json': ['.json'],
//           'application/vnd.ms-excel': ['.xls'],
//           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
//         }
//       }],
//       multiple: false
//     });
//
//     const file = await fileHandle.getFile();
//     return file;
//   } catch (err) {
//     // if (err.name !== 'AbortError') {
//     //   console.error('File selection failed', err);
//     // }
//     if (err instanceof Error && err.name !== 'AbortError') {
//           console.error('Error:', err.message);
//     }
//
//     return null;
//   }
// }

// Alternative using slice (more efficient)
function removeWrappingQuotesAlt(str: string): string {
  return str.length > 1 && str.startsWith('"') && str.endsWith('"')
    ? str.slice(1, -1)
    : str;
} 

function csvTo2DArray(csvString: string, delimiter = ','): string[][] {
    return csvString
        .trim() // Remove leading/trailing whitespace
        .split('\n') // Split into rows
        .map(row => 
            row
            .split(delimiter) // Split into columns
            .map(cell => removeWrappingQuotesAlt(cell.trim())) // Clean cell whitespace
        );
}

function LoadButton(){
    const tooltip= "Load CSV JSON or XLSX"
    const icon= iconLoad({size:24, color:"#202020", stroke:1})
    const key="Download-to-CSV-new-customized-function"
    const { context, setContext, settings, refs } = useContext(WorkbookContext);
    return (
      <CustomButton 
        key={key}
        tooltip={tooltip}
        icon = {icon}
        onClick={async () => {
                    const file= await openFileDialog()
                    console.log(file)

    const reader = new FileReader();
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    reader.onload = (event) => {
      const fileContent = event.target?.result;
        // console.log(fileContent)
        let data:any[][]
      try {
        if (fileExtension === 'csv') {
          // Parse CSV into 2D array with headers
          data=csvTo2DArray(fileContent as string);
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
          // Parse Excel into 2D array with headers
          const workbook = XLSX.read(fileContent, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          data = XLSX.utils.sheet_to_json(
            workbook.Sheets[sheetName],
            { header: 1 } // Key change for 2D array
          ) as any[][];
        } else if (fileExtension==='json'){
            data=JSON.parse(fileContent as string)
        } else {
          alert('Unsupported file format.');
          return
        }
        console.log(data)
            /// Modify the sheet
                    setContext((draftCtx) => {
                        const d=getFlowdata(draftCtx)
                        const oldWidth=d[0].length
                        const oldHeight=d.length
                        console.log(oldWidth,oldHeight)
                        // setCellValue(draftCtx, 0,0,null, 3333)
                        if (oldWidth>1){
                        deleteRowOrColumn(draftCtx, "column", 1,oldWidth)}
                        if (oldHeight>1){
                        deleteRowOrColumn(draftCtx, "row", 1,oldHeight)}
                        const newWidth=data[0].length
                        const newHeight=data.length
                        console.log(newWidth,newHeight)
                        insertRowOrColumn(draftCtx,"column",0,newWidth,"rightbottom")
                        insertRowOrColumn(draftCtx,"row",0,newHeight,"rightbottom")
                        // setCellValue(draftCtx, 0,0,null, 3333)
                        const d2=getFlowdata(draftCtx)
                        for (let r=0;r<newHeight;r+=1){
                            for (let c=0;c<newWidth;c+=1){
                                try{
                                setCellValue(draftCtx,r,c,null,data[r][c])
                                } catch (error){
                                    d2[r][c]=data[r][c]
                                }
                            }
                        }
                    });
      } catch (error) {
        console.error('Error parsing file:', error);
        alert('Error parsing the file.');
      }
    };

    // Read methods remain unchanged
    if (fileExtension === 'csv' || fileExtension==='json') reader.readAsText(file);
    else reader.readAsBinaryString(file);
        }} />
    )
}

export default LoadButton;

