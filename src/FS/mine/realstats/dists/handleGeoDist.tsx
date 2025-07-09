import NumberInput from "../../inputs/NumberInput.tsx";
import MyGuiVar from "../../myGuiVar.tsx";
import { pmf, cdf } from "@stdlib/stats-base-dists-geometric";

export function handleGeoPdf(
  showDialog: (
    isResult: boolean,
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) => void
) {
  let xVal = new MyGuiVar(0);
  let df = new MyGuiVar(0.5);

  function zzzTest() {
    const distres = pmf(Number(xVal.value) - 1, Number(df.value));

    return (
      <div>
        <h2>Geometric Pdf</h2>
        <p>
          geomPdf({xVal.value.toString()}, {df.value.toString()}) ={" "}
          {distres.toFixed(6)}
        </p>
      </div>
    );
  }

  showDialog(
    false,
    <div>
      <h2>Geometric Pdf</h2>
      <NumberInput variable={df} textLabel="Prob Success, p: " step="0.1" />
      <NumberInput variable={xVal} textLabel="X Value: " step="1" />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, zzzTest(), "ok");
    } // CAll back function when "OK" clicked.
  );
}

export function handleGeoCdf(
  showDialog: (
    isResult: boolean,
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) => void
) {
  let lowb = new MyGuiVar(0);
  let upb = new MyGuiVar(1);
  let sd = new MyGuiVar(0.5);

  function zzzTest() {
    if (Number(upb.value) < Number(lowb.value)) {
      return <div>Error: Upper bound has to be greater than lower bound</div>;
    }
    const distres =
      cdf(Number(upb.value) - 1, Number(sd.value)) -
      cdf(Number(lowb.value) - 1, Number(sd.value));
    return (
      <div>
        <h2>Geometric Cdf</h2>
        <p>
          geomCdf({lowb.value.toString()}, {upb.value.toString()},{" "}
          {sd.value.toString()}) = {distres.toFixed(4)}
        </p>
      </div>
    );
  }

  showDialog(
    false,
    <div>
      <h2>Geometric Cdf</h2>
      <NumberInput variable={sd} textLabel="Prob Success, p: " step="0.1" />
      <NumberInput variable={lowb} textLabel="Lower Bound: " step="1" />
      <NumberInput variable={upb} textLabel="Upper Bound: " step="1" />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, zzzTest(), "ok");
    } // CAll back function when "OK" clicked.
  );
}
