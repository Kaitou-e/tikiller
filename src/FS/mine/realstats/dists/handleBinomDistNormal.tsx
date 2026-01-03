import { pmf, cdf } from "@stdlib/stats-base-dists-binomial";
import NumberInput from "../../inputs/NumberInput.tsx";
import MyGuiVar from "../../myGuiVar.tsx";
import { pdf } from "@stdlib/stats/base/dists/arcsine";

export function handleBiPdf(
  showDialog: (
    isResult: boolean,
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) => void
) {
  let xVal = new MyGuiVar(0);
  let mean = new MyGuiVar(0.5); // p
  let sd = new MyGuiVar(1); // n

  function zzzTest() {
    const distres = pmf(
      Number(xVal.value),
      Number(sd.value),
      Number(mean.value)
    );

    return (
      <div>
        <h2>Binomial pmf</h2>
        <p>
          binom_pmf({sd.value.toString()}, {mean.value.toString()},{" "}
          {xVal.value.toString()}) = {distres.toFixed(6)}
        </p>
      </div>
    );
  }
    const MenuText = () => (
        <>
            Calculate the Probability Mass Function (pmf) value of one
            <br />
            Binomial distribution at given X position. Define the
            <br />
            distribution by the number of trials and probability of 
            <br />
            success. The X value represents the number of succeeded 
            <br />
            times and must be an integer.
            <br /><br />
        </>
    );

  showDialog(
    false,
    <div>
      <h2>Binomial pmf</h2>
          <MenuText />
      <NumberInput variable={sd} textLabel="Num Trials, n: " step="1" />
      <NumberInput variable={mean} textLabel="Prob. Success: " step="0.1" />
      <NumberInput variable={xVal} textLabel="X value (Integer): " step="1" />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, zzzTest(), "ok");
    } // CAll back function when "OK" clicked.
  );
}

export function handleBiCdf(
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
  let mean = new MyGuiVar(1);
  let sd = new MyGuiVar(0.5);

  function zzzTest() {
    if (Number(upb.value) < Number(lowb.value)) {
      return <div>Error: Upper bound has to be greater than lower bound</div>;
    }
    let distres = 0;
    for (let i = 0; i <= Number(upb.value); i++) {
      distres += pmf(i, Number(mean.value), Number(sd.value));
    }
    // const distres =
    //   cdf(Number(upb.value), Number(mean.value), Number(sd.value)) -
    //   cdf(Number(lowb.value), Number(mean.value), Number(sd.value));

    return (
      <div>
        <h2>Binomial cdf</h2>
        <p>
          binom_cdf({mean.value.toString()}, {sd.value.toString()},{" "}
          {lowb.value.toString()}, {upb.value.toString()}) ={" "}
          {distres.toFixed(4)}
        </p>
      </div>
    );
  }
      const MenuText = () => (
        <>
            Calculate the cumulative distribution function (cdf) value of one
            <br />
            Binomial distribution. Binomial CDF gives the cumulative probability 
            <br />
            P(X ≤ k) for a binomial random variable—sum of individual PMF 
            <br /> 
            probabilities from 0 to k. Define distribution by the number of 
            <br />
            trials and probability of success. The X value represents the 
            <br />
            number of succeeded times and must be an integer.
            <br /><br />
        </>
    );

  showDialog(
    false,
    <div>
      <h2>Binomial cdf</h2>
        <MenuText />
      <NumberInput variable={mean} textLabel="Num Trials, n: " step="1" />
      <NumberInput variable={sd} textLabel="Prob Success, p: " step="0.1" />
      {/* <NumberInput variable={lowb} textLabel="Lower Bound: " step="1" /> */}
      <NumberInput variable={upb} textLabel="X (Integer): " step="1" />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, zzzTest(), "ok");
    } // CAll back function when "OK" clicked.
  );
}
