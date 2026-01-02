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

function handleLinReg(
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

  type RegressionResult = {
    slope: number;
    intercept: number;
  };

  /** Ordinary least squares for simple linear regression y = a + b x */
  function linearRegression(x: number[], y: number[]): RegressionResult {
    if (x.length !== y.length || x.length === 0) {
      return { slope: NaN, intercept: NaN };
    }

    const n = x.length;
    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumXX = 0;

    for (let i = 0; i < n; i++) {
      sumX += x[i];
      sumY += y[i];
      sumXY += x[i] * y[i];
      sumXX += x[i] * x[i];
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  }

  function ScatterWithRegression(x: number[], y: number[]) {
    const { slope, intercept } = linearRegression(x, y);

    // Use min/max x to draw the line across the data range[web:38][web:40]
    const xMin = Math.min(...x);
    const xMax = Math.max(...x);
    const lineX = [xMin, xMax];
    const lineY = [slope * xMin + intercept, slope * xMax + intercept];
    const mStr = slope.toFixed(4);
    const bStr =
      intercept >= 0
        ? `+ ${intercept.toFixed(4)}`
        : `- ${Math.abs(intercept).toFixed(4)}`;
    const eqText = `y = ${mStr}x ${bStr}`;

    const data: Plotly.Data[] = [
      {
        x,
        y,
        mode: "markers",
        type: "scatter",
        name: "Data",
        marker: { color: "rgba(31, 119, 180, 0.8)" },
      },
      {
        x: lineX,
        y: lineY,
        mode: "lines",
        type: "scatter",
        name: "Regression line",
        line: { color: "red" },
      },
    ];

    const layout: Partial<Plotly.Layout> = {
      title: {
        text: "Scatterplot with Linear Regression", // REQUIRED
        font: { size: 20 }, // Optional styling
        x: 0.5, // Center title
        // y: 0.95                        // Position from top
      },
      //   title: "Scatterplot with Linear Regression",
      xaxis: {
        title: {
          text: "X (" + (selectColx.value as string) + ")", // <-- Required text property
          font: { size: 14 }, // Optional styling
        },
      },
      yaxis: {
        title: {
          text: "Y (" + (selectColy.value as string) + ")", // <-- Required text property
          font: { size: 14 },
        },
      },
      annotations: [
        {
          xref: "paper",
          yref: "paper",
          x: 0.05,
          y: 0.95,
          xanchor: "left",
          yanchor: "top",
          text: eqText,
          showarrow: false,
          font: { size: 12, color: "black" },
          bgcolor: "rgba(255,255,255,0.7)",
          bordercolor: "black",
          borderwidth: 1,
        },
      ],
      height: 500, // Fixed height prevents auto-scaling
      width: 600,
    };

    return <PlotlyChart data={data} layout={layout} />;
  }

  function plotd() {
    const colSelectx = excelColumnToIndex(selectColx.value as string);
    if (colSelectx === null || colSelectx < 0) return;
    const colSelecty = excelColumnToIndex(selectColy.value as string);
    if (colSelecty === null || colSelecty < 0) return;

    const axisx = getMultiColNum(data, [colSelectx], exclRow1.value as boolean);
    const axisy = getMultiColNum(data, [colSelecty], exclRow1.value as boolean);

    return (
      <>
        <div>{ScatterWithRegression(axisx[0], axisy[0])}</div>
      </>
    );
  }
  showDialog(
    false,
    <div>
      <h2>Linear Regression</h2>
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

export default handleLinReg;
