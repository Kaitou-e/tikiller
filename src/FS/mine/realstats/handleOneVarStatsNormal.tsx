import NumberInput from "../inputs/NumberInput.tsx";
import TextInput from "../inputs/TextInput.tsx";
import CheckBox from "../inputs/CheckBox.tsx";
import DrawDownSelection from "../inputs/DrawDown.tsx";
import {
  getColNames,
  excelColumnToIndex,
  getValueGrid,
  getFromDataFreq,
} from "../utilities.tsx";
import MyGuiVar from "../myGuiVar.tsx";
import onePropZTest from "./onePropZ.tsx";
import Table from "../tableGen2.tsx";
import oneSampleTTest from "./tTest.tsx";
import oneVarStats from "./oneVarStats.tsx";

function handleOneVarStatsNormal(
  data: any[][], // the spreadsheet data in 2d array
  showDialog: (
    isResult: boolean,
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
    const colSelect = excelColumnToIndex(selectCol.value as string);
    const freqColSelect = excelColumnToIndex(freqSelectCol.value as string);
    const flat = getFromDataFreq(
      data,
      colSelect,
      freqColSelect,
      exclRow1.value as boolean
    );
    const dataStats = oneVarStats(flat);

    const tableRes = [
      ["Sample mean", dataStats.mean.toFixed(5)],
      ["Sum", dataStats.sum],
      ["Sum of squares", dataStats.sumSquares],
      ["Standard Deviation(SD)", dataStats.sampleSD.toFixed(5)],
      ["Population SD", dataStats.populationSD.toFixed(5)],
      ["n", dataStats.ssize],
      ["Min", dataStats.min],
      ["Q1", dataStats.q1],
      ["Median", dataStats.median],
      ["Q3", dataStats.q3],
      ["Max", dataStats.max],
    ];
    const align: ("left" | "center" | "right")[] = ["left", "center"];
    return (
      <div>
        <h2>One-Variable Statistics</h2>
        <Table data={tableRes} align={align} />
        {/* <p>alternate hyp: {altHyp.value.toString()}</p>
        <p>sample prop = {sampleProp}</p>
        <p>z score = {testres.z}</p>
        <p>p value = {testres.pValue}</p> */}
      </div>
    );
  }

      const MenuText = () => (
        <>
            General Statistical summary of one column of data, a
            <br />
            single data set. Stats measures are set by default, 
            <br />
            including mean and median etc.<br /><br />
        </>
    );

  showDialog(
    false,
    <div>
      <h2>Describe</h2>
      <MenuText />
      <DrawDownSelection
        variable={selectCol}
        options={getColNames(data)}
        textLabel="Data column: "
        width={100}
      />
      <DrawDownSelection
        variable={freqSelectCol}
        options={getColNames(data)}
        textLabel="Frequency column (optional): "
        width={100}
      />
      <CheckBox variable={exclRow1} textLabel="Exclude the first Row" />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, zzzTest(), "ok");
    } // CAll back function when "OK" clicked.
  );
}

export default handleOneVarStatsNormal;
