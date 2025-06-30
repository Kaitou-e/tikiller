import cdf from "@stdlib/stats-base-dists-normal-cdf";
/**
 * Performs a two-proportion z-test.
 * @param p1 Sample proportion from group 1 (successes1 / n1)
 * @param n1 Sample size for group 1
 * @param p2 Sample proportion from group 2 (successes2 / n2)
 * @param n2 Sample size for group 2
 * @param alternative 'two-sided' | 'less' | 'greater'
 * @returns z-score, p-value, and whether to reject the null at the given alpha
 */
function twoPropZTest(
  p1: number,
  n1: number,
  p2: number,
  n2: number,
  alternative: "two-sided" | "less" | "greater" = "two-sided"
) {
  // Pooled proportion under H0
  const pooled = (p1 * n1 + p2 * n2) / (n1 + n2);
  // Standard error
  const SE = Math.sqrt(pooled * (1 - pooled) * (1 / n1 + 1 / n2));
  // Z statistic
  const z = (p1 - p2) / SE;

  const normCDF = cdf;

  // p-value calculation
  let pValue: number;
  if (alternative === "two-sided") {
    pValue = 2 * (1 - normCDF(Math.abs(z), 0, 1));
  } else if (alternative === "greater") {
    pValue = 1 - normCDF(z, 0, 1);
  } else {
    // 'less'
    pValue = normCDF(z, 0, 1);
  }

  return {
    z,
    pValue,
    pooled,
  };
}
export default twoPropZTest;
