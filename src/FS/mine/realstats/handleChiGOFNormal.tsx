import DrawDownSelection from "../inputs/DrawDown.tsx";
import CheckBox from "../inputs/CheckBox.tsx";
import {
  getColNames,
  excelColumnToIndex,
  getMultiColNum
} from "../utilities.tsx";
import MyGuiVar from "../myGuiVar.tsx";
import Table from "../tableGen2.tsx";
import chiSquare from "./chi_sq.tsx";

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
  let exclRow1 = new MyGuiVar(false);

  function zzzTest() {

    let colSelect1 = excelColumnToIndex(selectCol1.value as string);
    let colSelect2 = excelColumnToIndex(selectCol2.value as string);
    console.log(colSelect1, colSelect2);
    if (colSelect1 === null || colSelect2 === null) return;

    let arr = getMultiColNum(data, [colSelect1, colSelect2],
      exclRow1.value as boolean, true);
    console.log(arr);

    for (let i = 0; i < arr[1].length; i++) arr[1][i] = arr[1][i] * 1e9;
    const res = chiSquare(arr);
    const rowSum = arr.map(row => row.reduce((sum, val) => sum + val, 0));
    const valTable = Array.from({ length: arr[1].length }, () => Array(2).fill(0));
    for (let i = 0; i < arr[1].length; i++) {
      for (let j = 0; j < 2; j++) {
        valTable[i][j] = (arr[j][i] / rowSum[j]).toFixed(3);
      }
    }
    const align1: ("left" | "center" | "right")[] = ["center", "center"];
    const header = ['Test', 'Chi Sq', 'P value'];
    const table2 = [
      ['Pearson', res.chiSqPearson.toFixed(3), res.pPearson.toFixed(3)],
      ['Likelihood Ratio', res.chiSqLR.toFixed(3), res.pLR.toFixed(3)]
    ]
    const align2: ("left" | "center" | "right")[] = ["center", "center", "center"];
    const MenuText2 = () => (
      <>
        The null hypothesis (H₀) for Chi-sq
        <br />
        proportion test states that the observed
        <br />
        frequencies follow the specified expected
        <br />
        distribution.
        <br />
      </>
    );
    return (
      <div>
        <h2>Chi-sq Proportion</h2>
        <MenuText2 />
        <h4>Test Probabilities</h4>
        <Table data={valTable} headers={['Observed Prob', 'Expected Prob']} align={align1} />
        {/* <h4>Chi-sq Test</h4> */}
        <h5>Degrees of Freedom = {res.df.toFixed(0)}</h5>
        <Table data={table2} headers={header} align={align2} />
      </div>
    );
  }
  const MenuText = () => (
    <>
      Chi-square Goodness of Fit (GOF) test determines
      <br />
      whether an observed categorical frequency
      <br />
      distribution matches an expected theoretical
      <br />
      distribution. The input columns can be observed
      <br />
      /expected count, prop or freqency of each level.
      <br /> <br />
    </>
  );

  showDialog(
    false,
    <div>
      <h2>Chi-sq proportion</h2>
      <MenuText />
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
      <CheckBox variable={exclRow1} textLabel="Exclude the first Row" />
      {/* <NumberInput variable={df} textLabel="Degrees of Freedom: " step="1" /> */}
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, zzzTest(), "ok");
    } // CAll back function when "OK" clicked.
  );
}

export default handleChiGOF;
