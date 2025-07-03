// import handleMyMenuClick from './menuClick.tsx'
import { useContext } from "react";
import Combo from "../react/src/components/Toolbar/Combo.tsx";
import Select, { Option } from "../react/src/components/Toolbar/Select.tsx";
import WorkbookContext from "../react/src/context";
// import { Context } from '../core/src/context.ts'
import { useDialog } from "../react/src/hooks/useDialog.tsx";
import handleGenshin from "./example_handles/handleGenshin.tsx";
import { getFlowdata } from "../core";
import handleBoxPlot from "./realstats/plot/handleBoxPlot.tsx";

function MyPlotMenu() {
  const { context, setContext } = useContext(WorkbookContext);
  const { showDialog, hideDialog } = useDialog();

  function handleMyPlotMenuClick(
    // ctx: Context,
    value: string | null = null
  ) {
    // const { showDialog, hideDialog } = useDialog()
    console.log("handle my menu click", value);
    const data = getFlowdata(context) as any[][];

    if (!value) return;
    if (value === "boxplot") {
      handleBoxPlot(data, showDialog);
    }
  }
  const items = [
    {
      text: "Box Plot",
      value: "boxplot",
    },
  ];
  return (
    <Combo text="Plot" key="MyPlotMenu" tooltip="Plot data...">
      {(setOpen) => (
        <Select>
          {items.map(({ text, value }) => (
            <Option
              key={value}
              onClick={() => {
                // setContext((ctx) => {
                // the setContext will trigger the function call twice
                // instead once. It's only useful when need change the
                // value of the spreadsheet. If just read the values
                // and do something, commenting it out is fine.
                handleMyPlotMenuClick(value);
                // });
                setOpen(false);
              }}
            >
              <div className="fortune-toolbar-menu-line">
                {text}
                {/* <SVGIcon name={value} />
                         Can insert 24x24 SVG icon here */}
              </div>
            </Option>
          ))}
        </Select>
      )}
    </Combo>
  );
}

export default MyPlotMenu;
