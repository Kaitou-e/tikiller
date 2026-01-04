import React from "react";
import PlotlyChart from "../../plotlyPlot";
import DrawDownSelection from "../../inputs/DrawDown";
import CheckBox from "../../inputs/CheckBox.tsx";
import {
  excelColumnToIndex,
  getColNames,
  getMultiColNum,
} from "../../utilities.tsx";
import MyGuiVar from "../../myGuiVar";

function handleScatterPlot(
  data: any[][], // the spreadsheet data in 2d array
  showDialog: (
    isResult: boolean,
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) => void
) {
  let selectColx = new MyGuiVar("");
  let selectColy = new MyGuiVar("");
  let exclRow1 = new MyGuiVar(false);
  const x = [];
  const y = [];
  let maxFreq = 0;

  function plotd() {
    const colSelectx = excelColumnToIndex(selectColx.value as string);
    if (colSelectx === null || colSelectx < 0) return;
    const colSelecty = excelColumnToIndex(selectColy.value as string);
    if (colSelecty === null || colSelecty < 0) return;

    const axisx = getMultiColNum(data, [colSelectx], exclRow1.value as boolean);
    const axisy = getMultiColNum(data, [colSelecty], exclRow1.value as boolean);

    const scatterData: Plotly.Data[] = [
      {
        x: axisx[0],
        y: axisy[0],
        type: "scatter",
        mode: "markers",
        marker: {
          color: "rgba(255, 100, 102, 0.7)",
          size: 14,
        },
      },
    ];

    const chartLayout: Partial<Plotly.Layout> = {
      title: {
        text: "Scatterplot", // REQUIRED
        font: { size: 20 }, // Optional styling
        x: 0.5, // Center title
        // y: 0.95                        // Position from top
      },
      xaxis: {
        title: {
          text: "X (" + (selectColx.value as string) + ")", // <-- Required text property
          font: { size: 14 }, // Optional styling
        },
        // range: [0, 6],
      },
      yaxis: {
        title: {
          text: "Y (" + (selectColy.value as string) + ")", // <-- Required text property
          font: { size: 14 },
        },
        // range: [5, 25],
      },
      // margin: { t: 30, l: 20, r: 20, b: 20 }, // Reduced bottom margin
      height: 500, // Fixed height prevents auto-scaling
      width: 500,
      hovermode: "closest",
    };

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
    Use Scatterplot to investigate the relationship
            <br />
    between a pair of continuous variables. A 
            <br />
    scatterplot displays ordered pairs of x and y 
            <br />
    variables in a coordinate plane. Select two
            <br />
    columns of data that contain x and y coordinates
            <br />
    for the data points.
      <br /> <br />
    </>
  );


  showDialog(
    false,
    <div>
      <h2>Scatterplot</h2>
      <MenuText />
      <DrawDownSelection
        variable={selectColx}
        options={getColNames(data)}
        textLabel="Select x axis: "
        width={100}
      />
      <DrawDownSelection
        variable={selectColy}
        options={getColNames(data)}
        textLabel="Select y axis: "
        width={100}
      />
      <CheckBox variable={exclRow1} textLabel="Exclude the first Row" />
    </div>, // above is the dialog content,
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, plotd(), "ok");
    } // CAll back function when "OK" clicked.
  );
}

export default handleScatterPlot;
