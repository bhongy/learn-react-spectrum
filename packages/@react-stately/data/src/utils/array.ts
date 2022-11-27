// insert produces a new array by inserting values to original
// at the position before index.
export function insert<T>(original: T[], index: number, ...values: T[]): T[] {
  if (values.length === 0) {
    return original;
  }

  // ? should we throw for invalid index

  // guard against index to insert is less than 0
  index = Math.max(index, 0);
  // guard against index to insert being too large
  index = Math.min(index, original.length);

  // Avoid double-copy original from slice + spread
  const result = new Array(original.length + values.length);

  // micro-optimization: cache length lookup for the loop
  const n = original.length;
  const m = values.length;

  // fill with original leaving gap for values at index
  for (let oi = 0; oi < n; oi++) {
    const ri = oi < index ? oi : oi + m;
    result[ri] = original[oi];
  }

  // fill the gap left by the previous loop with values
  for (let i = 0; i < m; i++) {
    result[i + index] = values[i];
  }

  return result;
}

// move produces a new array by moving values at indices
// to the position before index.
export function move<T>(original: T[], index: number, indices: number[]): T[] {
  const n = original.length;

  indices = [...indices]
    // ? should we throw for invalid indices
    // guard against invalid indices such as -1 i.e. mapping over findIndex
    // as well as anything that is out of range.
    .filter((i) => i >= 0 && i < n)
    // sort (asc) the indices to retain the order in original
    // otherwise it'd be affected by the order of indices.
    // O(m log m) where m = indices.length
    .sort((a, b) => a - b);

  if (n === 0 || indices.length === 0) {
    return original;
  }

  const result = new Array(n);
  const toMove = new Set(indices);

  let oi = 0; // pointer for original (read)
  let ri = 0; // pointer for result (write)

  for (; oi < index; oi++) {
    if (!toMove.has(oi)) {
      result[ri++] = original[oi];
    }
  }

  for (const i of indices) {
    result[ri++] = original[i];
  }

  for (; oi < n; oi++) {
    if (!toMove.has(oi)) {
      result[ri++] = original[oi];
    }
  }

  return result;
}
