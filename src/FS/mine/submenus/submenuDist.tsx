import { useDialog } from "../../react/src/hooks/useDialog.tsx";
import { useContext } from "react";
import { getFlowdata } from "../../core/src/index.ts";
import WorkbookContext from "../../react/src/context/index.ts";
import SubMenu from "./submenu.tsx";
import {
  handleNormPdf,
  handleInvNorm,
  handleNormCdf,
} from "../realstats/dists/handleNormDist.tsx";
import {
  handleTPdf,
  handleInvT,
  handleTCdf,
} from "../realstats/dists/handleTDist.tsx";
import {
  handleBiCdf,
  handleBiPdf,
} from "../realstats/dists/handleBinomDist.tsx";
import {
  handleGeoCdf,
  handleGeoPdf,
} from "../realstats/dists/handleGeoDist.tsx";

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
      text: "Normal Pdf",
      value: "normpdf",
    },
    {
      text: "Normal Cdf",
      value: "normcdf",
    },
    {
      text: "Inverse Normal",
      value: "invnorm",
    },
    {
      text: "t Pdf",
      value: "tpdf",
    },
    {
      text: "t Cdf",
      value: "tcdf",
    },
    {
      text: "Inverse t",
      value: "invt",
    },
    {
      text: "Binomial Pdf",
      value: "bipdf",
    },
    {
      text: "Binomial Cdf",
      value: "bicdf",
    },
    {
      text: "Geometric Pdf",
      value: "geopdf",
    },
    {
      text: "Geometric Cdf",
      value: "geocdf",
    },
  ];
  const handleSubMenuClicks = (value: string) => {
    if (value === "normpdf") {
      handleNormPdf(showDialogWithHistory);
    } else if (value === "normcdf") {
      handleNormCdf(showDialogWithHistory);
    } else if (value === "invnorm") {
      handleInvNorm(showDialogWithHistory);
    } else if (value === "tpdf") {
      handleTPdf(showDialogWithHistory);
    } else if (value === "tcdf") {
      handleTCdf(showDialogWithHistory);
    } else if (value === "invt") {
      handleInvT(showDialogWithHistory);
    } else if (value === "bipdf") {
      handleBiPdf(showDialogWithHistory);
    } else if (value === "bicdf") {
      handleBiCdf(showDialogWithHistory);
    } else if (value === "geopdf") {
      handleGeoPdf(showDialogWithHistory);
    } else if (value === "geocdf") {
      handleGeoCdf(showDialogWithHistory);
    }
  };

  return (
    <SubMenu
      text="Distributions"
      setOpen={setOpen}
      subMenuItems={subMenuItems}
      handleSubMenuClicks={handleSubMenuClicks}
    />
  );
};

export default SubMenuSan;
