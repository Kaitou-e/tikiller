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

function handleTTest(
  data: any[][], // the spreadsheet data in 2d array
  showDialog: (
    isResult: boolean,
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) => void
) {
  let mSample = new MyGuiVar(0);
  let mNull = new MyGuiVar(1);
  let sampleSD = new MyGuiVar(0.5);
  let sampleSize = new MyGuiVar(0);

  let exclRow1 = new MyGuiVar(false);
  let selectCol = new MyGuiVar("");
  let freqSelectCol = new MyGuiVar("");

  let altHyp = new MyGuiVar("μ != μ0");

  function zzzTest() {
    if (selectCol.value != "" && Number(sampleSize.value) === 0) {
      const colSelect = excelColumnToIndex(selectCol.value as string);
      const freqColSelect = excelColumnToIndex(freqSelectCol.value as string);
      const flat = getFromDataFreq(
        data,
        colSelect,
        freqColSelect,
        exclRow1.value as boolean
      );
      const dataStats = oneVarStats(flat);
      mSample.setValue(dataStats.mean);
      sampleSD.setValue(dataStats.sampleSD);
      sampleSize.setValue(dataStats.ssize);
    }

    let testres = oneSampleTTest(
      Number(mSample.value),
      Number(mNull.value),
      Number(sampleSD.value),
      Number(sampleSize.value),
      "two-sided"
    );
    if (altHyp.value.toString() === "μ > μ0") {
      testres = oneSampleTTest(
        Number(mSample.value),
        Number(mNull.value),
        Number(sampleSD.value),
        Number(sampleSize.value),
        "greater"
      );
    } else if (altHyp.value.toString() === "μ < μ0") {
      testres = oneSampleTTest(
        Number(mSample.value),
        Number(mNull.value),
        Number(sampleSD.value),
        Number(sampleSize.value),
        "less"
      );
    }
    const tableRes = [
      ["Alternate Hyp", altHyp.value.toString()],
      ["t-score", testres.t.toFixed(5)],
      ["P value", testres.pValue.toFixed(5)],
      ["df", testres.df],
      ["Sample mean", mSample.value],
      ["Sx", Number(sampleSD.value).toFixed(5)],
      ["n", sampleSize.value],
    ];
    const align: ("left" | "center" | "right")[] = ["left", "center"];
    return (
      <div>
        <h2>t Test</h2>
        <Table data={tableRes} align={align} />
        {/* <p>alternate hyp: {altHyp.value.toString()}</p>
        <p>sample prop = {sampleProp}</p>
        <p>z score = {testres.z}</p>
        <p>p value = {testres.pValue}</p> */}
      </div>
    );
  }

  showDialog(
    false,
    <div>
      <h2>t Test</h2>
      <NumberInput variable={mNull} textLabel="μ0: " step="0.1" />
      <DrawDownSelection
        variable={altHyp}
        options={["μ != μ0", "μ > μ0", "μ < μ0"]}
        textLabel="Alternate Hyp: "
        width={100}
      />

      <h4>Enter using data:</h4>
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

      <h4>Enter using stats (override):</h4>
      <NumberInput variable={mSample} textLabel="Sample mean: " step="0.1" />
      <NumberInput variable={sampleSD} textLabel="S_x:  " step="0.1" />
      <NumberInput
        variable={sampleSize}
        textLabel="Sample size, n: "
        step="1"
      />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, zzzTest(), "ok");
    } // CAll back function when "OK" clicked.
  );
}

export default handleTTest;
