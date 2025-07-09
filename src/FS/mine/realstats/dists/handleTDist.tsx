import NumberInput from "../../inputs/NumberInput.tsx";
import MyGuiVar from "../../myGuiVar.tsx";
import { pdf, cdf, quantile } from "@stdlib/stats-base-dists-t";

export function handleTPdf(
  showDialog: (
    isResult: boolean,
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) => void
) {
  let xVal = new MyGuiVar(0);
  let df = new MyGuiVar(1);

  function zzzTest() {
    const distres = pdf(Number(xVal.value), Number(df.value));
    const align: ("left" | "center" | "right")[] = ["left", "center"];
    return (
      <div>
        <h2>t Pdf</h2>
        <p>
          tPdf({xVal.value.toString()}, {df.value.toString()}) ={" "}
          {distres.toFixed(6)}
        </p>
      </div>
    );
  }

  showDialog(
    false,
    <div>
      <h2>t Pdf</h2>
      <NumberInput variable={xVal} textLabel="X Value: " step="1" />
      <NumberInput
        variable={df}
        textLabel="Degrees of Freedom, df: "
        step="1"
      />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, zzzTest(), "ok");
    } // CAll back function when "OK" clicked.
  );
}

export function handleTCdf(
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
  let sd = new MyGuiVar(1); // sd = df

  function zzzTest() {
    if (Number(upb.value) < Number(lowb.value)) {
      return <div>Error: Upper bound has to be greater than lower bound</div>;
    }
    const distres =
      cdf(Number(upb.value), Number(sd.value)) -
      cdf(Number(lowb.value), Number(sd.value));
    const align: ("left" | "center" | "right")[] = ["left", "center"];
    return (
      <div>
        <h2>t Cdf</h2>
        <p>
          tCdf({lowb.value.toString()}, {upb.value.toString()},{" "}
          {sd.value.toString()}) = {distres.toFixed(4)}
        </p>
      </div>
    );
  }

  showDialog(
    false,
    <div>
      <h2>t Cdf</h2>
      <NumberInput variable={lowb} textLabel="Lower Bound: " step="1" />
      <NumberInput variable={upb} textLabel="Upper Bound: " step="1" />
      <NumberInput
        variable={sd}
        textLabel="Degrees of Freedom, df: "
        step="1"
      />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, zzzTest(), "ok");
    } // CAll back function when "OK" clicked.
  );
}

export function handleInvT(
  showDialog: (
    isResult: boolean,
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) => void
) {
  let area = new MyGuiVar(0);
  let sd = new MyGuiVar(1);

  function zzzTest() {
    if (Number(area.value) > 1) {
      return <div>Error: Area domain error</div>;
    }
    const distres = quantile(Number(area.value), Number(sd.value));
    const align: ("left" | "center" | "right")[] = ["left", "center"];
    return (
      <div>
        <h2>Inverse t</h2>
        <p>
          invt({area.value.toString()}, {sd.value.toString()}) ={" "}
          {distres.toFixed(6)}
        </p>
      </div>
    );
  }

  showDialog(
    false,
    <div>
      <h2>Inverse t</h2>
      <NumberInput variable={area} textLabel="Area: " step="0.01" />
      <NumberInput
        variable={sd}
        textLabel="Degrees of Freedom, df: "
        step="1"
      />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, zzzTest(), "ok");
    } // CAll back function when "OK" clicked.
  );
}
