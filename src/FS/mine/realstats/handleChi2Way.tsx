import {
  getColNames,
  excelColumnToIndex,
  getValueGrid,
  getMultiColNum,
} from "../utilities.tsx";
import MyGuiVar from "../myGuiVar.tsx";
import { chiSquareGOF } from "./chiGOF.tsx";
import Table from "../tableGen2.tsx";
import MultiSelectBox from "../inputs/multiSelect2.tsx";
import { chiSquareTwoWay } from "./chi2Way.tsx";

function handleChi2Way(
  data: any[][], // the spreadsheet data in 2d array
  showDialog: (
    isResult: boolean,
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) => void
) {
  let selectCol1 = new MyGuiVar("");
  let selectCol2 = new MyGuiVar("");
  let selectCol = new MyGuiVar([" "]);
  let df = new MyGuiVar(1);

  function isMissing(val: any): boolean {
    return (
      val === null ||
      val === undefined ||
      (typeof val === "string" && val.trim() === "")
    );
  }

  function zzzTest() {
    let colIn = excelColumnToIndex(selectCol.value as string);
    const rrr = selectCol.value as string[];
    const colSelect = rrr
      .map((i) => excelColumnToIndex(i))
      .filter((value) => value !== null);
    console.log("col index", colSelect);
    const obv = getMultiColNum(data, colSelect, false, true);

    const testres = chiSquareTwoWay(obv);

    const tableRes = [
      ["χ2", testres.chi2.toFixed(6)],
      ["PVal", testres.pValue.toFixed(6)],
      ["df", df.value.toString()],
    ];
    const align: ("left" | "center" | "right")[] = ["left", "center"];
    // let listres = "{";
    // // for (let i = 0; i < testres.compList.length - 1; i++) {
    // //   listres += testres.compList[i].toFixed(5) + ", ";
    // // }
    // // listres += testres.compList[testres.compList.length - 1].toFixed(5) + "}";
    return (
      <div>
        <h2>χ2 2-way Test</h2>
        <Table data={tableRes} align={align} />
        <h3>ExpMatrix</h3>
        <Table data={testres.expected} />
        <h3>CompMatrix</h3>
        <Table data={testres.comp} />
      </div>
    );
  }

  let items = getColNames(data);
  showDialog(
    false,
    <div>
      <h2>χ2 2-way Test</h2>
      <MultiSelectBox items={items} defaultRowCount={4} variable={selectCol} />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, zzzTest(), "ok");
    } // CAll back function when "OK" clicked.
  );
}

export default handleChi2Way;
