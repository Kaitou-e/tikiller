import NumberInput from "../inputs/NumberInput.tsx";
import TextInput from "../inputs/TextInput.tsx";
import CheckBox from "../inputs/CheckBox.tsx";
import DrawDownSelection from "../inputs/DrawDown.tsx";
import {
  getColNames,
  excelColumnToIndex,
  getMultiColNum,
} from "../utilities.tsx";
import MyGuiVar from "../myGuiVar.tsx";

function handleGenshin(
  data: any[][], // the spreadsheet data in 2d array
  showDialog: (
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) => void
) {
  let alpha = new MyGuiVar(0.05);
  let inputText = new MyGuiVar("Kleeeee");
  let exclRow1 = new MyGuiVar(true);
  let drawdown1 = new MyGuiVar("1");
  let drawdown2 = new MyGuiVar("");

  function colSum() {
    console.log("selected col", drawdown2.value);
    const colSelect = excelColumnToIndex(drawdown2.value as string);
    console.log("col index", colSelect);
    if (colSelect === null || colSelect < 0) return;
    const arr = getMultiColNum(data, [colSelect], exclRow1.value as boolean);
    console.log(arr);
    return arr[0].reduce((acc, curr) => acc + curr, 0);
  }

  function onClick() {
    console.log(exclRow1.value);
    return (
      <div className="textboxs">
        <p>Got alpha value is {alpha.value}.</p>
        <p>Inputed text is "{inputText.value}".</p>
        <p>exclude row 1 {exclRow1.value.toString()}.</p>
        <p>drawdown get number: {drawdown1.value}. </p>
        <p>Sum of the selected column = {colSum()} </p>
      </div>
    );
  }

  showDialog(
    <div>
      <h3>OG Player ? Here? </h3>
      <NumberInput variable={alpha} textLabel="Alpha: " step="0.1" />
      <TextInput variable={inputText} textLabel="Text: " />
      <CheckBox variable={exclRow1} textLabel="Exclude the frist Row" />
      <DrawDownSelection
        variable={drawdown1}
        options={["1", "2"]}
        textLabel="Select a number: "
      />
      <DrawDownSelection
        variable={drawdown2}
        options={getColNames(data)}
        textLabel="Select a column: "
        width={100}
      />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(onClick(), "ok");
    } // CAll back function when "OK" clicked.
  );
}

export default handleGenshin;
