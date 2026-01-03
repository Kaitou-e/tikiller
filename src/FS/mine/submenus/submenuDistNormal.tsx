import { useDialog } from "../../react/src/hooks/useDialog.tsx";
import { useContext } from "react";
import { getFlowdata } from "../../core/src/index.ts";
import WorkbookContext from "../../react/src/context/index.ts";
import SubMenu from "./submenu.tsx";
import {
  handleNormPdf,
  handleInvNorm,
  handleNormCdf,
} from "../realstats/dists/handleNormDistNormal.tsx";
import {
  handleTPdf,
  handleInvT,
  handleTCdf,
} from "../realstats/dists/handleTDistNormal.tsx";
import {
  handleBiCdf,
  handleBiPdf,
} from "../realstats/dists/handleBinomDistNormal.tsx";
import {
  handleGeoCdf,
  handleGeoPdf,
} from "../realstats/dists/handleGeoDistNormal.tsx";

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
      text: "Normal pdf",
      value: "normpdf",
    },
    {
      text: "Normal cdf",
      value: "normcdf",
    },
    {
      text: "Normal ppf",
      value: "invnorm",
    },
    {
      text: "Student's t pdf",
      value: "tpdf",
    },
    {
      text: "Student's t cdf",
      value: "tcdf",
    },
    {
      text: "Student's t ppf",
      value: "invt",
    },
    {
      text: "Binomial pdf",
      value: "bipdf",
    },
    {
      text: "Binomial cdf",
      value: "bicdf",
    },
    {
      text: "Geometric pdf",
      value: "geopdf",
    },
    {
      text: "Geometric cdf",
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
