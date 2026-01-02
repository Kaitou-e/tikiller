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
  let selectCol = new MyGuiVar([" "]);

  function isMissing(val: any): boolean {
    return (
      val === null ||
      val === undefined ||
      (typeof val === "string" && val.trim() === "")
    );
  }

  function zzzTest() {
    //let colIn = excelColumnToIndex(selectCol.value as string);
    const rrr = selectCol.value as string[];
    console.log(rrr);

    const colSelect = rrr
      .map((i) => excelColumnToIndex(i))
      .filter((value) => value !== null);
    console.log("col index", colSelect);
    const obv = getMultiColNum(data, colSelect, false, true);

    const testres = chiSquareTwoWay(obv);
    console.log(testres);

    const tableRes = [
      ["χ2", testres.chi2.toFixed(6)],
      ["PVal", testres.pValue.toFixed(6)],
      ["df", testres.df],
    ];
    const align: ("left" | "center" | "right")[] = ["left", "center"];

    const transpose = (arr) =>
      arr[0].map((_, col) => arr.map((row) => row[col].toFixed(4)));

    const align2: ("left" | "center" | "right")[] = new Array(
      testres.expected.length
    ).fill("center");

    return (
      <div>
        <h2>χ2 2-way Test</h2>
        <Table data={tableRes} align={align} />
        <h3>ExpMatrix</h3>
        <Table data={transpose(testres.expected)} align={align2} />
        <h3>CompMatrix</h3>
        <Table data={transpose(testres.comp)} align={align2} />
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
