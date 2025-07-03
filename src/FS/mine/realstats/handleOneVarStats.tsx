import NumberInput from "../inputs/NumberInput.tsx";
import TextInput from "../inputs/TextInput.tsx";
import CheckBox from "../inputs/CheckBox.tsx";
import DrawDownSelection from "../inputs/DrawDown.tsx";
import {
  getColNames,
  excelColumnToIndex,
  getValueGrid,
} from "../utilities.tsx";
import MyGuiVar from "../myGuiVar.tsx";
import onePropZTest from "./onePropZ.tsx";
import Table from "../tableGen2.tsx";
import oneSampleTTest from "./tTest.tsx";
import oneVarStats from "./oneVarStats.tsx";

function handleOneVarStats(
  data: any[][], // the spreadsheet data in 2d array
  showDialog: (
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) => void
) {
  let exclRow1 = new MyGuiVar(false);
  let selectCol = new MyGuiVar("");
  let freqSelectCol = new MyGuiVar("");

  function zzzTest() {
    const arr = getValueGrid(data);
    const colSelect = excelColumnToIndex(selectCol.value as string);
    const freqColSelect = excelColumnToIndex(freqSelectCol.value as string);
    const dataStats = oneVarStats(arr, colSelect, freqColSelect);
    // let validcnt = 0;
    // for (let i = 0; i < arr.length; i++) {
    //   if (arr[i][colSelect] != null && arr[i][colSelect].toString() != "") {
    //     validcnt++;
    //   }
    // }

    const tableRes = [
      ["Sample mean", dataStats.mean],
      ["Sum", dataStats.sum],
      ["Sum squares", dataStats.sumSquares],
      ["sx", dataStats.sampleSD.toFixed(5)],
      ["Population SD", dataStats.populationSD.toFixed(5)],
      ["n", dataStats.ssize],
      ["MinX", dataStats.min],
      ["Q1X", dataStats.q1],
      ["MedianX", dataStats.median],
      ["Q3X", dataStats.q3],
      ["MaxX", dataStats.max],
    ];
    const align: ("left" | "center" | "right")[] = ["left", "center"];
    return (
      <div>
        <h2>One Variable Statistics</h2>
        <Table data={tableRes} align={align} />
        {/* <p>alternate hyp: {altHyp.value.toString()}</p>
        <p>sample prop = {sampleProp}</p>
        <p>z score = {testres.z}</p>
        <p>p value = {testres.pValue}</p> */}
      </div>
    );
  }

  showDialog(
    <div>
      <h2>One Variable Statistics</h2>
      <DrawDownSelection
        variable={selectCol}
        options={getColNames(data)}
        textLabel="Select data column: "
        width={100}
      />
      <DrawDownSelection
        variable={freqSelectCol}
        options={getColNames(data)}
        textLabel="Select frequency column: "
        width={100}
      />
      <CheckBox variable={exclRow1} textLabel="Exclude the first Row" />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(zzzTest(), "ok");
    } // CAll back function when "OK" clicked.
  );
}

export default handleOneVarStats;
