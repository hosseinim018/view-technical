/**
 * @module view-technical
 * @description this module prepare some oprating of technical analysis.
 * @version 1.0.0
 * @license MIT
 *
 * Detailed description of the module and its usage.
 *
 * @example
 * // Usage example or code snippet.
 */


/**
 * Calculates the Weighted Moving Average (WMA) of a series.
 * @param {number[]} series - The input series.
 * @param {number} window - The window size for the WMA.
 * @returns {number[]} - The WMA values.
 */
export function wma(series, window) {
  let weights = [];
  for (let i = 0; i < window; i++) {
    weights.push(i + 1);
  }
  let result = [];
  for (let i = 0, len = series.length; i < len; i++) {
    let j = i + 1 - window;
    if (j < 0) {
      result.push(null);
      continue;
    }
    let slice = series.slice(j, i + 1);
    let weighted = slice.map((value, index) => value * weights[index]);
    let sum_weights = weights.reduce((acc, value) => acc + value);
    result.push(weighted.reduce((acc, value) => acc + value) / sum_weights);
  }
  return result;
}

/**
 * Calculates the mean (average) of a series.
 * @param {number[]} series - The input series.
 * @returns {number} - The mean of the series.
 */
export function mean(series) {
  let sum = 0;
  for (let i = 0; i < series.length; i++) {
    sum += series[i];
  }
  return sum / series.length;
}

/**
 * Calculates the standard deviation (SD) of a series.
 * @param {number[]} series - The input series.
 * @returns {number} - The standard deviation of the series.
 */
export function sd(series) {
  let E = mean(series);
  let E2 = mean(pointwise((x) => x * x, series));
  return Math.sqrt(E2 - E * E);
}

/**
 * Calculates the covariance between two series.
 * @param {number[]} f - The first input series.
 * @param {number[]} g - The second input series.
 * @returns {number} - The covariance between the two series.
 */
export function cov(f, g) {
  let Ef = mean(f),
    Eg = mean(g);
  let Efg = mean(pointwise((a, b) => a * b, f, g));
  return Efg - Ef * Eg;
}

/**
 * Calculates the correlation coefficient between two series.
 * @param {number[]} f - The first input series.
 * @param {number[]} g - The second input series.
 * @returns {number} - The correlation coefficient between the two series.
 */
export function cor(f, g) {
  let Ef = mean(f),
    Eg = mean(g);
  let Ef2 = mean(pointwise((a) => a * a, f));
  let Eg2 = mean(pointwise((a) => a * a, g));
  let Efg = mean(pointwise((a, b) => a * b, f, g));
  return (Efg - Ef * Eg) / Math.sqrt((Ef2 - Ef * Ef) * (Eg2 - Eg * Eg));
}

/**
 * Calculates the Mean Absolute Deviation (MAD) of a series.
 * @param {number[]} array - The input series.
 * @returns {number} - The MAD of the series.
 */
export function mad(array) {
  return mae(array, new Array(array.length).fill(mean(array)));
}

/**
 * Applies a pointwise operation to one or more series.
 * @param {function} operation - The pointwise operation.
 * @param {...number[]} serieses - The input serieses.
 * @returns {number[]} - The result of the pointwise operation.
 */
export function pointwise(operation, ...serieses) {
  let result = [];
  for (let i = 0, len = serieses[0].length; i < len; i++) {
    let iseries = (i) => serieses.map((x) => x[i]);
    result[i] = operation(...iseries(i));
  }
  return result;
}

/**
 * Applies a rolling operation to a series.
 * @param {function} operation - The rolling operation.
 * @param {number[]} series - The input series.
 * @param {number} window - The window size for the rolling operation.
 * @returns {number[]} - The result of the rolling operation.
 */
export function rolling(operation, series, window) {
  const result = [];
  for (let i = 0, len = series.length; i < len; i++) {
    const startIndex = Math.max(i + 1 - window, 0);
    const slice = series.slice(startIndex, i + 1);
    result.push(operation(slice));
  }
  return result;
}

/**
 * Calculates the Mean Absolute Error (MAE) between two series.
 * @param {number[]} f - The first input series.
 * @param {number[]} g - The second input series.
 * @returns {number} - The MAE between the two series.
 */
export function mae(f, g) {
  const absDiff = pointwise((a, b) => Math.abs(a - b), f, g);
  return f.length !== g.length ? Infinity : mean(absDiff);
}

/**
 * Calculates the Simple Moving Average (SMA) of a series.
 * @param {number[]} series - The input series.
 * @param {number} window - The window size for the SMA.
 * @returns {number[]} - The SMA values.
 */
export function sma(series, window) {
  return rolling((s) => mean(s), series, window);
}

/**
 * Calculates the Exponential Moving Average (EMA) of a series.
 * @param {number[]} series - The input series.
 * @param {number} window - The window size for the EMA.
 * @param {number} start - The initial value for the EMA.
 * @returns {number[]} - The EMA values.
 */
export function ema(series, window, start) {
  const weight = 2 / (window + 1);
  const ema = [start ? start : mean(series.slice(0, window))];
  for (let i = 1, len = series.length; i < len; i++) {
    ema.push(series[i] * weight + (1 - weight) * ema[i - 1]);
  }
  return ema;
}

/**
 * Calculates the standard deviation (SD) of a series using a rolling window.
 * @param {number[]} series - The input series.
 * @param {number} window - The window size for the SD.
 * @returns {number[]} - The SD values.
 */
export function stdev(series, window) {
  return rolling((s) => sd(s), series, window);
}

/**
 * Calculates the Mean Absolute Deviation (MAD) of a series using a rolling window.
 * @param {number[]} series - The input series.
 * @param {number} window - The window size for the MAD.
 * @returns {number[]} - The MAD values.
 */
export function madev(series, window) {
  return rolling((s) => mad(s), series, window);
}

/**
 * Calculates the Exponential Deviation (EXPDEV) of a series using a rolling window.
 * @param {number[]} series - The input series.
 * @param {number} window - The window size for the EXPDEV.
 * @returns {number[]} - The EXPDEV values.
 */
export function expdev(series, window) {
  const sqrDiff = pointwise((a, b) => (a - b) * (a - b), series, ema(series, window));
  return pointwise((x) => Math.sqrt(x), ema(sqrDiff, window));
}

/**
 * Calculates the Average True Range (ATR) of a series using a rolling window.
 * @param {number[]} $high - The high values of the series.
 * @param {number[]} $low - The low values of the series.
 * @param {number[]} $close - The close values of the series.
 * @param {number} window - The window size for the ATR.
 * @returns {number[]} - The ATR values.
 */
export function atr($high, $low, $close, window) {
  const tr = trueRange($high, $low, $close);
  return ema(tr, 2 * window - 1);
}

/**
 * Performs Wilder smoothing on a series using a rolling window.
 * @param {number[]} series - The input series.
 * @param {number} window - The window size for the Wilder smoothing.
 * @returns {number[]} - The smoothed series.
 */
export function wilderSmooth(series, window) {
  const result = new Array(window).fill(NaN);
  result.push(
    series
      .slice(1, window + 1)
      .reduce((sum, item) => sum + item, 0)
  );
  for (let i = window + 1; i < series.length; i++) {
    result.push((1 - 1 / window) * result[i - 1] + series[i]);
  }
  return result;
}

/**
 * Calculates the Typical Price of a series.
 * @param {number[]} $high - The high values of the series.
 * @param {number[]} $low - The low values of the series.
 * @param {number[]} $close - The close values of the series.
 * @returns {number[]} - The Typical Price values.
 */
export function typicalPrice($high, $low, $close) {
  return pointwise((a, b, c) => (a + b + c) / 3, $high, $low, $close);
}

/**
 * Calculates the True Range (TR) of a series.
 * @param {number[]} $high - The high values of the series.
 * @param {number[]} $low - The low values of the series.
 * @param {number[]} $close - The close values of the series.
 * @returns {number[]} - The TR values.
 */
export function trueRange($high, $low, $close) {
  const tr = [$high[0] - $low[0]];
  for (let i = 1, len = $low.length; i < len; i++) {
    tr.push(
      Math.max(
        $high[i] - $low[i],
        Math.abs($high[i] - $close[i - 1]),
        Math.abs($low[i] - $close[i - 1])
      )
    );
  }
  return tr;
}

/**
 * Calculates the Bollinger Bands (BB) of a series.
 * @param {number[]} $close - The close values of the series.
 * @param {number} window - The window size for the BB.
 * @param {number} mult - The multiplier for the standard deviation in the BB.
 * @returns {Object} - The Bollinger Bands values.
 */
export function bb($close, window, mult) {
  const ma = sma($close, window);
  const dev = stdev($close, window);
  const upper = pointwise((a, b) => a + b * mult, ma, dev);
  const lower = pointwise((a, b) => a - b * mult, ma, dev);
  return { lower, middle: ma, upper };
}

/**
 * Calculates the Double Exponential Moving Average (DEMA) of a series.
 * @param {number[]} $close - The close values of the series.
 * @param {number} window - The window size for the DEMA.
 * @returns {number[]} - The DEMA values.
 */
export function dema($close, window) {
  const ema1 = ema($close, window);
  return pointwise((a, b) => 2 * a - b, ema1, ema(ema1, window));
}

/**
 * Calculates the Exponential Bollinger Bands (EBB) of a series.
 * @param {number[]} $close - The close values of the series.
 * @param {number} window - The window size for the EBB.
 * @param {number} mult - The multiplier for the exponential deviation in the EBB.
 * @returns {Object} - The EBB values.
 */
export function ebb($close, window, mult) {
  const ma = ema($close, window);
  const dev = expdev($close, window);
  const upper = pointwise((a, b) => a + b * mult, ma, dev);
  const lower = pointwise((a, b) => a - b * mult, ma, dev);
  return { lower, middle: ma, upper };
}

/**
 * Calculates the Keltner Channel of a series.
 * @param {number[]} $high - The high values of the series.
 * @param {number[]} $low - The low values of the series.
 * @param {number[]} $close - The close values of the series.
 * @param {number} window - The window size for the Keltner channel.
 * @param {number} mult - The multiplier for the Average True Range in the Keltner channel.
 * @returns {Object} - The Keltner Channel values.
 */
export function keltner($high, $low, $close, window, mult) {
  const middle = ema($close, window);
  const upper = pointwise((a, b) => a + mult * b, middle, atr($high, $low, $close, window));
  const lower = pointwise((a, b) => a - mult * b, middle, atr($high, $low, $close, window));
  return { lower, middle, upper };
}

/**
 * Calculates the Parabolic Stop and Reverse (PSAR) of a series.
 * @param {number[]} $high - The high values of the series.
 * @param {number[]} $low - The low values of the series.
 * @param {number} stepfactor - The step factor for the PSAR.
 * @param {number} maxfactor - The maximum step factor for the PSAR.
 * @returns {number[]} - The PSAR values.
 */
export function psar($high, $low, stepfactor, maxfactor) {
    let isUp = true;
    let factor = stepfactor;
    let extreme = Math.max($high[0], $high[1]);
    let psar = [$low[0], Math.min($low[0], $low[1])];
    let cursar = psar[1];
    for (let i = 2, len = $high.length; i < len; i++) {
        cursar = cursar + factor * (extreme - cursar);
        if ((isUp && $high[i] > extreme) || (!isUp && $low[i] < extreme)) {
            factor = ((factor <= maxfactor) ? factor + stepfactor : maxfactor);
            extreme = (isUp) ? $high[i] : $low[i];
        }
        if ((isUp && $low[i] < cursar) || (!isUp && cursar > $high[i])) {
            isUp = !isUp;
            factor = stepfactor;
            cursar = (isUp) ? Math.min(...$low.slice(i - 2, i + 1)) : Math.max(...$high.slice(i - 2, i + 1));
        }
        psar.push(cursar);
    }
    return psar;
}

/**
 * Calculates the Triple Exponential Moving Average (TEMA) of a series.
 * @param {number[]} $close - The close values of the series.
 * @param {number} window - The window size for the TEMA.
 * @returns {number[]} - The TEMA values.
 */
export function tema($close, window) {
  const ema1 = ema($close, window);
  const ema2 = ema(ema1, window);
  return pointwise((a, b, c) => 3 * a - 3 * b + c, ema1, ema2, ema(ema2, window));
}

/**
 * Calculates the Volume By Price (VBP) of a series.
 * @param {number[]} $close - The close values of the series.
 * @param {number[]} $volume - The volume values of the series.
 * @param {number} zones - The number of zones in the VBP.
 * @param {number} left - The starting index for calculating the VBP.
 * @param {number} right - The ending index for calculating the VBP.
 * @returns {Object} - The VBP values.
 */
export function vbp($close, $volume, zones, left, right) {
  let total = 0;
  let bottom = Infinity;
  let top = -Infinity;
  const vbp = new Array(zones).fill(0);
  right = !isNaN(right) ? right : $close.length;
  for (let i = left; i < right; i++) {
    total += $volume[i];
    top = top < $close[i] ? $close[i] : top;
    bottom = bottom > $close[i] ? $close[i] : bottom;
  }
  for (let i = left; i < right; i++) {
    vbp[Math.floor(($close[i] - bottom) / (top - bottom) * (zones - 1))] += $volume[i];
  }
  return {
    bottom,
    top,
    volumes: vbp.map((x) => {
      return x / total;
    }),
  };
}

/**
 * Calculates the Volume Weighted Average Price (VWAP) of a series.
 * @param {number[]} $high - The high values of the series.
 * @param {number[]} $low - The low values of the series.
 * @param {number[]} $close - The close values of the series.
 * @param {number[]} $volume - The volume values of the series.
 * @returns {number[]} - The VWAP values.
 */
export function vwap($high, $low, $close, $volume) {
  const tp = typicalPrice($high, $low, $close);
  const cumulVTP = [$volume[0] * tp[0]];
  const cumulV = [$volume[0]];
  for (let i = 1, len = $close.length; i < len; i++) {
    cumulVTP[i] = cumulVTP[i - 1] + $volume[i] * tp[i];
    cumulV[i] = cumulV[i - 1] + $volume[i];
  }
  return pointwise((a, b) => a / b, cumulVTP, cumulV);
}

/**
 * Calculates the Zigzag indicator of a series.
 * @param {number[]} $time - The time values of the series.
 * @param {number[]} $high - The high values of the series.
 * @param {number[]} $low - The low values of the series.
 * @param {number} percent - The percentage threshold for the Zigzag indicator.
 * @returns {Object} - The Zigzag indicator values.
 */
export function zigzag($time, $high, $low, percent) {
  let lowest = $low[0];
  let thattime = $time[0];
  let isUp = false;
  let highest = $high[0];
  const time = [];
  const zigzag = [];
  for (let i = 1, len = $time.length; i < len; i++) {
    if (isUp) {
      if ($high[i] > highest) {
        thattime = $time[i];
        highest = $high[i];
      } else if ($low[i] < lowest + (highest - lowest) * (100 - percent) / 100) {
        isUp = false;
        time.push(thattime);
        zigzag.push(highest);
        lowest = $low[i];
      }
    } else {
      if ($low[i] < lowest) {
        thattime = $time[i];
        lowest = $low[i];
      } else if ($high[i] > lowest + (highest - lowest) * percent / 100) {
        isUp = true;
        time.push(thattime);
        zigzag.push(lowest);
        highest = $high[i];
      }
    }
  }
  return { time, price: zigzag };
}

/**
 * Calculates the Accumulation/Distribution Line (ADL) of a series.
 * @param {number[]} $high - The high values of the series.
 * @param {number[]} $low - The low values of the series.
 * @param {number[]} $close - The close values of the series.
 * @param {number[]} $volume - The volume values of the series.
 * @returns {number[]} - The ADL values.
 */
export function adl($high, $low, $close, $volume) {
  const adl = [$volume[0] * (2 * $close[0] - $low[0] - $high[0]) / ($high[0] - $low[0])];
  for (let i = 1, len = $high.length; i < len; i++) {
    adl[i] = adl[i - 1] + $volume[i] * (2 * $close[i] - $low[i] - $high[i]) / ($high[i] - $low[i]);
  }
  return adl;
}

/**
 * Calculates the Average Directional Index (ADX) of a series.
 * @param {number[]} $high - The high values of the series.
 * @param {number[]} $low - The low values of the series.
 * @param {number[]} $close - The close values of the series.
 * @param {number} window - The window size for smoothing.
 * @returns {Object} - The ADX, DIP, and DIM values.
 */
export function adx($high, $low, $close, window) {
  let dmp = [0];
  let dmm = [0];
  for (let i = 1, len = $low.length; i < len; i++) {
    let hd = $high[i] - $high[i - 1];
    let ld = $low[i - 1] - $low[i];
    dmp.push(hd > ld ? Math.max(hd, 0) : 0);
    dmm.push(ld > hd ? Math.max(ld, 0) : 0);
  }
  let str = wilderSmooth(trueRange($high, $low, $close), window);
  dmp = wilderSmooth(dmp, window);
  dmm = wilderSmooth(dmm, window);
  let dip = pointwise((a, b) => (100 * a) / b, dmp, str);
  let dim = pointwise((a, b) => (100 * a) / b, dmm, str);
  let dx = pointwise(
    (a, b) => (100 * Math.abs(a - b)) / (a + b),
    dip,
    dim
  );
  return {
    dip,
    dim,
    adx: new Array(14).fill(NaN).concat(ema(dx.slice(14), 2 * window - 1)),
  };
}

/**
 * Calculates the Bollinger Bands Percentage (BBP) of a series.
 * @param {number[]} $close - The close values of the series.
 * @param {number} window - The window size for calculating the Bollinger Bands.
 * @param {number} mult - The standard deviation multiplier.
 * @returns {number[]} - The BBP values.
 */
export function bbp($close, window, mult) {
  let band = bb($close, window, mult);
  return pointwise((p, u, l) => (p - l) / (u - l), $close, band.upper, band.lower);
}

/**
 * Calculates the Commodity Channel Index (CCI) of a series.
 * @param {number[]} $high - The high values of the series.
 * @param {number[]} $low - The low values of the series.
 * @param {number[]} $close - The close values of the series.
 * @param {number} window - The window size for calculating CCI.
 * @param {number} mult - The multiplier value.
 * @returns {number[]} - The CCI values.
 */
export function cci($high, $low, $close, window, mult) {
  let tp = typicalPrice($high, $low, $close);
  let tpsma = sma(tp, window);
  let tpmad = madev(tp, window);
  tpmad[0] = Infinity;
  return pointwise((a, b, c) => (a - b) / (c * mult), tp, tpsma, tpmad);
}

/**
 * Calculates the Chande's Oscillator (CHO) of a series.
 * @param {number[]} $high - The high values of the series.
 * @param {number[]} $low - The low values of the series.
 * @param {number[]} $close - The close values of the series.
 * @param {number[]} $volume - The volume values of the series.
 * @param {number} winshort - The short window size for calculating EMA.
 * @param {number} winlong - The long window size for calculating EMA.
 * @returns {number[]} - The CHO values.
 */
export function cho($high, $low, $close, $volume, winshort, winlong) {
  let adli = adl($high, $low, $close, $volume);
  return pointwise((s, l) => s - l, ema(adli, winshort), ema(adli, winlong));
}
/**
 * Calculates the Force Index (FI) of a series.
 * @param {number[]} $close - The close values of the series.
 * @param {number[]} $volume - The volume values of the series.
 * @param {number} window - The window size for calculating EMA.
 * @returns {number[]} - The FI values.
 */
export function fi($close, $volume, window) {
    let delta = rolling((s) => s[s.length - 1] - s[0], $close, 2);
    return ema(pointwise((a, b) => a * b, delta, $volume), window);
}

/**
 * Calculates the Know Sure Thing (KST) of a series.
 * @param {number[]} $close - The close values of the series.
 * @param {number} w1 - The first ROC window size.
 * @param {number} w2 - The second ROC window size.
 * @param {number} w3 - The third ROC window size.
 * @param {number} w4 - The fourth ROC window size.
 * @param {number} s1 - The first RCMA window size.
 * @param {number} s2 - The second RCMA window size.
 * @param {number} s3 - The third RCMA window size.
 * @param {number} s4 - The fourth RCMA window size.
 * @param {number} sig - The signal window size.
 * @returns {Object} - The KST line and signal values.
 */
export function kst($close, w1, w2, w3, w4, s1, s2, s3, s4, sig) {
    let rcma1 = sma(roc($close, w1), s1);
    let rcma2 = sma(roc($close, w2), s2);
    let rcma3 = sma(roc($close, w3), s3);
    let rcma4 = sma(roc($close, w4), s4);
    let line = pointwise((a, b, c, d) => a + b * 2 + c * 3 + d * 4, rcma1, rcma2, rcma3, rcma4);
    return { line: line, signal: sma(line, sig) };
}

/**
 * Calculates the Moving Average Convergence Divergence (MACD) of a series.
 * @param {number[]} $close - The close values of the series.
 * @param {number} winshort - The short EMA window size.
 * @param {number} winlong - The long EMA window size.
 * @param {number} winsig - The signal EMA window size.
 * @returns {Object} - The MACD line, signal line, and histogram values.
 */
export function macd($close, winshort, winlong, winsig) {
    const line = pointwise((a, b) => a - b, ema($close, winshort), ema($close, winlong));
    const signal = ema(line, winsig);
    const hist = pointwise((a, b) => a - b, line, signal);
    return { line: line, signal: signal, hist: hist };
}
/**
 * Calculates the Money Flow Index (MFI) of a series.
 * @param {number[]} $high - The high values of the series.
 * @param {number[]} $low - The low values of the series.
 * @param {number[]} $close - The close values of the series.
 * @param {number[]} $volume - The volume values of the series.
 * @param {number} window - The window size for calculating MFI.
 * @returns {number[]} - The MFI values.
 */
export function mfi($high, $low, $close, $volume, window) {
    let pmf = [0], nmf = [0];
    let tp = typicalPrice($high, $low, $close);
    for (let i = 1, len = $close.length; i < len; i++) {
        let diff = tp[i] - tp[i - 1];
        pmf.push(diff >= 0 ? tp[i] * $volume[i] : 0);
        nmf.push(diff < 0 ? tp[i] * $volume[i] : 0);
    }
    pmf = rolling((s) => s.reduce((sum, x) => sum + x, 0), pmf, window);
    nmf = rolling((s) => s.reduce((sum, x) => sum + x, 0), nmf, window);
    return pointwise((a, b) => 100 - 100 / (1 + a / b), pmf, nmf);
}

/**
 * Calculates the On-Balance Volume (OBV) of a series.
 * @param {number[]} $close - The close values of the series.
 * @param {number[]} $volume - The volume values of the series.
 * @param {number} signal - The signal window size for calculating the moving average of OBV.
 * @returns {Object} - The OBV line and signal values.
 */
export function obv($close, $volume, signal) {
    let obv = [0];
    for (let i = 1, len = $close.length; i < len; i++) {
        obv.push(obv[i - 1] + Math.sign($close[i] - $close[i - 1]) * $volume[i]);
    }
    return { line: obv, signal: sma(obv, signal) };
}

/**
 * Calculates the Rate of Change (ROC) of a series.
 * @param {number[]} $close - The close values of the series.
 * @param {number} window - The window size for calculating ROC.
 * @returns {number[]} - The ROC values.
 */
export function roc($close, window) {
    let result = new Array(window).fill(NaN);
    for (let i = window, len = $close.length; i < len; i++) {
        result.push(100 * ($close[i] - $close[i - window]) / $close[i - window]);
    }
    return result;
}
/**
 * Calculates the Relative Strength Index (RSI) of a series.
 * @param {number[]} $close - The close values of the series.
 * @param {number} window - The window size for calculating RSI.
 * @returns {number[]} - The RSI values.
 */
export function rsi($close, window) {
    let gains = [0], loss = [1e-14];
    for (let i = 1, len = $close.length; i < len; i++) {
        let diff = $close[i] - $close[i - 1];
        gains.push(diff >= 0 ? diff : 0);
        loss.push(diff < 0 ? -diff : 0);
    }
    return pointwise((a, b) => 100 - 100 / (1 + a / b), ema(gains, 2 * window - 1), ema(loss, 2 * window - 1));
}

/**
 * Calculates the Stochastic Oscillator of a series.
 * @param {number[]} $high - The high values of the series.
 * @param {number[]} $low - The low values of the series.
 * @param {number[]} $close - The close values of the series.
 * @param {number} window - The window size for calculating the highest and lowest values.
 * @param {number} signal - The signal window size for calculating the moving average of the Stochastic Oscillator.
 * @param {number} smooth - The smoothing factor for the Stochastic Oscillator.
 * @returns {Object} - The Stochastic Oscillator line and signal values.
 */
export function stoch($high, $low, $close, window, signal, smooth) {
    let lowest = rolling((s) => Math.min(...s), $low, window);
    let highest = rolling((s) => Math.max(...s), $high, window);
    let K = pointwise((h, l, c) => 100 * (c - l) / (h - l), highest, lowest, $close);
    if (smooth > 1) {
        K = sma(K, smooth);
    }
    return { line: K, signal: sma(K, signal) };
}

/**
 * Calculates the Stochastic RSI (StochRSI) of a series.
 * @param {number[]} $close - The close values of the series.
 * @param {number} window - The window size for calculating RSI.
 * @param {number} signal - The signal window size for calculating the moving average of StochRSI.
 * @param {number} smooth - The smoothing factor for StochRSI.
 * @returns {Object} - The StochRSI line and signal values.
 */
export function stochRsi($close, window, signal, smooth) {
    let _rsi = rsi($close, window);
    let extreme = rolling((s) => {
        return { low: Math.min(...s), high: Math.max(...s) };
    }, _rsi, window);
    let K = pointwise((rsi, e) => (rsi - e.low) / (e.high - e.low), _rsi, extreme);
    K[0] = 0;
    if (smooth > 1) {
        K = sma(K, smooth);
    }
    return { line: K, signal: sma(K, signal) };
}
/**
 * Calculates the Vertical Horizontal Filter (VI) of a series.
 * @param {number[]} $high - The high values of the series.
 * @param {number[]} $low - The low values of the series.
 * @param {number[]} $close - The close values of the series.
 * @param {number} window - The window size for calculating VI.
 * @returns {Object} - The VI plus and minus values.
 */
export function vi($high, $low, $close, window) {
    let pv = [($high[0] - $low[0]) / 2], nv = [pv[0]];
    for (let i = 1, len = $high.length; i < len; i++) {
        pv.push(Math.abs($high[i] - $low[i - 1]));
        nv.push(Math.abs($high[i - 1] - $low[i]));
    }
    let apv = rolling((s) => s.reduce((sum, x) => {
        return sum + x;
    }, 0), pv, window);
    let anv = rolling((s) => s.reduce((sum, x) => {
        return sum + x;
    }, 0), nv, window);
    let atr = rolling((s) => s.reduce((sum, x) => {
        return sum + x;
    }, 0), trueRange($high, $low, $close), window);
    return { plus: pointwise((a, b) => a / b, apv, atr), minus: pointwise((a, b) => a / b, anv, atr) };
}

/**
 * Calculates the Williams %R indicator of a series.
 * @param {number[]} $high - The high values of the series.
 * @param {number[]} $low - The low values of the series.
 * @param {number[]} $close - The close values of the series.
 * @param {number} window - The window size for calculating Williams %R.
 * @returns {number[]} - The Williams %R values.
 */
export function williams($high, $low, $close, window) {
    return pointwise((x) => x - 100, stoch($high, $low, $close, window, 1, 1).line);
}

/**
 * Calculates the Fibonacci Retracement levels based on two pivot points.
 * @param {number} pivot1 - The first pivot point.
 * @param {number} pivot2 - The second pivot point.
 * @returns {Object} - The Fibonacci retracement levels.
 */
export function FibonacciRetracement(pivot1, pivot2) {
    const retracements = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
    const high = Math.max(pivot1, pivot2);
    const low = Math.min(pivot1, pivot2);
    const range = high - low;
    const levels = retracements.map(level => high - range * level);
    const obj = {};
    retracements.forEach((el, index) => {
        obj[el] = levels[index];
    });
    return obj;
}

/**
 * Calculates the regression line value for a given x-coordinate using two points.
 * @param {number} x - The x-coordinate.
 * @param {number[]} point1 - The first point (x, y).
 * @param {number[]} point2 - The second point (x, y).
 * @returns {number} - The y-coordinate on the regression line.
 */
export function regression(x, point1, point2) {
    // find slope and y-intercept
    const slope = (point2[1] - point1[1]) / (point2[0] - point1[0]);
    const yIntercept = point1[1] - slope * point1[0];
    // the final equation will be: y = slope*x + yIntercept
    return slope * x + yIntercept;
}