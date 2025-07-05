import NumberInput from "../../inputs/NumberInput.tsx";
import MyGuiVar from "../../myGuiVar.tsx";
import { pdf, cdf, quantile } from "@stdlib/stats-base-dists-normal";

export function handleNormPdf(
  showDialog: (
    isResult: boolean,
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) => void
) {
  let xVal = new MyGuiVar(0);
  let mean = new MyGuiVar(0);
  let sd = new MyGuiVar(1);

  function zzzTest() {
    const distres = pdf(
      Number(xVal.value),
      Number(mean.value),
      Number(sd.value)
    );
    const align: ("left" | "center" | "right")[] = ["left", "center"];
    return (
      <div>
        <h2>Normal Pdf</h2>
        <p>
          normPdf({xVal.value.toString()}, {mean.value.toString()},{" "}
          {sd.value.toString()}) =
        </p>
        <p>{distres.toFixed(6)}</p>
      </div>
    );
  }

  showDialog(
    false,
    <div>
      <h2>Normal Pdf</h2>
      <NumberInput variable={xVal} textLabel="X Value: " step="1" />
      <NumberInput variable={mean} textLabel="μ: " step="1" />
      <NumberInput variable={sd} textLabel="σ: " step="1" />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, zzzTest(), "ok");
    } // CAll back function when "OK" clicked.
  );
}

export function handleNormCdf(
  showDialog: (
    isResult: boolean,
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) => void
) {
  let lowb = new MyGuiVar(-9999);
  let upb = new MyGuiVar(0);
  let mean = new MyGuiVar(0);
  let sd = new MyGuiVar(1);

  function zzzTest() {
    if (Number(upb.value) < Number(lowb.value)) {
      return <div>Error: Upper bound has to be greater than lower bound</div>;
    }
    const distres =
      cdf(Number(upb.value), Number(mean.value), Number(sd.value)) -
      cdf(Number(lowb.value), Number(mean.value), Number(sd.value));
    const align: ("left" | "center" | "right")[] = ["left", "center"];
    return (
      <div>
        <h2>Normal Cdf</h2>
        <p>
          normCdf({lowb.value.toString()}, {upb.value.toString()},{" "}
          {mean.value.toString()}, {sd.value.toString()}) =
        </p>
        <p>{distres.toFixed(4)}</p>
      </div>
    );
  }

  showDialog(
    false,
    <div>
      <h2>Normal Cdf</h2>
      <NumberInput variable={lowb} textLabel="Lower Bound: " step="1" />
      <NumberInput variable={upb} textLabel="Upper Bound: " step="1" />
      <NumberInput variable={mean} textLabel="μ: " step="1" />
      <NumberInput variable={sd} textLabel="σ: " step="1" />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, zzzTest(), "ok");
    } // CAll back function when "OK" clicked.
  );
}

export function handleInvNorm(
  showDialog: (
    isResult: boolean,
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) => void
) {
  let area = new MyGuiVar(0);
  let mean = new MyGuiVar(0);
  let sd = new MyGuiVar(1);

  function zzzTest() {
    if (Number(area.value) > 1) {
      return <div>Error: Area domain error</div>;
    }
    const distres = quantile(
      Number(area.value),
      Number(mean.value),
      Number(sd.value)
    );
    const align: ("left" | "center" | "right")[] = ["left", "center"];
    return (
      <div>
        <h2>Inverse Normal</h2>
        <p>
          invNorm({area.value.toString()}, {mean.value.toString()},{" "}
          {sd.value.toString()}) =
        </p>
        <p>{distres.toFixed(6)}</p>
      </div>
    );
  }

  showDialog(
    false,
    <div>
      <h2>Inverse Normal</h2>
      <NumberInput variable={area} textLabel="Area: " step="0.01" />
      <NumberInput variable={mean} textLabel="μ: " step="1" />
      <NumberInput variable={sd} textLabel="σ: " step="1" />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, zzzTest(), "ok");
    } // CAll back function when "OK" clicked.
  );
}
