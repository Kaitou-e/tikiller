export function downloadFile(content: string, defaultFilename: string): void {
  // Determine file type from default filename extension
  const isCSV = defaultFilename.toLowerCase().endsWith(".csv");
  const mimeType = isCSV
    ? "text/csv;charset=utf-8;"
    : "application/json;charset=utf-8;";

  // Create blob with appropriate MIME type
  const blob = new Blob([content], { type: mimeType });

  // Handle IE/Edge browsers
  if (window.navigator && (window.navigator as any).msSaveBlob) {
    (window.navigator as any).msSaveBlob(blob, defaultFilename);
    return;
  }

  // Handle modern browsers
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  // Prompt for filename
  const userFilename = prompt("Enter filename:", defaultFilename);
  if (!userFilename) return; // User canceled prompt

  link.href = url;
  link.download = userFilename;
  document.body.appendChild(link); // Required for Firefox
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getFirstWord(input: string): string {
  if (!input) return "";
  return input.trim().split(/\s+/)[0];
}

export function excelColumnToIndex(columnNameInput: string): number | null {
  const columnName = getFirstWord(columnNameInput);
  let index = 0;
  for (let i = 0; i < columnName.length; i++) {
    const char = columnName.charAt(i);
    if (!/[A-Za-z]/.test(char)) {
      return null;
      // throw new Error(`Invalid character in column name: ${char}`);
    }
    const charValue = char.toUpperCase().charCodeAt(0) - 65;
    index = index * 26 + charValue + 1;
  }
  return index - 1; // Convert to zero-based index
}

function getExcelColumnName(index: number): string {
  let columnName = "";
  while (index >= 0) {
    const remainder = index % 26;
    columnName = String.fromCharCode(65 + remainder) + columnName;
    index = Math.floor(index / 26) - 1;
  }
  return columnName;
}

export function getColNames(data: any[][], emptyItem1: boolean = true) {
  if (!data) return;
  if (data.length === 0) return;
  if (data[0].length === 0) return;

  const W = data[0].length;
  const H = data.length;

  let res: string[] = [];
  if (emptyItem1) res.push(" ");

  for (let x = 0; x < W; x++) {
    let hasData: boolean = false;
    for (let y = 0; y < H; y++) {
      if (!data[y][x]) continue;
      hasData = true;
      break;
    }
    if (hasData) {
      res.push(
        getExcelColumnName(x) +
          " (row1: " +
          (!data[0][x] ? "Null" : data[0][x].v.toString() + ")")
      );
    }
  }
  return res;
}

export function findMinCoveringSubarray(grid) {
  let maxRow = -1;
  let maxCol = -1;

  // Find the farthest non-null element's row and column
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] !== null) {
        maxRow = Math.max(maxRow, row);
        maxCol = Math.max(maxCol, col);
      }
    }
  }

  // Handle all-null case
  if (maxRow === -1 || maxCol === -1) return [];

  // Slice the grid to the required bounds
  return grid.slice(0, maxRow + 1).map((row) => row.slice(0, maxCol + 1));
}

export function toFloat(value: unknown): number | null {
  if (typeof value === "string" || typeof value === "number") {
    const parsed = parseFloat(value.toString());
    return !isNaN(parsed) ? parsed : null;
  }
  return null;
}

export function getValueGrid(data: any[][]): any[][] | null {
  if (!data) return;
  if (data.length === 0) return;
  if (data[0].length === 0) return;

  return data.map((subArray) =>
    subArray.map((obj) => {
      try {
        return obj.v;
      } catch (e) {
        return null;
      }
    })
  );
}

export function getMultiColNum(
  dataInput: any[][],
  cols: number[] = [],
  excludeRowOne: boolean = false,
  allValidNumInOneRow: boolean = true
  // When all cells are valid numbers, the one row of data will be
  // recorded into the res array. If unselected, each subarray in
  // result will contain all valid numbers in that column, while
  // the length of each subarray may vary.
): number[][] {
  console.log(cols);
  if (cols.length === 0) return;
  const data = getValueGrid(dataInput);
  if (!data) return;
  const W = data[0].length;
  const H = data.length;
  // console.log(W,H, data);

  // let res=new Array(cols.length).fill([]);
  let res = new Array(cols.length).fill(null).map(() => []);
  // console.log(res);
  let startingY = excludeRowOne ? 1 : 0;
  for (let y = startingY; y < H; y++) {
    let allNum: boolean = true;
    let row = [];
    for (const x of cols) {
      const v = toFloat(data[y][x]);
      if (!v) allNum = false;
      row.push(v);
    }
    if (allValidNumInOneRow) {
      if (allNum) {
        for (let i = 0; i < cols.length; i++) {
          res[i].push(row[i]);
        }
      }
    } else {
      for (let i = 0; i < cols.length; i++) {
        if (!row[i]) continue;
        res[i].push(row[i]);
      }
    }
  }
  return res as number[][];
}
