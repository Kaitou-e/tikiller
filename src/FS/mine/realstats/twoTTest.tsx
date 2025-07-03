import { cdf } from "@stdlib/stats-base-dists-t";

function twoSampleTTest(
  mean1: number,
  sd1: number,
  n1: number,
  mean2: number,
  sd2: number,
  n2: number,
  alternative: "two-sided" | "less" | "greater" = "two-sided"
) {
  const se1 = (sd1 * sd1) / n1;
  const se2 = (sd2 * sd2) / n2;
  const t = (mean1 - mean2) / Math.sqrt(se1 + se2);
  const df =
    Math.pow(se1 + se2, 2) /
    (Math.pow(se1, 2) / (n1 - 1) + Math.pow(se2, 2) / (n2 - 1));

  let pValue: number;
  if (alternative === "two-sided") {
    pValue = 2 * (1 - cdf(Math.abs(t), df));
  } else if (alternative === "greater") {
    pValue = 1 - cdf(t, df);
  } else {
    // 'less'
    pValue = cdf(t, df);
  }

  return {
    t,
    df,
    pValue,
  };
}
export default twoSampleTTest;
