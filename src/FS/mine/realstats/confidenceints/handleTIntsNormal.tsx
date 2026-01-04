import CheckBox from "../../inputs/CheckBox.tsx";
import NumberInput from "../../inputs/NumberInput.tsx";
import TextInput from "../../inputs/TextInput.tsx";
import DrawDownSelection from "../../inputs/DrawDown.tsx";
import MyGuiVar from "../../myGuiVar.tsx";
// import quantile from "@stdlib/stats-base-dists-normal-quantile";
import Table from "../../tableGen2.tsx";
import quantile from "@stdlib/stats-base-dists-t-quantile";
import {
  excelColumnToIndex,
  getColNames,
  getFromDataFreq,
  getValueGrid,
} from "../../utilities.tsx";
import oneVarStats from "../oneVarStats.tsx";

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
  data: any[][],
  showDialog: (
    isResult: boolean,
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) => void
) {
  let cL = new MyGuiVar(0.05); // CL
  let ssize = new MyGuiVar(0);
  let stdd = new MyGuiVar(1);
  let m = new MyGuiVar(1);
  let exclRow1 = new MyGuiVar(false);
  let selectCol = new MyGuiVar("");
  let freqSelectCol = new MyGuiVar("");

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
    if (selectCol.value != "" && Number(ssize.value) === 0) {
      const colSelect = excelColumnToIndex(selectCol.value as string);
      const freqColSelect = excelColumnToIndex(freqSelectCol.value as string);
      const flat = getFromDataFreq(
        data,
        colSelect,
        freqColSelect,
        exclRow1.value as boolean
      );
      const dataStats = oneVarStats(flat);
      m.setValue(dataStats.mean);
      stdd.setValue(dataStats.sampleSD);
      ssize.setValue(dataStats.ssize);
    }
    const distres = oneSampleTInterval(
      1 - Number(cL.value),
      Number(ssize.value),
      Number(stdd.value),
      Number(m.value)
    );
    const tableRes = [
      ["CLower", distres.lower.toFixed(6)],
      ["CUpper", distres.upper.toFixed(6)],
      ["Mean", distres.mean.toFixed(6)],
      ["Margin of Error", distres.marginOfError.toFixed(6)],
      ["Degrees of Freedom", distres.df],
      ["Standard Deviation", Number(stdd.value).toFixed(6)],
      ["n", ssize.value.toString()],
    ];
    const align: ("left" | "center" | "right")[] = ["left", "center"];
    const pct = (1 - Number(cL.value)) * 100;

    const MenuText2 = () => (
      <>
        We are {pct.toFixed(1)}% confident the true population
        <br />
        mean is between CLower and CUpper.
        <br /> <br />
      </>
    );
    return (
      <div>
        <h2>Student's t Interval</h2>
        <MenuText2 />
        <Table data={tableRes} align={align} />
        {/* <p>alternate hyp: {altHyp.value.toString()}</p>
        <p>sample prop = {sampleProp}</p>
        <p>z score = {testres.z}</p>
        <p>p value = {testres.pValue}</p> */}
      </div>
    );
  }

  const MenuText = () => (
    <>
      A Student t-interval is a confidence interval for a
      <br />
      population mean when the population standard deviation
      <br />
      is unknown and the sample distribution is reasonably normal.
      <br />
      Either input the sample set by raw data, or statistical
      <br />
      Summaries.
      <br /> <br />
    </>
  );

  showDialog(
    false,
    <div>
      <h2>Student's t Interval</h2>
      <MenuText />
      <NumberInput variable={cL} textLabel="Alpha: " step="0.01" />
      <h4>Enter using data:</h4>
      <DrawDownSelection
        variable={selectCol}
        options={getColNames(data)}
        textLabel="Data column: "
        width={100}
      />
      <DrawDownSelection
        variable={freqSelectCol}
        options={getColNames(data)}
        textLabel="Frequency column (optional): "
        width={100}
      />
      <CheckBox variable={exclRow1} textLabel="Exclude the first Row" />

      <h4>Enter using stats (override):</h4>
      <NumberInput variable={m} textLabel="Mean: " step="1" />
      <NumberInput variable={stdd} textLabel="SD: " step="1" />
      <NumberInput variable={ssize} textLabel="n: " step="1" />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, zzzTest(), "ok");
    } // CAll back function when "OK" clicked.
  );
}

export function handle2SampleTInt(
  data: any[][],
  showDialog: (
    isResult: boolean,
    content: string | React.ReactNode,
    type?: "ok" | "yesno",
    onOk?: () => void,
    onCancel?: () => void
  ) => void
) {
  let cL = new MyGuiVar(0.05); // CL
  let pool = new MyGuiVar(false);
  let ssize1 = new MyGuiVar(0);
  let stdd1 = new MyGuiVar(1);
  let m1 = new MyGuiVar(1);
  let ssize2 = new MyGuiVar(0);
  let stdd2 = new MyGuiVar(1);
  let m2 = new MyGuiVar(1);

  let exclRow1 = new MyGuiVar(false);
  let selectCol1 = new MyGuiVar("");
  let freqSelectCol1 = new MyGuiVar("");
  let selectCol2 = new MyGuiVar("");
  let freqSelectCol2 = new MyGuiVar("");

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
    if (selectCol1.value != "" && Number(ssize1.value) === 0) {
      const colSelect = excelColumnToIndex(selectCol1.value as string);
      const freqColSelect = excelColumnToIndex(freqSelectCol1.value as string);
      const flat = getFromDataFreq(
        data,
        colSelect,
        freqColSelect,
        exclRow1.value as boolean
      );
      const dataStats1 = oneVarStats(flat);
      m1.setValue(dataStats1.mean);
      stdd1.setValue(dataStats1.sampleSD);
      ssize1.setValue(dataStats1.ssize);
    }
    if (selectCol2.value != "" && Number(ssize2.value) === 0) {
      const colSelect = excelColumnToIndex(selectCol2.value as string);
      const freqColSelect = excelColumnToIndex(freqSelectCol2.value as string);
      const flat = getFromDataFreq(
        data,
        colSelect,
        freqColSelect,
        exclRow1.value as boolean
      );
      const dataStats = oneVarStats(flat);
      m2.setValue(dataStats.mean);
      stdd2.setValue(dataStats.sampleSD);
      ssize2.setValue(dataStats.ssize);
    }

    let distres = twoSampleTInterval(
      1 - Number(cL.value),
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
      ["Mean Difference", distres.meanDiff.toFixed(6)],
      ["Margin of Error", distres.marginOfError.toFixed(6)],
      ["Degrees of Freedom", distres.df.toFixed(6)],
      ["Mean, Sample 1", Number(m1.value).toFixed(6)],
      ["Mean, Sample 2", Number(m2.value).toFixed(6)],
      ["SD, Sample 1", Number(stdd1.value).toFixed(6)],
      ["SD, Sample 2", Number(stdd2.value).toFixed(6)],
      ["N, Sample 1", ssize1.value.toString()],
      ["N, Sample 2", ssize2.value.toString()],
    ];
    const align: ("left" | "center" | "right")[] = ["left", "center"];
    const pct = (1 - Number(cL.value)) * 100;

    const MenuText2 = () => (
      <>
        We are {pct.toFixed(1)}% confident the true population
        <br />
        mean difference (u1-u2) is between CLower and CUpper.
        <br /> <br />
      </>
    );
    return (
      <div>
        <h2>2-Sample t Interval</h2>
        <MenuText2 />
        <Table data={tableRes} align={align} />
        {/* <p>alternate hyp: {altHyp.value.toString()}</p>
        <p>sample prop = {sampleProp}</p>
        <p>z score = {testres.z}</p>
        <p>p value = {testres.pValue}</p> */}
      </div>
    );
  }

  const MenuText = () => (
    <>
      Two-sample t-interval estimates the difference between two
      <br />
      population means from two independent samples when population
      <br />
      standard deviations are unknown.
      <br />
      Each sample approximately normal OR N1, N2 ≥30.
      <br />
      Either input the sample set by raw data, or statistical
      <br />
      Summaries.
      <br /> <br />
    </>
  );

  showDialog(
    false,
    <div>
      <h2>2-Sample t Interval</h2>
      <MenuText />
      <NumberInput variable={cL} textLabel="Alpha: " step="0.01" />
      <CheckBox variable={pool} textLabel="Pooled" />
      <h4>Enter using data:</h4>
      <DrawDownSelection
        variable={selectCol1}
        options={getColNames(data)}
        textLabel="Data column 1: "
        width={100}
      />
      <DrawDownSelection
        variable={selectCol2}
        options={getColNames(data)}
        textLabel="Data column 2: "
        width={100}
      />

      <DrawDownSelection
        variable={freqSelectCol1}
        options={getColNames(data)}
        textLabel="Frequency column 1 (optional): "
        width={100}
      />
      <DrawDownSelection
        variable={freqSelectCol2}
        options={getColNames(data)}
        textLabel="Frequency column 2 (optional): "
        width={100}
      />
      <CheckBox variable={exclRow1} textLabel="Exclude the first Row" />

      <h4>Enter using stats (override):</h4>
      <NumberInput variable={m1} textLabel="Mean, sample 1: " step="1" />
      <NumberInput variable={stdd1} textLabel="SD, sample 1: " step="1" />
      <NumberInput variable={ssize1} textLabel="N, sample 1: " step="1" />
      <NumberInput variable={m2} textLabel="Mean, Sample 2: " step="1" />
      <NumberInput variable={stdd2} textLabel="SD, Sample 2: " step="1" />
      <NumberInput variable={ssize2} textLabel="N, Sample 2: " step="1" />
    </div>, // above is the dialog content
    "yesno", // the type of dialog yesno or ok
    () => {
      showDialog(true, zzzTest(), "ok");
    } // CAll back function when "OK" clicked.
  );
}
