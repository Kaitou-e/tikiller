// import handleMyMenuClick from './menuClick.tsx'
import { useContext } from "react";
import Combo from "../react/src/components/Toolbar/Combo.tsx";
import Select, { Option } from "../react/src/components/Toolbar/Select.tsx";
import WorkbookContext from "../react/src/context";
// import { Context } from '../core/src/context.ts'
import { useDialog } from "../react/src/hooks/useDialog.tsx";
import handleGenshin from "./example_handles/handleGenshin.tsx";
import { getFlowdata } from "../core";
import handleZZZ from "./example_handles/handleZZZ.tsx";
import handleMoon from "./example_handles/handleMoon.tsx";
import handleNeg from "./example_handles/handleNeg.tsx";
import handleYeti from "./example_handles/handleYeti.tsx";
import handleAdd from "./realstats/handle1PropZ.tsx";
import handle2PropZ from "./realstats/handle2PropZ.tsx";
import handleTTest from "./realstats/handleTTest.tsx";
import handleOneVarStats from "./realstats/handleOneVarStats.tsx";
import handle2TTest from "./realstats/handle2TTest.tsx";
// import {showDialogWithHistory} from "./history.tsx";

function MyMenu() {
  const { context, setContext } = useContext(WorkbookContext);
  const { showDialog, hideDialog } = useDialog();

  function showDialogWithHistory(
    isResult: boolean,
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) {
    // const { showDialog, hideDialog } = useDialog();
    // const { context, setContext, settings, refs } = useContext(WorkbookContext);
    if (isResult) {
      setContext((draftCtx) => {
        draftCtx.resHistory.push(content);
      });
    }
    showDialog(content, type, onOk, onCancel);
  }

  function handleMyMenuClick(
    // ctx: Context,
    value: string | null = null
  ) {
    // const { showDialog, hideDialog } = useDialog()
    console.log("handle my menu click", value);
    const data = getFlowdata(context) as any[][];

    if (!value) return;
    if (value === "mona") {
      showDialog("Mona no Lisa", "ok");
    } else if (value === "lisa") {
      showDialog("Lisa no Mona", "yesno", () => {
        // the onClick callback function.
        showDialog("dafenqi", "ok");
      });
    } else if (value === "genshin") {
      handleGenshin(data, showDialogWithHistory);
    } else if (value === "zzz") {
      handleZZZ(data, showDialog);
    } else if (value === "moon") {
      handleMoon(data, showDialogWithHistory);
    } else if (value === "neg") {
      handleNeg(data, showDialog);
    } else if (value === "yeti") {
      handleYeti(data, showDialog);
    } else if (value === "add") {
      handleAdd(data, showDialogWithHistory);
    } else if (value === "2propz") {
      handle2PropZ(data, showDialogWithHistory);
    } else if (value === "ttest") {
      handleTTest(data, showDialogWithHistory);
    } else if (value === "onevarstats") {
      handleOneVarStats(data, showDialogWithHistory);
    } else if (value === "2ttest") {
      handle2TTest(data, showDialogWithHistory);
    }
  }
  const items = [
    {
      text: "M..o...na",
      value: "mona",
    },
    {
      text: "L....is...a",
      value: "lisa",
    },
    {
      text: "Traveller.PAIMON",
      value: "genshin",
    },
    {
      text: "ZZZZZ  ZZZZ",
      value: "zzz",
    },
    {
      text: "Moooon 3",
      value: "moon",
    },
    {
      text: "Can I use negotiation?",
      value: "neg",
    },
    {
      text: "water bootle",
      value: "yeti",
    },
    {
      text: "One Variable Stats",
      value: "onevarstats",
    },
    {
      text: "1-Prop z Test",
      value: "add",
    },
    {
      text: "2-Prop z Test",
      value: "2propz",
    },
    {
      text: "t test",
      value: "ttest",
    },
    {
      text: "2-Sample t Test",
      value: "2ttest",
    },
  ];
  return (
    <Combo text="Menuuuu" key="MyMenu" tooltip="Ehhhhh....">
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
                handleMyMenuClick(value);
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

export default MyMenu;
