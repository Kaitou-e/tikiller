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

function handleAdd(
  data: any[][], // the spreadsheet data in 2d array
  showDialog: (
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) => void
) {
  let eventCNT = new MyGuiVar(0);
  let sampleSize = new MyGuiVar(0);
  let exclRow1 = new MyGuiVar(false);
  let selectCol = new MyGuiVar("");
  let eventName = new MyGuiVar("");
  let pNull = new MyGuiVar(0.5);
  let altHyp = new MyGuiVar("");

  // function colSum(){
  //     console.log("selected col",drawdown2.value)
  //     const colSelect=excelColumnToIndex(drawdown2.value as string);
  //     console.log("col index",colSelect);
  //     if (colSelect===null || colSelect<0 ) return;
  //     const arr=getMultiColNum(data,[colSelect] , exclRow1.value as boolean )
  //     console.log(arr)
  //     return arr[0].reduce((acc, curr) => acc + curr, 0);
  // }

  function zzzTest() {
    let sampleProp = 0;
    if (Number(eventCNT.value) >= 0 && Number(sampleSize.value) >= 1) {
      sampleProp = Number(eventCNT.value) / Number(sampleSize.value);
    } else {
      if (selectCol.value === "" || eventName.value === "") {
        return (
          <div>
            <p>error cant run test</p>
          </div>
        );
      }
      const colSelect = excelColumnToIndex(selectCol.value as string);
      // console.log("col index",colSelect);
      if (colSelect === null || colSelect < 0) {
        return (
          <div>
            <p>error on colselect</p>
          </div>
        );
      }
      const arr = getValueGrid(data);
      // const arr=getMultiColNum(data,[colSelect] , exclRow1.value as boolean )
      console.log(arr);
      // return arr[0].reduce((acc, curr) => acc + curr, 0);
      let cnt = 0;
      let validcnt = 0;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][colSelect] != null && arr[i][colSelect].toString() != "") {
          validcnt++;
          if (arr[i][colSelect].toString() === eventName.value.toString()) {
            cnt++;
          }
        }
      }
      console.log(cnt);
      console.log(validcnt);
      sampleSize.value = validcnt;
      sampleProp = cnt / validcnt;
    }
    let testres = onePropZTest(
      Number(pNull.value),
      sampleProp,
      Number(sampleSize.value),
      "two-sided"
    );
    if (altHyp.value.toString() === "prop > p0") {
      testres = onePropZTest(
        Number(pNull.value),
        sampleProp,
        Number(sampleSize.value),
        "greater"
      );
    } else if (altHyp.value.toString() === "prop < p0") {
      testres = onePropZTest(
        Number(pNull.value),
        sampleProp,
        Number(sampleSize.value),
        "less"
      );
    }
    const tableRes = [
      ["Alternate Hyp", altHyp.value.toString()],
      ["Sample prop", sampleProp],
      ["Z-score", testres.z.toFixed(5)],
      ["P value", testres.pValue.toFixed(5)],
      ["n", sampleSize.value],
    ];
    const align: ("left" | "center" | "right")[] = ["left", "center"];
    return (
      <div>
        <h2>1-Prop z Test</h2>
        <Table data={tableRes} align={align} />
        {/* <p>alternate hyp: {altHyp.value.toString()}</p>
        <p>sample prop = {sampleProp}</p>
        <p>z score = {testres.z}</p>
        <p>p value = {testres.pValue}</p> */}
      </div>
    );
  }

  function onClick() {
    console.log(exclRow1.value);
    return (
      <div className="textboxs">
        <p>Inputed event cnt is "{eventCNT.value}".</p>
        <p>inputed sample size {sampleSize.value} </p>
        <p>exclude row 1 {exclRow1.value.toString()}.</p>
        <p>the selected column = {selectCol.value} </p>
        <p> the event name = {eventName.value} </p>
      </div>
    );
  }

  showDialog(
    <div>
      <h2>1-prop z test</h2>
      <NumberInput variable={pNull} textLabel="p_0: " step="0.1" />
      <DrawDownSelection
        variable={altHyp}
        options={["prop != p0", "prop > p0", "prop < p0"]}
        textLabel="Alternative Hyp: "
        width={100}
      />

      <h4>Enter using data:</h4>
      <DrawDownSelection
        variable={selectCol}
        options={getColNames(data)}
        textLabel="Select a column: "
        width={100}
      />
      <TextInput variable={eventName} textLabel="Event name: " />
      <CheckBox variable={exclRow1} textLabel="Exclude the first Row" />

      <h4>Enter using stats (override):</h4>
      <NumberInput variable={eventCNT} textLabel="Successes, x: " step="1" />
      <NumberInput
        variable={sampleSize}
        textLabel="Sample size, n: "
        step="1"
      />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(zzzTest(), "ok");
    } // CAll back function when "OK" clicked.
  );
}

export default handleAdd;
