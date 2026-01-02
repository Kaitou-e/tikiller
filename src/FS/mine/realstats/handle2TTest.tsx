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
import twoSampleTTest from "./twoTTest.tsx";

function handle2TTest(
  data: any[][], // the spreadsheet data in 2d array
  showDialog: (
    isResult: boolean,
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) => void
) {
  let mSample1 = new MyGuiVar(0);
  let sampleSD1 = new MyGuiVar(0.5);
  let sampleSize1 = new MyGuiVar(0);

  let exclRow1 = new MyGuiVar(false);
  let selectCol1 = new MyGuiVar("");
  let freqSelectCol1 = new MyGuiVar("");
  //////////
  let mSample2 = new MyGuiVar(0);
  let sampleSD2 = new MyGuiVar(0.5);
  let sampleSize2 = new MyGuiVar(0);

  let selectCol2 = new MyGuiVar("");
  let freqSelectCol2 = new MyGuiVar("");

  let altHyp = new MyGuiVar("μ != μ0");

  function zzzTest() {
    if (selectCol1.value != "" && Number(sampleSize1.value) === 0) {
      const arr = getValueGrid(data);
      const colSelect = excelColumnToIndex(selectCol1.value as string);
      const freqColSelect = excelColumnToIndex(freqSelectCol1.value as string);
      const dataStats = oneVarStats(arr, colSelect, freqColSelect);
      mSample1.setValue(dataStats.mean);
      sampleSD1.setValue(dataStats.sampleSD);
      sampleSize1.setValue(dataStats.ssize);
    }
    if (selectCol2.value != "" && Number(sampleSize2.value) === 0) {
      const arr = getValueGrid(data);
      const colSelect = excelColumnToIndex(selectCol2.value as string);
      const freqColSelect = excelColumnToIndex(freqSelectCol2.value as string);
      const dataStats = oneVarStats(arr, colSelect, freqColSelect);
      mSample2.setValue(dataStats.mean);
      sampleSD2.setValue(dataStats.sampleSD);
      sampleSize2.setValue(dataStats.ssize);
    }

    let testres = twoSampleTTest(
      Number(mSample1.value),
      Number(sampleSD1.value),
      Number(sampleSize1.value),
      Number(mSample2.value),
      Number(sampleSD2.value),
      Number(sampleSize2.value),
      "two-sided"
    );
    if (altHyp.value.toString() === "μ > μ0") {
      testres = twoSampleTTest(
        Number(mSample1.value),
        Number(sampleSD1.value),
        Number(sampleSize1.value),
        Number(mSample2.value),
        Number(sampleSD2.value),
        Number(sampleSize2.value),
        "greater"
      );
    } else if (altHyp.value.toString() === "μ < μ0") {
      testres = twoSampleTTest(
        Number(mSample1.value),
        Number(sampleSD1.value),
        Number(sampleSize1.value),
        Number(mSample2.value),
        Number(sampleSD2.value),
        Number(sampleSize2.value),
        "less"
      );
    }
    const tableRes = [
      ["Alternate Hyp", altHyp.value.toString()],
      ["t-score", testres.t.toFixed(5)],
      ["P value", testres.pValue.toFixed(5)],
      ["df", testres.df.toFixed(5)],
      ["Sample mean 1", mSample1.value],
      ["Sample mean 2", mSample2.value],
      ["Sx1", Number(sampleSD1.value).toFixed(5)],
      ["Sx2", Number(sampleSD2.value).toFixed(5)],
      ["n1", sampleSize1.value],
      ["n2", sampleSize2.value],
    ];
    const align: ("left" | "center" | "right")[] = ["left", "center"];
    return (
      <div>
        <h2>2-Sample t Test</h2>
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
      <h2>2-Sample t Test</h2>
      <DrawDownSelection
        variable={altHyp}
        options={["μ1 != μ2", "μ1 > μ2", "μ1 < μ2"]}
        textLabel="Alternate Hyp: "
        width={100}
      />

      <h4>Enter using data:</h4>
      <DrawDownSelection
        variable={selectCol1}
        options={getColNames(data)}
        textLabel="Data column 1: "
        width={100}
      />
      <DrawDownSelection
        variable={selectCol2}
        options={getColNames(data)}
        textLabel="Data column 2: "
        width={100}
      />

      <DrawDownSelection
        variable={freqSelectCol1}
        options={getColNames(data)}
        textLabel="Frequency column 1 (optional): "
        width={100}
      />
      <DrawDownSelection
        variable={freqSelectCol2}
        options={getColNames(data)}
        textLabel="Frequency column 2 (optional): "
        width={100}
      />
      <CheckBox variable={exclRow1} textLabel="Exclude the first Row" />

      <h4>Enter using stats (override):</h4>
      <NumberInput variable={mSample1} textLabel="Sample mean: " step="0.1" />
      <NumberInput variable={sampleSD1} textLabel="S_x:  " step="0.1" />
      <NumberInput
        variable={sampleSize1}
        textLabel="Sample size, n: "
        step="1"
      />
      <NumberInput variable={mSample2} textLabel="Sample mean: " step="0.1" />
      <NumberInput variable={sampleSD2} textLabel="S_x:  " step="0.1" />
      <NumberInput
        variable={sampleSize2}
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

export default handle2TTest;
