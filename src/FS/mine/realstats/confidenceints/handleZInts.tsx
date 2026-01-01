import { pmf, cdf } from "@stdlib/stats-base-dists-binomial";
import NumberInput from "../../inputs/NumberInput.tsx";
import MyGuiVar from "../../myGuiVar.tsx";
import quantile from "@stdlib/stats-base-dists-normal-quantile";
import Table from "../../tableGen2.tsx";

export function handle1PropZInt(
  showDialog: (
    isResult: boolean,
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) => void
) {
  let xVal = new MyGuiVar(0.95); // CL
  let mean = new MyGuiVar(0); // num success
  let sd = new MyGuiVar(1); // num trials

  function onePropZInterval(
    successes: number,
    trials: number,
    confidence: number = 0.95
  ): { lower: number; upper: number; p: number } {
    if (trials === 0) return { lower: NaN, upper: NaN, p: NaN };
    const pHat = successes / trials;
    const alpha = 1 - confidence;
    const zStar = quantile(1 - alpha / 2, 0, 1); // e.g., 1.96 for 95%
    const se = Math.sqrt((pHat * (1 - pHat)) / trials);
    return {
      lower: pHat - zStar * se,
      upper: pHat + zStar * se,
      p: pHat,
    };
  }

  function zzzTest() {
    const distres = onePropZInterval(
      Number(mean.value),
      Number(sd.value),
      Number(xVal.value)
    );
    const tableRes = [
      ["CLower", distres.lower.toFixed(6)],
      ["CUpper", distres.upper.toFixed(6)],
      ["p̂", distres.p.toFixed(6)],
      ["ME", (distres.upper - distres.p).toFixed(6)],
      ["n", sd.value.toString()],
    ];
    const align: ("left" | "center" | "right")[] = ["left", "center"];
    return (
      <div>
        <h2>1-Prop z Interval</h2>
        <Table data={tableRes} align={align} />
        {/* <p>alternate hyp: {altHyp.value.toString()}</p>
        <p>sample prop = {sampleProp}</p>
        <p>z score = {testres.z}</p>
        <p>p value = {testres.pValue}</p> */}
      </div>
    );
  }

  showDialog(
    false,
    <div>
      <h2>1-Prop z Interval</h2>
      <NumberInput variable={mean} textLabel="Num. Success: " step="1" />
      <NumberInput variable={sd} textLabel="Num Trials, n: " step="1" />
      <NumberInput variable={xVal} textLabel="Confidence level: " step="0.01" />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, zzzTest(), "ok");
    } // CAll back function when "OK" clicked.
  );
}

export function handle2PropZInt(
  showDialog: (
    isResult: boolean,
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) => void
) {
  let x1 = new MyGuiVar(0);
  let n1 = new MyGuiVar(1);
  let x2 = new MyGuiVar(0);
  let n2 = new MyGuiVar(1);
  let Clev = new MyGuiVar(0.95);

  function twoPropZInterval(
    successes1: number,
    trials1: number,
    successes2: number,
    trials2: number,
    confidence: number = 0.95
  ): { lower: number; upper: number } {
    if (trials1 === 0 || trials2 === 0) return { lower: NaN, upper: NaN };
    const p1 = successes1 / trials1;
    const p2 = successes2 / trials2;
    const diff = p1 - p2;
    const alpha = 1 - confidence;
    const zStar = quantile(1 - alpha / 2, 0, 1);
    const se = Math.sqrt((p1 * (1 - p1)) / trials1 + (p2 * (1 - p2)) / trials2);
    return {
      lower: diff - zStar * se,
      upper: diff + zStar * se,
    };
  }

  function zzzTest() {
    let distres = twoPropZInterval(
      Number(x1.value),
      Number(n1.value),
      Number(x2.value),
      Number(n2.value),
      Number(Clev.value)
    );
    const tableRes = [
      ["CLower", distres.lower.toFixed(6)],
      ["CUpper", distres.upper.toFixed(6)],
      [
        "p̂Diff",
        (
          Number(x1.value) / Number(n1.value) -
          Number(x2.value) / Number(n2.value)
        ).toFixed(6),
      ],
      ["ME", ((distres.upper - distres.lower) / 2).toFixed(6)],
      ["p̂1", (Number(x1.value) / Number(n1.value)).toFixed(6)],
      ["p̂2", (Number(x2.value) / Number(n2.value)).toFixed(6)],
      ["n1", n1.value.toString()],
      ["n2", n2.value.toString()],
    ];
    const align: ("left" | "center" | "right")[] = ["left", "center"];
    return (
      <div>
        <h2>2-Prop z Interval</h2>
        <Table data={tableRes} align={align} />
        {/* <p>alternate hyp: {altHyp.value.toString()}</p>
        <p>sample prop = {sampleProp}</p>
        <p>z score = {testres.z}</p>
        <p>p value = {testres.pValue}</p> */}
      </div>
    );
  }

  showDialog(
    false,
    <div>
      <h2>2-Prop z Interval</h2>
      <NumberInput variable={x1} textLabel="Successes, x1: " step="1" />
      <NumberInput variable={n1} textLabel="n1: " step="1" />
      <NumberInput variable={x2} textLabel="Successes, x2: " step="1" />
      <NumberInput variable={n2} textLabel="n2: " step="1" />
      <NumberInput variable={Clev} textLabel="C Level: " step="0.01" />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, zzzTest(), "ok");
    } // CAll back function when "OK" clicked.
  );
}
