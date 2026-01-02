import { arrayMatch } from "../../core/src/modules/formulaHelper";

type StatsResult = {
  mean: number;
  sum: number;
  sumSquares: number;
  sampleSD: number;
  populationSD: number;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  ssize: number;
};

function oneVarStats(values: number[]): StatsResult {
  // Filter out non-finite numbers, if you want to be defensive
  const colData = values.filter((v) => Number.isFinite(v));

  if (colData.length === 0) {
    return {
      mean: NaN,
      sum: NaN,
      sumSquares: NaN,
      sampleSD: NaN,
      populationSD: NaN,
      min: NaN,
      q1: NaN,
      median: NaN,
      q3: NaN,
      max: NaN,
      ssize: NaN,
    };
  }

  // Sort a copy for quartiles
  const sorted = [...colData].sort((a, b) => a - b);

  // Minitab percentile method (same as before, now on plain array)
  function minitabPercentile(arr: number[], p: number): number {
    const N = arr.length;
    if (N === 0) return NaN;
    const pos = (p / 100) * (N + 1);
    if (pos <= 1) return arr[0];
    if (pos >= N) return arr[N - 1];
    const lowerIdx = Math.floor(pos) - 1;
    const upperIdx = lowerIdx + 1;
    const frac = pos - Math.floor(pos);
    const lowerVal = arr[lowerIdx];
    const upperVal = arr[upperIdx];
    return lowerVal + frac * (upperVal - lowerVal);
  }

  const ssize = colData.length;
  const sum = colData.reduce((acc, v) => acc + v, 0);
  const sumSquares = colData.reduce((acc, v) => acc + v * v, 0);
  const mean = sum / ssize;

  const variance = colData.reduce((acc, v) => {
    const diff = v - mean;
    return acc + diff * diff;
  }, 0);

  const sampleSD = ssize > 1 ? Math.sqrt(variance / (ssize - 1)) : 0;
  const populationSD = ssize > 0 ? Math.sqrt(variance / ssize) : 0;

  return {
    mean,
    sum,
    sumSquares,
    sampleSD,
    populationSD,
    min: sorted[0],
    q1: minitabPercentile(sorted, 25),
    median: minitabPercentile(sorted, 50),
    q3: minitabPercentile(sorted, 75),
    max: sorted[sorted.length - 1],
    ssize,
  };
}

export default oneVarStats;
