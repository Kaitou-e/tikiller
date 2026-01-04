import React from "react";
import PlotlyChart from "../../plotlyPlot.tsx";
import DrawDownSelection from "../../inputs/DrawDown.tsx";
import TextInput from "../../inputs/TextInput.tsx";
import CheckBox from "../../inputs/CheckBox.tsx";
import {
  excelColumnToIndex,
  getColNames,
  getMultiColNum,
  toFloat,
} from "../../utilities.tsx";
import MyGuiVar from "../../myGuiVar.tsx";

function handleHistogram(
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
  let nBins = new MyGuiVar("auto");
  let binSize = new MyGuiVar("auto");
  let start = new MyGuiVar("auto");
  let end = new MyGuiVar("auto");

  const x = [];
  let maxFreq = 0;

  function plotd() {
    const colSelect = excelColumnToIndex(selectCol.value as string);
    if (colSelect === null || colSelect < 0) return;

    if (freqSelectCol.value === "") {
      const arr = getMultiColNum(data, [colSelect], exclRow1.value as boolean);
      // group occurrences by value
      arr[0].forEach((value, idx) => {
        x.push(value);
      });
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
          // y.push(k + 1); // stacked vertically
        }
      });
    }

    let xbins = undefined;
    // if (toFloat(start.value)) xbins["start"]=toFloat(start.value);
    // if (toFloat(end.value)) xbins['end']=toFloat(end.value);
    if (toFloat(binSize.value)) xbins["size"] = toFloat(binSize.value);

    console.log(xbins);

    const scatterData: Plotly.Data[] = [
      {
        x: x,
        type: "histogram",
        xbins: xbins,
        marker: {
          color: "lightblue", // light blue fill
          line: {
            color: "black",
            width: 1,
          },
        },
      },
    ];

    const chartLayout: Partial<Plotly.Layout> = {
      title: {
        text: "Histogram", // REQUIRED
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
        title: {
          text: "Frequency", // <-- Required text property
          font: { size: 10 }, // Optional styling
        },
      },
      // margin: { t: 30, l: 20, r: 20, b: 20 }, // Reduced bottom margin
      height: 300, // Fixed height prevents auto-scaling
      width: 500,
      hovermode: "closest",
      // bargap: 0.1,  // adjust 0–1 for gap size
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

const MenuText = () => (
    <>
      Use Histogram to examine the shape and 
            <br />
      spread of your data. A histogram divides 
            <br />
      sample values into many intervals and 
            <br />
      represents the frequency of data values 
            <br />
        in each interval with a bar.
      <br /> <br />
    </>
  );


  showDialog(
    false,
    <div>
      <h2>Histogram</h2>
      <MenuText />
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
      {/* <TextInput variable={nBins} textLabel="Number of Bins: " /> */}
      {/* <TextInput variable={start} textLabel="Bin Start: " /> */}
      {/* <TextInput variable={end} textLabel="Bin End: " /> */}
      <TextInput variable={binSize} textLabel="Bin Size: " />
    </div>, // above is the dialog content,
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, plotd(), "ok");
    } // CAll back function when "OK" clicked.
  );
}

export default handleHistogram;
