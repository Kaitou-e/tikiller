import NumberInput from "../inputs/NumberInput.tsx";
import DrawDownSelection from "../inputs/DrawDown.tsx";
import {
  getColNames,
  excelColumnToIndex,
  getValueGrid,
} from "../utilities.tsx";
import MyGuiVar from "../myGuiVar.tsx";
import { chiSquareGOF } from "./chiGOF.tsx";
import Table from "../tableGen2.tsx";

function handleChiGOF(
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
  let df = new MyGuiVar(1);

  let altHyp = new MyGuiVar("p1 != p2");

  function isMissing(val: any): boolean {
    return (
      val === null ||
      val === undefined ||
      (typeof val === "string" && val.trim() === "")
    );
  }

  function zzzTest() {
    const exp: number[] = [];
    const obv: number[] = [];
    const arr = getValueGrid(data);
    let colSelect1 = excelColumnToIndex(selectCol1.value as string);
    let colSelect2 = excelColumnToIndex(selectCol2.value as string);
    for (let i = 0; i < data.length; i++) {
      const value = arr[i][colSelect1];
      if (isMissing(value) || isNaN(Number(value))) {
        continue;
      }
      obv.push(Number(value));
    }
    for (let i = 0; i < data.length; i++) {
      const value = arr[i][colSelect2];
      if (isMissing(value) || isNaN(Number(value))) {
        continue;
      }
      exp.push(Number(value));
    }

    const testres = chiSquareGOF(obv, exp, Number(df.value));

    const tableRes = [
      ["χ2", testres.chi2.toFixed(6)],
      ["PVal", testres.pValue.toFixed(6)],
      ["df", df.value.toString()],
    ];
    const align: ("left" | "center" | "right")[] = ["left", "center"];
    let listres = "{";
    for (let i = 0; i < testres.compList.length - 1; i++) {
      listres += testres.compList[i].toFixed(5) + ", ";
    }
    listres += testres.compList[testres.compList.length - 1].toFixed(5) + "}";
    return (
      <div>
        <h2>χ2 GOF</h2>
        <Table data={tableRes} align={align} />
        <p style={{ width: "200px" }}>compList = {listres}</p>
      </div>
    );
  }

  showDialog(
    false,
    <div>
      <h2>χ2 GOF</h2>
      <DrawDownSelection
        variable={selectCol1}
        options={getColNames(data)}
        textLabel="Observed List: "
        width={100}
      />
      <DrawDownSelection
        variable={selectCol2}
        options={getColNames(data)}
        textLabel="Expected List: "
        width={100}
      />
      <NumberInput variable={df} textLabel="Deg of Freedom, df: " step="1" />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, zzzTest(), "ok");
    } // CAll back function when "OK" clicked.
  );
}

export default handleChiGOF;
