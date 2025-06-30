/**
 * Performs a one-proportion z-test
 * @param p0 Hypothesized population proportion (under null hypothesis)
 * @param p_hat Observed sample proportion
 * @param n Sample size
 * @param alpha Significance level (e.g., 0.05)
 * @param alternative Hypothesis type: 'two-sided', 'less', or 'greater'
 * @returns Object containing z-score, p-value, and rejection decision
 */
function onePropZTest(
  p0: number,
  p_hat: number,
  n: number,
  alpha: number,
  alternative: "two-sided" | "less" | "greater"
): { z: number; pValue: number; rejectNull: boolean } {
  // Calculate standard error
  const SE = Math.sqrt((p0 * (1 - p0)) / n);

  // Calculate z-score
  const z = (p_hat - p0) / SE;

  // Calculate p-value based on alternative hypothesis
  let pValue: number;
  switch (alternative) {
    case "two-sided":
      pValue = 2 * (1 - normalCDF(Math.abs(z)));
      break;
    case "less":
      pValue = normalCDF(z);
      break;
    case "greater":
      pValue = 1 - normalCDF(z);
      break;
    default:
      throw new Error(
        'Invalid alternative hypothesis. Use "two-sided", "less", or "greater".'
      );
  }

  // Determine whether to reject null hypothesis
  const rejectNull = pValue < alpha;

  return { z, pValue, rejectNull };
}

export default onePropZTest;

/**
 * Computes cumulative distribution function (CDF) for standard normal distribution
 * @param z Z-score
 * @returns Cumulative probability from -∞ to z
 */
function normalCDF(z: number): number {
  // Save the sign of z
  const sign = z < 0 ? -1 : 1;
  const absZ = Math.abs(z);

  // Abramowitz & Stegun approximation (1964)
  const t = 1.0 / (1.0 + 0.2316419 * absZ);
  const d = 0.3989423 * Math.exp((-absZ * absZ) / 2);

  const probability =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));

  return z < 0 ? probability : 1 - probability;
}
