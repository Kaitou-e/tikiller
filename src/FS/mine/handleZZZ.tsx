import React from "react";
import {
  getColNames,
  excelColumnToIndex,
  getMultiColNum,
} from "./utilities.tsx";
import MultiSelectBox from "./inputs/multiSelect2.tsx";
import MyGuiVar from "./myGuiVar.tsx";

function handleZZZ(
  data: any[][], // the spreadsheet data in 2d array
  showDialog: (
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) => void
) {
  let res = new MyGuiVar([" "]);

  const items = getColNames(data, false);

  console.log(data);

  function onClick() {
    try {
      console.log("selected col", res.value);
      // if ( typeof res.value !== 'string[]') return;
      const rrr = res.value as string[];
      const colSelect = rrr
        .map((i) => excelColumnToIndex(i))
        .filter((value) => value !== null);
      console.log("col index", colSelect);
      const arr = getMultiColNum(data, colSelect);
      console.log(arr);
      const result = arr.flat().reduce((acc, curr) => acc + curr, 0);

      return (
        <div className="textboxs">
          The sum of all selected columns is {result}.
        </div>
      );
    } catch (e) {
      console.log("ERROR", e);
      return "Data error.";
    }
  }

  showDialog(
    <div>
      <h3>OG Player ? TTTTHere? </h3>
      <h2>Multi-Select Box</h2>
      <MultiSelectBox items={items} defaultRowCount={4} variable={res} />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(onClick(), "ok");
    }
  );
}

export default handleZZZ;
