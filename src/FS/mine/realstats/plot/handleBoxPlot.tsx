import React from "react";
import PlotlyChart from "../../plotlyPlot";
import DropdownSelection from "../../inputs/DrawDown";
import { excelColumnToIndex, getColNames, getValueGrid } from "../../utilities";
import MyGuiVar from "../../myGuiVar";

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
    let colData: number[] = [];
    for (let i = 0; i < arr.length; i++) {
      const value = arr[i][colSelect];

      if (isMissing(value) || isNaN(Number(value))) {
        continue;
      }
      colData.push(Number(value));
    }

    const scatterData: Plotly.Data[] = [
      {
        x: colData,
        orientation: "h",
        type: "box",
        name: selectCol.value.toString(),
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
  showDialog(
    false,
    <div>
      <h2>Boxplot</h2>
      <DropdownSelection
        variable={selectCol}
        options={getColNames(data)}
        textLabel="Select a column: "
        width={100}
      />
    </div>,
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, plotd(), "ok");
    } // CAll back function when "OK" clicked.
  );
}

export default handleBoxPlot;
