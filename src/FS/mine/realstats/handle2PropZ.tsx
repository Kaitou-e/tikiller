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
import twoPropZTest from "./twoPropZ.tsx";
import Table from "../tableGen2.tsx";

function handle2PropZ(
  data: any[][], // the spreadsheet data in 2d array
  showDialog: (
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) => void
) {
  let eventCNT1 = new MyGuiVar(0);
  let sampleSize1 = new MyGuiVar(0);
  let eventCNT2 = new MyGuiVar(0);
  let sampleSize2 = new MyGuiVar(0);

  let exclRow1 = new MyGuiVar(false);
  let selectCol1 = new MyGuiVar("");
  let eventName1 = new MyGuiVar("");
  let selectCol2 = new MyGuiVar("");
  let eventName2 = new MyGuiVar("");

  let altHyp = new MyGuiVar("p1 != p2");

  function zzzTest() {
    let sampleProp1 = 0;
    if (Number(eventCNT1.value) >= 0 && Number(sampleSize1.value) >= 1) {
      sampleProp1 = Number(eventCNT1.value) / Number(sampleSize1.value);
    } else {
      if (selectCol1.value === "" || eventName1.value === "") {
        return (
          <div>
            <p>error cant run test</p>
          </div>
        );
      }
      const colSelect = excelColumnToIndex(selectCol1.value as string);
      if (colSelect === null || colSelect < 0) {
        return (
          <div>
            <p>error on colselect</p>
          </div>
        );
      }
      const arr = getValueGrid(data);
      let cnt = 0;
      let validcnt = 0;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][colSelect] != null && arr[i][colSelect].toString() != "") {
          validcnt++;
          if (arr[i][colSelect].toString() === eventName1.value.toString()) {
            cnt++;
          }
        }
      }
      sampleSize1.value = validcnt;
      sampleProp1 = cnt / validcnt;
    }

    let sampleProp2 = 0;
    if (Number(eventCNT2.value) >= 0 && Number(sampleSize2.value) >= 1) {
      sampleProp2 = Number(eventCNT2.value) / Number(sampleSize2.value);
    } else {
      if (selectCol2.value === "" || eventName2.value === "") {
        return (
          <div>
            <p>error cant run test</p>
          </div>
        );
      }
      const colSelect = excelColumnToIndex(selectCol2.value as string);
      if (colSelect === null || colSelect < 0) {
        return (
          <div>
            <p>error on colselect</p>
          </div>
        );
      }
      const arr = getValueGrid(data);
      let cnt = 0;
      let validcnt = 0;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][colSelect] != null && arr[i][colSelect].toString() != "") {
          validcnt++;
          if (arr[i][colSelect].toString() === eventName2.value.toString()) {
            cnt++;
          }
        }
      }
      sampleSize2.value = validcnt;
      sampleProp2 = cnt / validcnt;
    }

    let testres = twoPropZTest(
      sampleProp1,
      Number(sampleSize1.value),
      sampleProp2,
      Number(sampleSize2.value),
      "two-sided"
    );
    if (altHyp.value.toString() === "p1 > p2") {
      testres = twoPropZTest(
        sampleProp1,
        Number(sampleSize1.value),
        sampleProp2,
        Number(sampleSize2.value),
        "greater"
      );
    } else if (altHyp.value.toString() === "p1 < p2") {
      testres = twoPropZTest(
        sampleProp1,
        Number(sampleSize1.value),
        sampleProp2,
        Number(sampleSize2.value),
        "less"
      );
    }
    const tableRes = [
      ["Alternate Hyp", altHyp.value.toString()],
      ["Z-score", testres.z.toFixed(5)],
      ["P value", testres.pValue.toFixed(5)],
      ["Sample prop 1", sampleProp1.toFixed(5)],
      ["Sample prop 2", sampleProp2.toFixed(5)],
      ["Pooled prop", testres.pooled.toFixed(5)],
      ["n1", sampleSize1.value],
      ["n2", sampleSize2.value],
    ];
    const align: ("left" | "center" | "right")[] = ["left", "center"];
    return (
      <div>
        <h2>2-Prop z Test</h2>
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
      <h2>2-Prop z test</h2>
      <DrawDownSelection
        variable={altHyp}
        options={["p1 != p2", "p1 > p2", "p1 < p2"]}
        textLabel="Alternate Hyp: "
        width={100}
      />

      <h4>Enter using data:</h4>
      <DrawDownSelection
        variable={selectCol1}
        options={getColNames(data)}
        textLabel="Select a column 1: "
        width={100}
      />
      <TextInput variable={eventName1} textLabel="Event name 1: " />
      <DrawDownSelection
        variable={selectCol2}
        options={getColNames(data)}
        textLabel="Select a column 2: "
        width={100}
      />
      <TextInput variable={eventName2} textLabel="Event name 2: " />
      <CheckBox variable={exclRow1} textLabel="Exclude the first Row" />

      <h4>Enter using stats (override):</h4>
      <NumberInput variable={eventCNT1} textLabel="Successes, x1: " step="1" />
      <NumberInput
        variable={sampleSize1}
        textLabel="Sample size, n1: "
        step="1"
      />
      <NumberInput variable={eventCNT2} textLabel="Successes, x2: " step="1" />
      <NumberInput
        variable={sampleSize2}
        textLabel="Sample size, n2: "
        step="1"
      />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(zzzTest(), "ok");
    } // CAll back function when "OK" clicked.
  );
}

export default handle2PropZ;
