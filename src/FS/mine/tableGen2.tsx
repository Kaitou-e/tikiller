import React from "react";

interface TableProps<T = any> {
  data: T[][];
  headers?: string[];
  className?: string;
  align?: ("left" | "center" | "right")[];
}

const Table = ({ data, headers, className, align }: TableProps) => {
  return (
    <table
      className={`min-w-full divide-y divide-gray-200 ${className}`}
      style={{
        border: "1px solid black",
        borderCollapse: "collapse",
      }}
    >
      {headers && (
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{
                  border: "1px solid black",
                  padding: "4px",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td
                className={`text-${align[rowIndex] || "left"}`}
                key={cellIndex}
                style={{
                  border: "1px solid black",
                  textAlign: align[cellIndex] || "left",
                  padding: "4px",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
