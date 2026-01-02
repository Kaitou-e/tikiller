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

function handleDotPlot(
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
  const x = [];
  const y = [];
  let maxFreq = 0;

  function plotd() {
    const colSelect = excelColumnToIndex(selectCol.value as string);
    if (colSelect === null || colSelect < 0) return;

    if (freqSelectCol.value === "") {
      const arr = getMultiColNum(data, [colSelect], exclRow1.value as boolean);
      // group occurrences by value
      const counts = new Map();
      for (const v of arr[0]) {
        counts.set(v, (counts.get(v) || 0) + 1);
      }

      for (const [value, freq] of counts.entries()) {
        maxFreq = Math.max(maxFreq, freq);
        for (let k = 0; k < freq; k++) {
          x.push(value); // same value
          y.push(k + 1); // stack: 1,2,3,...
        }
      }
    } else {
      const freqcol = excelColumnToIndex(freqSelectCol.value as string);
      console.log(freqcol, colSelect);
      const arr = getMultiColNum(
        data,
        [colSelect, freqcol],
        exclRow1.value as boolean,
        true
      );
      console.log(arr);
      arr[1].forEach((f, i) => {
        maxFreq = Math.max(f, maxFreq);
        for (let k = 0; k < f; k++) {
          x.push(arr[0][i]); // same x for this value
          y.push(k + 1); // stacked vertically
        }
      });
    }

    let dotSize = Math.min(Math.max(300 / maxFreq / 2, 1), 12);
    let yMax = maxFreq / (1 - 1 / (maxFreq + 1)) + 12 / dotSize;

    console.log("max freq", maxFreq);

    const scatterData: Plotly.Data[] = [
      {
        type: "scatter",
        mode: "markers",
        x,
        y,
        marker: {
          symbol: "circle",
          size: dotSize,
        },
      },
    ];

    const chartLayout: Partial<Plotly.Layout> = {
      title: {
        text: "DotPlot", // REQUIRED
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
      // hide all y‑axis labels, ticks, and grid
      yaxis: {
        showticklabels: false,
        ticks: "",
        showgrid: false,
        zeroline: false,
        range: [0.5, yMax], // [min, max] → max is 10 here
        autorange: false,
      },
      // margin: { t: 30, l: 20, r: 20, b: 20 }, // Reduced bottom margin
      height: 300, // Fixed height prevents auto-scaling
      width: 500,
      hovermode: "closest",
      // add a frame (border) around the plot area
      // using thick black outline
      margin: { l: 40, r: 40, t: 40, b: 40 },
      paper_bgcolor: "white",
      plot_bgcolor: "white",
      // this CSS-like border effect is done via shapes
      shapes: [
        {
          type: "rect",
          xref: "paper",
          yref: "paper",
          x0: 0,
          y0: 0,
          x1: 1,
          y1: 1,
          line: {
            color: "black",
            width: 2,
          },
          fillcolor: "rgba(0,0,0,0)",
        },
      ],
    };
    // console.log(data);

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
      <h2>Dotplot</h2>
      <DrawDownSelection
        variable={selectCol}
        options={getColNames(data)}
        textLabel="Select data column: "
        width={100}
      />
      <DrawDownSelection
        variable={freqSelectCol}
        options={getColNames(data)}
        textLabel="Freq column (optional): "
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

export default handleDotPlot;
