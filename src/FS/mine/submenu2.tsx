import { useDialog } from "../react/src/hooks/useDialog.tsx";
import { useContext} from "react";
import { getFlowdata } from "../core";
import WorkbookContext from "../react/src/context";
import handleAdd from "./realstats/handle1PropZ.tsx";
import handle2PropZ from "./realstats/handle2PropZ.tsx";
import SubMenu from "./submenu.tsx";

const SubMenuSan: React.FC<{
        setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ 
    setOpen, 
}) => {
  const { showDialog } = useDialog();
  const { context, setContext,refs } = useContext(WorkbookContext);
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

        const  subMenuItems :{ text: string; value: string }[] =          [
                  { text: "1 prop Z ...", value: ">" },
                  { text: "2 prop Z ...", value: "##" },
                ];
        const handleSubMenuClicks=(value:string)=>{
            if (value===">"){
      handleAdd(data, showDialogWithHistory);
                // showDialog("da yu","ok");
            } else if (value==="##"){
      handle2PropZ(data, showDialogWithHistory);
                // showDialog("jing jing hao","ok");
            }
        };

                return (<SubMenu text="sub2menu Zprop" setOpen={setOpen} subMenuItems={subMenuItems} handleSubMenuClicks={handleSubMenuClicks} />);

}

export default SubMenuSan;
