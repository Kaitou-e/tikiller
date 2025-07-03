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

function oneVarStats(
  data: any[][],
  colSelect: number,
  freqColSelect: number = -1
): StatsResult {
  function isMissing(val: any): boolean {
    return (
      val === null ||
      val === undefined ||
      (typeof val === "string" && val.trim() === "")
    );
  }

  // Extract and filter
  const colData: number[] = [];
  const frequencies: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const value = data[i][colSelect];
    const freq = freqColSelect >= 0 ? data[i][freqColSelect] : 1;

    if (
      isMissing(value) ||
      isNaN(Number(value)) ||
      isMissing(freq) ||
      isNaN(Number(freq)) ||
      Number(freq) <= 0
    ) {
      continue;
    }
    colData.push(Number(value));
    frequencies.push(Number(freq));
  }

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

  // Expand data for quartile calculation
  const expanded: number[] = [];
  colData.forEach((val, i) => {
    for (let j = 0; j < frequencies[i]; j++) {
      expanded.push(val);
    }
  });
  expanded.sort((a, b) => a - b);

  // Minitab percentile method
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

  const totalFreq = frequencies.reduce((a, b) => a + b, 0);
  const sum = colData.reduce((acc, val, i) => acc + val * frequencies[i], 0);
  const sumSquares = colData.reduce(
    (acc, val, i) => acc + val * val * frequencies[i],
    0
  );
  const mean = sum / totalFreq;
  const variance = colData.reduce(
    (acc, val, i) => acc + frequencies[i] * Math.pow(val - mean, 2),
    0
  );
  const sampleSD = totalFreq > 1 ? Math.sqrt(variance / (totalFreq - 1)) : 0;
  const populationSD = totalFreq > 0 ? Math.sqrt(variance / totalFreq) : 0;

  return {
    mean,
    sum,
    sumSquares,
    sampleSD,
    populationSD,
    min: expanded[0],
    q1: minitabPercentile(expanded, 25),
    median: minitabPercentile(expanded, 50),
    q3: minitabPercentile(expanded, 75),
    max: expanded[expanded.length - 1],
    ssize: colData.length,
  };
}
export default oneVarStats;
