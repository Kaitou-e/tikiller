import React from "react";
import PlotlyChart from "../plotlyPlot";

function handleMoon(
  data: any[][], // the spreadsheet data in 2d array
  showDialog: (
    isResult: boolean,
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) => void
) {
  const scatterData: Plotly.Data[] = [
    {
      x: [1, 2, 3, 4],
      y: [10, 15, 13, 17],
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
      text: "Dynamic Scatter Plot", // REQUIRED
      font: { size: 20 }, // Optional styling
      x: 0.5, // Center title
      // y: 0.95                        // Position from top
    },
    xaxis: {
      title: {
        text: "X Values", // <-- Required text property
        font: { size: 14 }, // Optional styling
      },
      range: [0, 6],
    },
    yaxis: {
      title: {
        text: "Y Values", // <-- Required text property
        font: { size: 14 },
      },
      range: [5, 25],
    },
    // margin: { t: 30, l: 20, r: 20, b: 20 }, // Reduced bottom margin
    height: 500, // Fixed height prevents auto-scaling
    width: 500,
    hovermode: "closest",
  };
  console.log(scatterData);

  showDialog(
    true,
    <>
      <p>
        This implementation provides a flexible, type-safe solution for
        rendering tables in React with Plotly, supporting both direct data input
        and API-driven JSON configurations.
      </p>
      <div>
        <PlotlyChart data={scatterData} layout={chartLayout} />
      </div>
      <p>
        This implementation provides a flexible, type-safe solution for
        rendering tables in React with Plotly, supporting both direct data input
        and API-driven JSON configurations.
      </p>
    </>,
    "ok"
  );
}

export default handleMoon;
