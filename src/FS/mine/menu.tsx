// import handleMyMenuClick from './menuClick.tsx'
import { useContext} from "react";
// import _ from "lodash";
import Combo from "../react/src/components/Toolbar/Combo.tsx";
import {MenuDivider} from "../react/src/components/Toolbar/Divider.tsx";
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
// import SubMenuOne from "./submenu1.tsx";
import SubMenuSan from "./submenu3.tsx";
import SubMenuTwo from "./submenu2.tsx";

function MyMenu() {
  const { context, setContext,refs } = useContext(WorkbookContext);
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
    // if (value === "|" ){
    //     return <MenuDivider />
    // }
   // if (value === "highlight") {
   //    }
    else if (value === "mona") {
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
        text: "whatever",
        value:"sub3",
    },
    {
      text: "Moooon 3",
      value: "moon",
    },
    {
        text: "sub mennneu",
        value: "highlight",
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
         text: "sdf",
         value:"|",
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
    }, /////////////////////////
    {
      text: "1-Prop z interval",
      value: "add",
    },
    {
      text: "2-Prop z interval",
      value: "2propz",
    },
    {
      text: "t interval",
      value: "ttest",
    },
    {
      text: "2-Sample t interval",
      value: "2ttest",
    },
  ];

  return (
    <Combo text="Menuuuu" key="MyMenu" tooltip="Ehhhhh....">
      {(setOpen) => (
        <Select  style={{ overflow: "visible" }} >
          {items.map(({ text, value }) => {
           if (value==="|"){
              return <MenuDivider />;
           } else if (value==="highlight"){
            return <SubMenuTwo setOpen={setOpen} />;
          } else if (value==="sub3"){
              return <SubMenuSan setOpen={setOpen} />;
          } else {
           return (
            <Option
              key={value}
              onClick={() => {
                handleMyMenuClick(value);
                setOpen(false);
              }}
            > 
              <div className="fortune-toolbar-menu-line">
                {text}
                {/* <SVGIcon name={value} />
                         Can insert 24x24 SVG icon here */}
              </div>
            </Option>
            );
          }
          })}
        </Select>
      )}
    </Combo>
  );
}

export default MyMenu;
