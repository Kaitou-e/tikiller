import cdf from '@stdlib/stats-base-dists-chisquare-cdf';

interface ChiSquareResult {
  pPearson: number;
  chiSqPearson: number;
  df: number;
  pLR: number;
  chiSqLR: number;
  expected: number[][];
}

function chiSquare(
  data: number[][],
  printOut: boolean = true,
  printPort: ((...args: any[]) => void) = console.log,
  printTable: boolean = false,
  rKeys: string[] | null = null,
  cKeys: string[] | null = null
): ChiSquareResult {
  const a = data; // observed values
  const colSum = a[0].map((_, x) => a.reduce((sum, row) => sum + row[x], 0));
  const rowSum = a.map(row => row.reduce((sum, val) => sum + val, 0));
  const ttlSum = rowSum.reduce((sum, val) => sum + val, 0);

  let chiSqPearson = 0;
  let chiSqLR = 0;
  const e: number[][] = Array(a.length).fill(0).map(() => Array(a[0].length).fill(0));
  
  // Calculate expected values once
  for (let y = 0; y < a.length; y++) {
    for (let x = 0; x < a[0].length; x++) {
      const expected = rowSum[y] * colSum[x] / ttlSum;
      e[y][x] = expected;
      
      // Pearson chi-square
      chiSqPearson += Math.pow(a[y][x] - expected, 2) / expected;
      
      // Likelihood Ratio (only if observed > 0)
      if (a[y][x] > 0) {
        chiSqLR += 2 * a[y][x] * Math.log(a[y][x] / expected);
      }
    }
  }
  
  const df = (a.length - 1) * (a[0].length - 1);
  const pPearson = 1 - cdf(chiSqPearson, df);
  const pLR = 1 - cdf(chiSqLR, df);
  
  if (printOut) {
    printPort({
      pPearson,
      chiSqPearson,
      df,
      pLR,
      chiSqLR
    });
  }
  
  return { pPearson, chiSqPearson, df, pLR, chiSqLR, expected:e};
}

 export default chiSquare;