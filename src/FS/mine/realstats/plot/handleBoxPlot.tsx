import React from "react";
import PlotlyChart from "../../plotlyPlot";
import DropdownSelection from "../../inputs/DrawDown";
import { excelColumnToIndex, getColNames, 
   getFromDataFreq, getValueGrid } from "../../utilities";
import MyGuiVar from "../../myGuiVar";
import DrawDownSelection from "../../inputs/DrawDown";
import CheckBox from "../../inputs/CheckBox.tsx";

function handleBoxPlot(
  data: any[][], // the spreadsheet data in 2d array
  showDialog: (
    isResult: boolean,
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) => void
) {
  let selectCol = new MyGuiVar("");
  let freqSelectCol = new MyGuiVar("");
  let exclRow1 = new MyGuiVar(false);

  function isMissing(val: any): boolean {
    return (
      val === null ||
      val === undefined ||
      (typeof val === "string" && val.trim() === "")
    );
  }
  const arr = getValueGrid(data);
  function plotd() {
    const colSelect = excelColumnToIndex(selectCol.value as string);
    // const colSelect = excelColumnToIndex(selectCol.value as string);
    const freqColSelect = excelColumnToIndex(freqSelectCol.value as string);
    const flat = getFromDataFreq(
      data,
      colSelect,
      freqColSelect,
      exclRow1.value as boolean
    );

    // let colData: number[] = [];
    // for (let i = 0; i < arr.length; i++) {
    //   const value = arr[i][colSelect];

    //   if (isMissing(value) || isNaN(Number(value))) {
    //     continue;
    //   }
    //   colData.push(Number(value));
    // }

    const scatterData: Plotly.Data[] = [
      {
        x: flat, //colData,
        orientation: "h",
        type: "box",
        name: selectCol.value.toString().split(' (')[0],
      },
    ];

    const chartLayout: Partial<Plotly.Layout> = {
      title: {
        text: "Dynamic Box Plot", // REQUIRED
        font: { size: 20 }, // Optional styling
        x: 0.5, // Center title
        // y: 0.95                        // Position from top
      },
      xaxis: {
        title: {
          text: "Values", // <-- Required text property
          font: { size: 10 }, // Optional styling
        },
        // range: [0, 6],
      },
      // margin: { t: 30, l: 20, r: 20, b: 20 }, // Reduced bottom margin
      height: 300, // Fixed height prevents auto-scaling
      width: 500,
      hovermode: "closest",
    };
    console.log(data);

    return (
      <>
        <div>
          <PlotlyChart data={scatterData} layout={chartLayout} />
        </div>
      </>
    );
  }

  const MenuText = () => (
    <>
      Use Boxplot to assess the shape, central
      <br />
      tendency, and variability of sample
      <br />
      distributions, and to look for outliers.
      <br />
      This plot replicated TI calculator function.
      <br />
      It only plots one data set.
      <br /> <br />
    </>
  );

  showDialog(
    false,
    <div>
      <h2>Boxplot</h2>
      <MenuText />
      <DropdownSelection
        variable={selectCol}
        options={getColNames(data)}
        textLabel="Select a column: "
        width={100}
      />
      <DrawDownSelection
        variable={freqSelectCol}
        options={getColNames(data)}
        textLabel="Freq column (optional): "
        width={100}
      />
      <CheckBox variable={exclRow1} textLabel="Exclude the first Row" />
    </div>,
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, plotd(), "ok");
    } // CAll back function when "OK" clicked.
  );
}

export default handleBoxPlot;
