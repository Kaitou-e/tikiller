import { useDialog } from "../../react/src/hooks/useDialog.tsx";
import { useContext } from "react";
import { getFlowdata } from "../../core/src/index.ts";
import WorkbookContext from "../../react/src/context/index.ts";
import handleAdd from "../realstats/handle1PropZ.tsx";
import handle2PropZ from "../realstats/handle2PropZ.tsx";
import SubMenu from "./submenu.tsx";
import handle2TTest from "../realstats/handle2TTest.tsx";
import handleOneVarStats from "../realstats/handleOneVarStats.tsx";
import handleTTest from "../realstats/handleTTest.tsx";

const SubMenuSan: React.FC<{
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setOpen }) => {
  const { showDialog } = useDialog();
  const { context, setContext, refs } = useContext(WorkbookContext);
  const data = getFlowdata(context) as any[][];

  function showDialogWithHistory(
    isResult: boolean,
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) {
    if (isResult) {
      setContext((draftCtx) => {
        draftCtx.resHistory.push(content);
      });
    }
    showDialog(content, type, onOk, onCancel);
  }

  const subMenuItems: { text: string; value: string }[] = [
    {
      text: "1-Prop z interval",
      value: "1pz",
    },
    {
      text: "2-Prop z interval",
      value: "2pz",
    },
    {
      text: "t interval",
      value: "tci",
    },
    {
      text: "2-Sample t interval",
      value: "2st",
    },
  ];
  const handleSubMenuClicks = (value: string) => {
    if (value === "1pz") {
      handleOneVarStats(data, showDialogWithHistory);
    } else if (value === "2pz") {
    } else if (value === "tci") {
    } else if (value === "2st") {
    }
  };

  return (
    <SubMenu
      text="Confidence Intervals"
      setOpen={setOpen}
      subMenuItems={subMenuItems}
      handleSubMenuClicks={handleSubMenuClicks}
    />
  );
};

export default SubMenuSan;
