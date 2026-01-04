import {
  getColNames,
  excelColumnToIndex,
  getValueGrid,
  getMultiColNum,
  getMultiColValidRowIndex
} from "../utilities.tsx";
import MyGuiVar from "../myGuiVar.tsx";
import DrawDownSelection from "../inputs/DrawDown.tsx";
import CheckBox from "../inputs/CheckBox.tsx";
import Table from "../tableGen2.tsx";
import MultiSelectBox from "../inputs/multiSelect2.tsx";
import chiSquare from "./chi_sq.tsx";

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
  let exclRow1 = new MyGuiVar(false);
  let selectCol1 = new MyGuiVar("");

  function zzzTest() {
    const rrr = selectCol.value as string[];
    console.log(rrr);
    // Get the 2 way table in number to obv 2d array
    const colSelect = rrr
      .map((i) => excelColumnToIndex(i))
      .filter((value) => value !== null);
    console.log("col index", colSelect);
    const obv = getMultiColNum(data, colSelect,
      exclRow1.value as boolean, true);

    // Get the ColLables depends on if excl first row
    const colLabels = rrr.map((i) => i).filter(
      (value) => excelColumnToIndex(value) !== null
    ).map(s => s.split(' (')[0]);
    if (exclRow1.value as boolean) {
      const realdata = getValueGrid(data);
      for (let i = 0; i < colSelect.length; i++) {
        colLabels[i] = realdata[0][colSelect[i]].toString();
      }
    }
    console.log(colLabels);

    // Get the Row Labels depends on if optional Row label selected
    const rowLabels = [];
    const rowLabelCol = excelColumnToIndex(selectCol1.value as string);
    console.log(rowLabelCol);
    if (rowLabelCol < 0) {
      for (let i = 0; i < obv[0].length; i++)
        rowLabels.push((i + 1).toFixed(0));
    } else {
      const yIndics = getMultiColValidRowIndex(data, colSelect, exclRow1.value as boolean);
      const realdata = getValueGrid(data);
      for (let i = 0; i < yIndics.length; i++) {
        rowLabels.push(realdata[yIndics[i]][rowLabelCol].toString());
      }
    }
    console.log(rowLabels);

    const res = chiSquare(obv);
    console.log(res);

    // print the contengency table
    const colSum = obv[0].map((_, x) => obv.reduce((sum, row) => sum + row[x], 0));
    const rowSum = obv.map(row => row.reduce((sum, val) => sum + val, 0));
    const ttlSum = rowSum.reduce((sum, val) => sum + val, 0);
    const header = ["Count/Expected", ...colLabels, "Total"];
    // Data rows
    const cTable = [];
    const rKeys = rowLabels;
    rKeys.forEach((rkey, y) => {
      const row = [rkey];
      for (let x = 0; x < colLabels!.length; x++) {
        row.push(`${obv[x][y]} / ${res.expected[x][y].toFixed(2)}`);
      }
      row.push(colSum[y].toString());
      cTable.push(row);
    });
    // Total row
    const totalRow = ["Total"];
    for (let x = 0; x < colLabels!.length; x++) {
      totalRow.push(rowSum[x].toString());
    }
    totalRow.push(ttlSum.toString());
    cTable.push(totalRow);

    const align: ("left" | "center" | "right")[] = [];
    header.forEach(() => {
      align.push("center");
    });
    console.log(cTable);

    const header2 = ['Test', 'Chi Sq', 'P value'];
    const table2 = [
      ['Pearson', res.chiSqPearson.toFixed(3), res.pPearson.toFixed(3)],
      ['Likelihood Ratio', res.chiSqLR.toFixed(3), res.pLR.toFixed(3)]
    ]
    const align2: ("left" | "center" | "right")[] = ["center", "center", "center"];

    const MenuText2 = () => (
      <>
        H₀ (Null Hypothesis): There is no association
        <br />
        between row variable and column variable.
        <br />
        Hₐ (Alternative Hypothesis): The two
        <br />
        categorical variables are associated.
        <br />
        <br />
      </>
    );
    return (
      <div>
        <h2>Chi-Sq 2-way Test</h2>
        <MenuText2 />
        <h4>Contingency Table</h4>
        <Table data={cTable} headers={header} align={align} />
        <h5>Degrees of Freedom = {res.df.toFixed(0)}</h5>
        <Table data={table2} headers={header2} align={align2} />
      </div>
    );
  }

  let items = getColNames(data);

  const MenuText = () => (
    <>
      Chi-square 2-way table test determines
      <br />
      if the two categorical variables (row, col)
      <br />
      are independent. Select the columns that
      <br />
      contain the 2-way table.
      <br /> <br />
    </>
  );

  showDialog(
    false,
    <div>
      <h2>Chi-Sq 2-way Test</h2>
      <MenuText />
      <MultiSelectBox items={items} defaultRowCount={4} variable={selectCol} />
      <CheckBox variable={exclRow1} textLabel="First Row as Column Labels" />
      <DrawDownSelection
        variable={selectCol1}
        options={items}
        textLabel="Row Labels (optional): "
        width={100}
      />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, zzzTest(), "ok");
    } // CAll back function when "OK" clicked.
  );
}

export default handleChi2Way;
