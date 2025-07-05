// import handleMyMenuClick from './menuClick.tsx'
import { useContext } from "react";
// import _ from "lodash";
import Combo from "../react/src/components/Toolbar/Combo.tsx";
import { MenuDivider } from "../react/src/components/Toolbar/Divider.tsx";
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
import SubMenuCI from "./submenus/submenuCI.tsx";
// import {showDialogWithHistory} from "./history.tsx";
// import SubMenuOne from "./submenu1.tsx";
import SubMenuSan from "./submenus/submenu3.tsx";
import SubMenuTwo from "./submenus/submenu2.tsx";
import SubMenuDist from "./submenus/submenuDist.tsx";

function MyMenu() {
  const { context, setContext, refs } = useContext(WorkbookContext);
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
      text: "sdf",
      value: "|",
    },
    /////////////////////////
    {
      text: "whatever",
      value: "sub3",
    },
    {
      text: "Distributions",
      value: "subdist",
    },
    {
      text: "subci",
      value: "subci",
    },
    {
      text: "sub mennneu",
      value: "highlight",
    },
  ];

  return (
    <Combo text="Menuuuu" key="MyMenu" tooltip="Ehhhhh....">
      {(setOpen) => (
        <Select style={{ overflow: "visible" }}>
          {items.map(({ text, value }) => {
            if (value === "|") {
              return <MenuDivider />;
            } else if (value === "highlight") {
              return <SubMenuTwo setOpen={setOpen} />;
            } else if (value === "sub3") {
              return <SubMenuSan setOpen={setOpen} />;
            } else if (value == "subci") {
              return <SubMenuCI setOpen={setOpen} />;
            } else if (value == "subdist") {
              return <SubMenuDist setOpen={setOpen} />;
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
