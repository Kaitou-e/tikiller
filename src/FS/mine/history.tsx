// import React from "react";
import WorkbookContext from "../react/src/context";
// import {  getFlowdata } from "../core";
import { useContext } from "react";
import CustomButton from "../react/src/components/Toolbar/CustomButton.tsx";
import { useDialog } from "../react/src/hooks/useDialog.tsx";

function iconLoad({ size = 24, color = "currentColor", stroke = 2, ...props }) {
  // Source: Deepseek
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      strokeWidth={stroke}
      stroke={color}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 12a9 9 0 1 1 9 9" />
      <polyline points="3 8 3 12 7 12" />
      <line x1="12" y1="7" x2="12" y2="12" />
      <line x1="12" y1="12" x2="15" y2="14" />
    </svg>
  );
}

interface Props {
  elements: any[];
}

const ListWithDivs: React.FC<Props> = ({ elements }) => (
  <>
    {elements.map((el, idx) => (
      <div key={idx} style={{ border: "1px solid #333", padding: "16px" }}>
        {typeof el === "string" ? (
          <span dangerouslySetInnerHTML={{ __html: el }} />
        ) : (
          el
        )}
      </div>
    ))}
  </>
);

function jointHistory(inputList: any[]) {
  return <ListWithDivs elements={inputList} />;
}

function History() {
  const tooltip = "Show Result History";
  const icon = iconLoad({ size: 24, color: "#202020", stroke: 1 });
  const key = "Show-History";
  const { context, setContext, settings, refs } = useContext(WorkbookContext);
  const { showDialog, hideDialog } = useDialog();
  return (
    <CustomButton
      key={key}
      tooltip={tooltip}
      icon={icon}
      onClick={async () => {
        console.log(context.resHistory);
        // Keep the length of the History for the latest 50 results
        // avoid overflow
        setContext((draftCtx) => {
          if (draftCtx.resHistory.length > 50) {
            draftCtx.resHistory = draftCtx.resHistory.slice(-50);
          }
          // draftCtx.resHistory.push("sdf");
        });
        showDialog(jointHistory(context.resHistory), "ok");
      }}
    />
  );
}

export default History;
