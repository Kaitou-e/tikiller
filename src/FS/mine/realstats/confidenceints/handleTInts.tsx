import CheckBox from "../../inputs/CheckBox.tsx";
import NumberInput from "../../inputs/NumberInput.tsx";
import MyGuiVar from "../../myGuiVar.tsx";
// import quantile from "@stdlib/stats-base-dists-normal-quantile";
import Table from "../../tableGen2.tsx";
import quantile from "@stdlib/stats-base-dists-t-quantile";

type TIntervalResult = {
  lower: number;
  upper: number;
  mean: number;
  marginOfError: number;
  df: number;
};

type TwoSampleTIntervalResult = {
  lower: number;
  upper: number;
  meanDiff: number;
  marginOfError: number;
  df: number;
};

export function handleTInt(
  showDialog: (
    isResult: boolean,
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) => void
) {
  let cL = new MyGuiVar(0.95); // CL
  let ssize = new MyGuiVar(1);
  let stdd = new MyGuiVar(1);
  let m = new MyGuiVar(1);

  /**
   * One-sample t confidence interval for a mean.
   * @param cLevel Confidence level (e.g. 0.95)
   * @param n Sample size
   * @param sd Sample standard deviation
   * @param mean Sample mean
   */
  function oneSampleTInterval(
    cLevel: number,
    n: number,
    sd: number,
    mean: number
  ): TIntervalResult {
    if (n <= 1 || sd < 0) {
      return {
        lower: NaN,
        upper: NaN,
        mean,
        marginOfError: NaN,
        df: NaN,
      };
    }

    const df = n - 1;
    const alpha = 1 - cLevel;

    // two‑sided critical value t*
    const tStar = quantile(1 - alpha / 2, df); // Q(p, v)[web:5][web:10]

    const se = sd / Math.sqrt(n);
    const marginOfError = tStar * se;

    return {
      lower: mean - marginOfError,
      upper: mean + marginOfError,
      mean,
      marginOfError,
      df,
    };
  }

  function zzzTest() {
    const distres = oneSampleTInterval(
      Number(cL.value),
      Number(ssize.value),
      Number(stdd.value),
      Number(m.value)
    );
    const tableRes = [
      ["CLower", distres.lower.toFixed(6)],
      ["CUpper", distres.upper.toFixed(6)],
      ["x̄", distres.mean.toFixed(6)],
      ["ME", distres.marginOfError.toFixed(6)],
      ["df", distres.df],
      ["sx = s_(n-1)x", stdd.value.toString()],
      ["n", ssize.value.toString()],
    ];
    const align: ("left" | "center" | "right")[] = ["left", "center"];
    return (
      <div>
        <h2>t Interval</h2>
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
      <h2>t Interval</h2>
      <NumberInput variable={m} textLabel="x̄: " step="1" />
      <NumberInput variable={stdd} textLabel="Sx: " step="1" />
      <NumberInput variable={ssize} textLabel="n: " step="1" />
      <NumberInput variable={cL} textLabel="Confidence level: " step="0.01" />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, zzzTest(), "ok");
    } // CAll back function when "OK" clicked.
  );
}

export function handle2SampleTInt(
  showDialog: (
    isResult: boolean,
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) => void
) {
  let cL = new MyGuiVar(0.95); // CL
  let pool = new MyGuiVar(false);
  let ssize1 = new MyGuiVar(1);
  let stdd1 = new MyGuiVar(1);
  let m1 = new MyGuiVar(1);
  let ssize2 = new MyGuiVar(1);
  let stdd2 = new MyGuiVar(1);
  let m2 = new MyGuiVar(1);

  /**
   * Two-sample t confidence interval for μ1 - μ2.
   * @param cLevel Confidence level (e.g. 0.95)
   * @param n1 Sample size 1
   * @param sd1 Sample standard deviation 1
   * @param mean1 Sample mean 1
   * @param n2 Sample size 2
   * @param sd2 Sample standard deviation 2
   * @param mean2 Sample mean 2
   * @param pooled If true, use pooled-variance t interval; else use Welch
   */
  function twoSampleTInterval(
    cLevel: number,
    n1: number,
    sd1: number,
    mean1: number,
    n2: number,
    sd2: number,
    mean2: number,
    pooled: boolean
  ): TwoSampleTIntervalResult {
    // basic sanity check
    if (n1 <= 1 || n2 <= 1 || sd1 < 0 || sd2 < 0) {
      return {
        lower: NaN,
        upper: NaN,
        meanDiff: mean1 - mean2,
        marginOfError: NaN,
        df: NaN,
      };
    }

    const meanDiff = mean1 - mean2;

    let se: number;
    let df: number;

    if (pooled) {
      // Pooled variance t interval (equal variances assumed)[web:12][web:18]
      const sp2 = ((n1 - 1) * sd1 * sd1 + (n2 - 1) * sd2 * sd2) / (n1 + n2 - 2);
      const sp = Math.sqrt(sp2);
      se = sp * Math.sqrt(1 / n1 + 1 / n2);
      df = n1 + n2 - 2;
    } else {
      // Welch (unequal variances)[web:11][web:14][web:17]
      const s1n1 = (sd1 * sd1) / n1;
      const s2n2 = (sd2 * sd2) / n2;
      se = Math.sqrt(s1n1 + s2n2);

      const num = (s1n1 + s2n2) ** 2;
      const den = s1n1 ** 2 / (n1 - 1) + s2n2 ** 2 / (n2 - 1);
      df = num / den;
    }

    const alpha = 1 - cLevel;
    const tStar = quantile(1 - alpha / 2, df); // critical t[web:9][web:13]
    const marginOfError = tStar * se;

    return {
      lower: meanDiff - marginOfError,
      upper: meanDiff + marginOfError,
      meanDiff,
      marginOfError,
      df,
    };
  }

  function zzzTest() {
    let distres = twoSampleTInterval(
      Number(cL.value),
      Number(ssize1.value),
      Number(stdd1.value),
      Number(m1.value),
      Number(ssize2.value),
      Number(stdd2.value),
      Number(m2.value),
      pool.value as boolean
    );
    const tableRes = [
      ["CLower", distres.lower.toFixed(6)],
      ["CUpper", distres.upper.toFixed(6)],
      ["x̄Diff", distres.meanDiff.toFixed(6)],
      ["ME", distres.marginOfError.toFixed(6)],
      ["df", distres.df.toFixed(6)],
      ["x̄1", Number(m1.value).toFixed(6)],
      ["x̄2", Number(m2.value).toFixed(6)],
      ["sx1", stdd1.value.toString()],
      ["sx2", stdd2.value.toString()],
      ["n1", ssize1.value.toString()],
      ["n2", ssize2.value.toString()],
    ];
    const align: ("left" | "center" | "right")[] = ["left", "center"];
    return (
      <div>
        <h2>2-Sample t Interval</h2>
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
      <h2>2-Sample t Interval</h2>
      <NumberInput variable={m1} textLabel="x̄1: " step="1" />
      <NumberInput variable={stdd1} textLabel="Sx1: " step="1" />
      <NumberInput variable={ssize1} textLabel="n1: " step="1" />
      <NumberInput variable={m2} textLabel="x̄2: " step="1" />
      <NumberInput variable={stdd2} textLabel="Sx2: " step="1" />
      <NumberInput variable={ssize2} textLabel="n2: " step="1" />
      <NumberInput variable={cL} textLabel="Confidence level: " step="0.01" />
      <CheckBox variable={pool} textLabel="Pooled" />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, zzzTest(), "ok");
    } // CAll back function when "OK" clicked.
  );
}
