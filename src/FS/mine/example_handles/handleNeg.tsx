import React from "react";
// import PlotlyTable from './tableGen.tsx'
import Table from "../tableGen2.tsx";

function handleNeg(
  data: any[][], // the spreadsheet data in 2d array
  showDialog: (
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) => void
) {
  const tableData = [
    ["A", "B", "C", "D"],
    [1, 3, 5, 7],
    [2, 4, 6, 8],
    [10, 20, 30, 40],
  ];

  const headers = ["Column 1", "Column 2", "Column 3", "Column 4"];
  const align: ("left" | "center" | "right")[] = [
    "center",
    "right",
    "right",
    "left",
  ];

  showDialog(
    <>
      <p>
        EHHHHHH This implementation provides a flexible, type-safe solution for
        rendering tables in React with Plotly, supporting both direct data input
        and API-driven JSON configurations.
      </p>
      {/* <PlotlyTable 
                                                            data={tableData}
                                                                    headers={headers}
                                                                            cellColors={['#e8f5e9', '#ffffff']}
                                                                                    headerColor="#1b5e20"
                                                                                    width={400}
                                                                                          /> */}
      <p>
        EHHHHHH This implementation provides a flexible, type-safe solution for
        rendering tables in React with Plotly, supporting both direct data input
        and API-driven JSON configurations.
      </p>
      <Table data={tableData} headers={headers} align={align} />
      <p>
        EHHHHHH This implementation provides a flexible, type-safe solution for
        rendering tables in React with Plotly, supporting both direct data input
        and API-driven JSON configurations.
      </p>
    </>,
    "ok"
  );
}

export default handleNeg;
