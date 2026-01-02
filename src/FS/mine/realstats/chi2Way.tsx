import cdf from "@stdlib/stats-base-dists-chisquare-cdf";

export type ChiSquareTwoWayResult = {
  chi2: number;
  pValue: number;
  df: number;
  expected: number[][];
  comp: number[][];
};

/**
 * Chi-square test of independence for a two-way contingency table.
 * @param observed 2D array of observed counts [rows][cols]
 */
export function chiSquareTwoWay(observed: number[][]): ChiSquareTwoWayResult {
  const nRows = observed.length;
  const nCols = nRows > 0 ? observed[0].length : 0;

  if (nRows === 0 || nCols === 0) {
    return {
      chi2: NaN,
      pValue: NaN,
      df: NaN,
      expected: [],
      comp: [],
    };
  }

  // Check rectangular matrix
  for (let r = 0; r < nRows; r++) {
    if (observed[r].length !== nCols) {
      throw new Error("Observed matrix must be rectangular.");
    }
  }

  // Row sums, column sums, grand total[web:30]
  const rowSums = new Array<number>(nRows).fill(0);
  const colSums = new Array<number>(nCols).fill(0);
  let grandTotal = 0;

  for (let r = 0; r < nRows; r++) {
    for (let c = 0; c < nCols; c++) {
      const val = observed[r][c];
      rowSums[r] += val;
      colSums[c] += val;
      grandTotal += val;
    }
  }

  // Expected counts: (row sum * col sum) / grand total[web:30][web:35]
  const expected: number[][] = [];
  const comp: number[][] = [];
  let chi2 = 0;

  for (let r = 0; r < nRows; r++) {
    expected[r] = [];
    comp[r] = [];
    for (let c = 0; c < nCols; c++) {
      const E = (rowSums[r] * colSums[c]) / grandTotal;
      expected[r][c] = E;

      // Guard against zero expected counts
      if (E <= 0) {
        comp[r][c] = NaN;
        chi2 = NaN;
        continue;
      }

      const O = observed[r][c];
      const contrib = (O - E) ** 2 / E; // (O-E)^2 / E[web:30][web:35]
      comp[r][c] = contrib;
      chi2 += contrib;
    }
  }

  const df = (nRows - 1) * (nCols - 1); // degrees of freedom[web:30][web:35]

  let pValue: number;
  if (Number.isNaN(chi2) || df <= 0) {
    pValue = NaN;
  } else {
    // p = P(Chi^2 >= chi2) = 1 - CDF(chi2; df)[web:22][web:20]
    pValue = 1 - cdf(chi2, df);
  }

  return {
    chi2,
    pValue,
    df,
    expected,
    comp,
  };
}
