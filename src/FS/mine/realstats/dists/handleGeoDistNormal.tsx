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
        <h2>Geometric pmf</h2>
        <p>
          geomPdf({xVal.value.toString()}, {df.value.toString()}) ={" "}
          {distres.toFixed(6)}
        </p>
      </div>
    );
  }

    const MenuText = () => (
        <>
            Calculate the Probability Mass Function (pmf) value of one
            <br />
            geometric distribution at given X position. Define the
            <br />
            distribution by the probability of success. The X value 
            <br />
            represents the nthe first success occurring on the x-th 
            <br />
            trial and must be a positive integer.
            <br /><br />
        </>
    );

  showDialog(
    false,
    <div>
      <h2>Geometric pmf</h2>
            <MenuText />
      <NumberInput variable={df} textLabel="Prob Success, p: " step="0.1" />
      <NumberInput variable={xVal} textLabel="X (positive int): " step="1" />
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
      cdf(Number(upb.value) - 1, Number(sd.value)) ;//-
      // cdf(Number(lowb.value) - 1, Number(sd.value));
    return (
      <div>
        <h2>Geometric cdf</h2>
        <p>
          geom_cdf({upb.value.toString()},{" "}
          {sd.value.toString()}) = {distres.toFixed(4)}
        </p>
      </div>
    );
  }
    const MenuText = () => (
        <>
            Calculate the cumulative distribution function (cdf) value 
            <br />
            of one geometric distribution. Define the distribution by
            <br /> 
            the probability of success. The X value represents P(x ≤ X)
            <br />
            —cumulative probability of first success occurring on or 
            <br />
            before the x-th trial and must be a positive integer.
            <br /><br />
        </>
    );

  showDialog(
    false,
    <div>
      <h2>Geometric cdf</h2> <MenuText />
      <NumberInput variable={sd} textLabel="Prob Success, p: " step="0.1" />
      {/* <NumberInput variable={lowb} textLabel="Lower Bound: " step="1" /> */}
      <NumberInput variable={upb} textLabel="X (positive int): " step="1" />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, zzzTest(), "ok");
    } // CAll back function when "OK" clicked.
  );
}
