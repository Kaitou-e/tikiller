import { cdf } from "@stdlib/stats-base-dists-t";

interface TTestResult {
  t: number;
  df: number;
  pValue: number;
}

function oneSampleTTest(
  sampleMean: number,
  mu0: number, // Null hypothesis mean
  sampleSD: number,
  sampleSize: number,
  alternative: "two-sided" | "less" | "greater" = "two-sided"
): TTestResult {
  // Calculate standard error and t-statistic
  const SE = sampleSD / Math.sqrt(sampleSize);
  const t = (sampleMean - mu0) / SE;
  const df = sampleSize - 1; // Degrees of freedom

  // Calculate p-value using t-distribution CDF
  let pValue: number;
  if (alternative === "two-sided") {
    pValue = 2 * (1 - cdf(Math.abs(t), df));
  } else if (alternative === "less") {
    pValue = cdf(t, df);
  } else {
    // 'greater'
    pValue = 1 - cdf(t, df);
  }

  return {
    t,
    df,
    pValue,
  };
}
export default oneSampleTTest;
