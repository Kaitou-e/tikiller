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
import handleChiGOF from "../realstats/handleChiGOF.tsx";

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
      text: "1-Prop z Test",
      value: "add",
    },
    {
      text: "2-Prop z Test",
      value: "2propz",
    },
    {
      text: "t Test",
      value: "ttest",
    },
    {
      text: "2-Sample t Test",
      value: "2ttest",
    }, /////////////////////////
    {
      text: "χ2 GOF",
      value: "chigof",
    },
    {
      text: "χ2 2-way Test",
      value: "chi2way",
    },
  ];
  const handleSubMenuClicks = (value: string) => {
    if (value === "add") {
      handleAdd(data, showDialogWithHistory);
    } else if (value === "2propz") {
      handle2PropZ(data, showDialogWithHistory);
    } else if (value === "ttest") {
      handleTTest(data, showDialogWithHistory);
    } else if (value === "onevarstats") {
      handleOneVarStats(data, showDialogWithHistory);
    } else if (value === "2ttest") {
      handle2TTest(data, showDialogWithHistory);
    } else if (value === "chigof") {
      handleChiGOF(data, showDialogWithHistory);
    } else if (value === "chi2way") {
    }
  };

  return (
    <SubMenu
      text="Stat Tests"
      setOpen={setOpen}
      subMenuItems={subMenuItems}
      handleSubMenuClicks={handleSubMenuClicks}
    />
  );
};

export default SubMenuSan;
