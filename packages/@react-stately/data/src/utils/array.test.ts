import {insert, move} from './array';

describe('insert', () => {
  let original: number[];
  beforeEach(() => {
    original = [0, 1, 2];
  });

  it('inserts to an empty array', () => {
    const original: number[] = [];
    const result = insert(original, 0, 4, 2);
    expect(result).not.toBe(original);
    expect(result).toEqual([4, 2]);

    // index to insert doesn't matter in this case
    expect(insert(original, 3, 4, 2)).toEqual([4, 2]);
  });

  it('returns original if there is nothing to insert', () => {
    expect(insert(original, 0)).toBe(original);
    expect(insert(original, 99)).toBe(original);
  });

  it('inserts one value', () => {
    const result = insert(original, 1, 3);
    expect(result).not.toBe(original);
    expect(result).toEqual([0, 3, 1, 2]);
  });

  it('inserts multiple values', () => {
    const toInsert = [3, 0, -1];
    const result = insert(original, 1, ...toInsert);
    expect(result).not.toBe(original);
    expect(result).toEqual([0, ...toInsert, 1, 2]);
  });

  it('inserts before index 0', () => {
    const result = insert(original, -1, 9);
    expect(result).toEqual([9, 0, 1, 2]);
  });

  it('inserts at index 0', () => {
    const result = insert(original, 0, 9);
    expect(result).toEqual([9, 0, 1, 2]);
  });

  it('inserts at last index', () => {
    const result = insert(original, original.length - 1, 9);
    expect(result).toEqual([0, 1, 9, 2]);
  });

  it('inserts after last index', () => {
    const result = insert(original, original.length, 9);
    expect(result).toEqual([0, 1, 2, 9]);
  });

  it('inserts objects', () => {
    const original = [{id: 'a'}, {id: 'b'}];
    const result = insert(original, 1, {id: 'd'}, {id: 'c'});
    expect(result).not.toBe(original);
    // keep reference of the items
    expect(result[0]).toBe(original[0]);
    expect(result[1]).toEqual({id: 'd'});
    expect(result[2]).toEqual({id: 'c'});
    expect(result[3]).toBe(original[1]);
  });
});

describe('move', () => {
  let original: number[];
  let indices: number[];
  beforeEach(() => {
    original = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    indices = [3, 6];
  });

  it('does nothing if original is empty', () => {
    const original: number[] = [];
    const result = move(original, 3, [1, 2]);
    expect(result).toBe(original);
  });

  it('does nothing if indices is empty', () => {
    const result = move(original, 3, []);
    expect(result).toBe(original);
  });

  it('moves items to the beginning when index <= 0', () => {
    const expected = [3, 6, 0, 1, 2, 4, 5, 7, 8, 9, 10];
    expect(move(original, -1, indices)).toEqual(expected);
    expect(move(original, 0, indices)).toEqual(expected);
  });

  it('moves items to the end when index is larger than last index', () => {
    const result = move(original, 11, indices);
    expect(result).toEqual([0, 1, 2, 4, 5, 7, 8, 9, 10, 3, 6]);
  });

  describe('moves all items before index', () => {
    test.each([
      // index, expected
      [2, [0, 1, 3, 6, 2, 4, 5, 7, 8, 9, 10]],
      [4, [0, 1, 2, 3, 6, 4, 5, 7, 8, 9, 10]],
      [5, [0, 1, 2, 4, 3, 6, 5, 7, 8, 9, 10]],
      [8, [0, 1, 2, 4, 5, 7, 3, 6, 8, 9, 10]],
      [10, [0, 1, 2, 4, 5, 7, 8, 9, 3, 6, 10]],
    ])('index = %d', (index, expected) => {
      const result = move(original, index, indices);
      expect(result).not.toBe(original);
      expect(result).toEqual(expected);
    });
  });

  it('produces the same result regardless of the order of indices', () => {
    const expected = [1, 2, 4, 0, 3, 6, 9, 5, 7, 8, 10];
    for (const indices of [
      [3, 6, 9, 0],
      [6, 3, 0, 9],
      [0, 9, 3, 6],
      [9, 0, 6, 3],
    ]) {
      const result = move(original, 5, indices);
      expect(result).toEqual(expected);
    }
  });

  describe('when index is the same as one of indices', () => {
    it('moves items before the next index', () => {
      expect(move(original, 3, indices)).toEqual([
        // 3, 6 comes before 4
        0, 1, 2, 3, 6, 4, 5, 7, 8, 9, 10,
      ]);
      expect(move(original, 6, indices)).toEqual([
        // 3, 6 comes before 7
        0, 1, 2, 4, 5, 3, 6, 7, 8, 9, 10,
      ]);
    });
  });

  it('ignores values in indices invalid index or out of range', () => {
    const indices = [3, 6, -1, 99, Infinity];
    const result = move(original, 5, indices);
    expect(result).toEqual([0, 1, 2, 4, 3, 6, 5, 7, 8, 9, 10]);
  });

  it('moves objects', () => {
    const original = [{id: 'a'}, {id: 'b'}, {id: 'c'}, {id: 'd'}];
    const indices = [0, 3];
    const result = move(original, 1, indices);
    expect(result).not.toBe(original);
    // keep reference of the items
    expect(result[0]).toBe(original[0]);
    expect(result[1]).toBe(original[3]);
    expect(result[2]).toBe(original[1]);
    expect(result[3]).toBe(original[2]);
  });
});
