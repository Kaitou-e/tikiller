import cdf from "@stdlib/stats-base-dists-chisquare-cdf";

type ChiSquareGOFResult = {
  chi2: number;
  pValue: number;
  compList: number[]; // (O - E)^2 / E for each cell
};

/**
 * Chi-square goodness-of-fit test.
 * @param observed Array of observed counts
 * @param expected Array of expected counts (same length as observed)
 * @param df Degrees of freedom (usually k - 1 or k - 1 - parameters)
 */
export function chiSquareGOF(
  observed: number[],
  expected: number[],
  df: number
): ChiSquareGOFResult {
  if (observed.length !== expected.length || observed.length === 0 || df <= 0) {
    return { chi2: NaN, pValue: NaN, compList: [] };
  }

  const compList: number[] = [];
  let chi2 = 0;

  for (let i = 0; i < observed.length; i++) {
    const O = observed[i];
    const E = expected[i];

    // Basic safety: skip or flag invalid expected counts
    if (E <= 0) {
      compList.push(NaN);
      chi2 = NaN;
      continue;
    }

    const term = (O - E) ** 2 / E; // (O - E)^2 / E[web:21][web:24]
    compList.push(term);
    chi2 += term;
  }

  // If any invalid E made chi2 NaN, return early
  if (Number.isNaN(chi2)) {
    return { chi2, pValue: NaN, compList };
  }

  // p-value = P(Chi^2 >= chi2) = 1 - CDF(chi2; df)[web:22][web:20]
  const pValue = 1 - cdf(chi2, df);

  return {
    chi2,
    pValue,
    compList,
  };
}
