// import handleMyMenuClick from './menuClick.tsx'
import { useContext } from "react";
// import _ from "lodash";
import Combo from "../react/src/components/Toolbar/Combo.tsx";
import { MenuDivider } from "../react/src/components/Toolbar/Divider.tsx";
import Select, { Option } from "../react/src/components/Toolbar/Select.tsx";
import WorkbookContext from "../react/src/context";
import { useDialog } from "../react/src/hooks/useDialog.tsx";
import handleGenshin from "./example_handles/handleGenshin.tsx";
import { getFlowdata } from "../core";

import SubMenuCI from "./submenus/submenuCI.tsx";
import SubMenuSan from "./submenus/submenu3.tsx";
import SubMenuTwo from "./submenus/submenu2.tsx";
import SubMenuDist from "./submenus/submenuDist.tsx";

import nonTInotice, { TInotice } from "./menuNotices.tsx"
import handleOneVarStatsNormal from "./realstats/handleOneVarStatsNormal.tsx";
import SubMenuDistNormal from "./submenus/submenuDistNormal.tsx";
import SubMenuCINormal from "./submenus/submenuCINormal.tsx";
import SubMenuTwoNormal from "./submenus/submenu2Normal.tsx";

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
    else if (value === "TI calc") {
      TInotice(showDialogWithHistory);
    }    else if (value === "nonTI") {
      nonTInotice(showDialogWithHistory);
    } else if (value === "describe") {
      handleOneVarStatsNormal(data, showDialogWithHistory);
    }
  }

  const items = [
    {
      text: "== Conventional Stats ==",
      value: "nonTI",
    },
    {
      text: "Data Describe",
      value: "describe",
    },
        {
      text: "Distributions",
      value: "subdistNormal",
    },
        {
      text: "subci",
      value: "subci2",
    },
    {
      text: "sub mennneu",
      value: "highlight2",
    },
    {
      text: "sdf",
      value: "|",
    },
    /////////////////////////
    {
      text: "== TI Calculator Dupe ==",
      value: "TI calc",
    },
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
    <Combo text="Menu" key="MyMenu" tooltip="Stat Tools">
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
            } else if (value == "subdistNormal") {
              return <SubMenuDistNormal setOpen={setOpen} />;
            } else if (value == "subci2") {
              return <SubMenuCINormal setOpen={setOpen} />;
            } else if (value == "highlight2") {
              return <SubMenuTwoNormal setOpen={setOpen} />;
            }else {
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
