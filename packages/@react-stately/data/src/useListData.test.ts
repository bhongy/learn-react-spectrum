import {act, renderHook} from '@testing-library/react';
import {useListData} from './useListData';

interface TestItem {
  name: string;
}

const getKey = (item: TestItem): string => item.name;
const filter = (item: TestItem, filterText: string) =>
  item.name.includes(filterText);

describe('useListData', () => {
  let initialItems: TestItem[];

  beforeEach(() => {
    initialItems = [{name: 'David'}, {name: 'Sam'}, {name: 'Julia'}];
  });

  it('should construct a list using initial data', () => {
    const selectedKeys = ['Sam', 'Julia'];
    const {result} = renderHook(() =>
      useListData({initialItems, getKey, initialSelectedKeys: selectedKeys})
    );
    expect(result.current.items).toBe(initialItems);
    expect(result.current.selectedKeys).toEqual(new Set(selectedKeys));
  });

  describe('getItem', () => {
    it('should get an item by key', () => {
      const {result} = renderHook(() => useListData({initialItems, getKey}));
      const item = result.current.getItem('Sam');
      expect(item).toBe(initialItems[1]);
    });

    it('should get undefined if no item for the key', () => {
      const {result} = renderHook(() => useListData({initialItems, getKey}));
      const item = result.current.getItem('Does not exist');
      expect(item).toBeUndefined();
    });

    it('should get undefined if items are empty', () => {
      const {result} = renderHook(() =>
        useListData({initialItems: [], getKey})
      );
      const item = result.current.getItem('Sam');
      expect(item).toBeUndefined();
    });
  });

  describe('insert', () => {
    it('should insert an item at an index', () => {
      const {result} = renderHook(() => useListData({initialItems, getKey}));
      const initialResult = result.current;

      act(() => {
        result.current.insert(1, {name: 'Devon'});
      });

      expect(result.current.items).not.toBe(initialResult.items);
      expect(result.current.items).toHaveLength(4);
      expect(result.current.items[0]).toBe(initialResult.items[0]);
      expect(result.current.items[1]).toEqual({name: 'Devon'});
      expect(result.current.items[2]).toBe(initialResult.items[1]);
      expect(result.current.items[3]).toBe(initialResult.items[2]);
    });

    it('should insert multiple items at an index', () => {
      const {result} = renderHook(() => useListData({initialItems, getKey}));
      const initialResult = result.current;

      act(() => {
        result.current.insert(1, {name: 'Devon'}, {name: 'Danni'});
      });

      expect(result.current.items).not.toBe(initialResult.items);
      expect(result.current.items).toHaveLength(5);
      expect(result.current.items[0]).toBe(initialResult.items[0]);
      expect(result.current.items[1]).toEqual({name: 'Devon'});
      expect(result.current.items[2]).toEqual({name: 'Danni'});
      expect(result.current.items[3]).toBe(initialResult.items[1]);
      expect(result.current.items[4]).toBe(initialResult.items[2]);
    });
  });

  describe('insertBefore', () => {
    it('should insert an item before another item', () => {
      const {result} = renderHook(() => useListData({initialItems, getKey}));
      const initialResult = result.current;

      act(() => {
        result.current.insertBefore('Sam', {name: 'Devon'});
      });

      expect(result.current.items).not.toBe(initialResult.items);
      expect(result.current.items).toHaveLength(4);
      expect(result.current.items[0]).toBe(initialResult.items[0]);
      expect(result.current.items[1]).toEqual({name: 'Devon'});
      expect(result.current.items[2]).toBe(initialResult.items[1]);
      expect(result.current.items[3]).toBe(initialResult.items[2]);
    });

    it('should insert multiple items before another item', () => {
      const {result} = renderHook(() => useListData({initialItems, getKey}));
      const initialResult = result.current;

      act(() => {
        result.current.insertBefore('Sam', {name: 'Devon'}, {name: 'Danni'});
      });

      expect(result.current.items).not.toBe(initialResult.items);
      expect(result.current.items).toHaveLength(5);
      expect(result.current.items[0]).toBe(initialResult.items[0]);
      expect(result.current.items[1]).toEqual({name: 'Devon'});
      expect(result.current.items[2]).toEqual({name: 'Danni'});
      expect(result.current.items[3]).toBe(initialResult.items[1]);
      expect(result.current.items[4]).toBe(initialResult.items[2]);
    });

    it('should return state as-is if no item for the key', () => {
      const {result} = renderHook(() => useListData({initialItems, getKey}));
      const initialResult = result.current;

      act(() => {
        result.current.insertBefore('John', {name: 'Devon'});
      });

      expect(result.current.items).toBe(initialResult.items);
    });

    it('should insert items to empty items regardless of the key', () => {
      const {result} = renderHook(() =>
        useListData({initialItems: [], getKey})
      );
      const initialResult = result.current;

      act(() => {
        result.current.insertBefore('Sam', {name: 'Devon'}, {name: 'Danni'});
      });

      expect(result.current.items).not.toBe(initialResult.items);
      expect(result.current.items).toEqual([{name: 'Devon'}, {name: 'Danni'}]);
    });
  });

  describe('insertAfter', () => {
    it('should insert an item after another item', () => {
      const {result} = renderHook(() => useListData({initialItems, getKey}));
      const initialResult = result.current;

      act(() => {
        result.current.insertAfter('Sam', {name: 'Devon'});
      });

      expect(result.current.items).not.toBe(initialResult.items);
      expect(result.current.items).toHaveLength(4);
      expect(result.current.items[0]).toBe(initialResult.items[0]);
      expect(result.current.items[1]).toBe(initialResult.items[1]);
      expect(result.current.items[2]).toEqual({name: 'Devon'});
      expect(result.current.items[3]).toBe(initialResult.items[2]);
    });

    it('should insert multiple items after another item', () => {
      const {result} = renderHook(() => useListData({initialItems, getKey}));
      const initialResult = result.current;

      act(() => {
        result.current.insertAfter('Sam', {name: 'Devon'}, {name: 'Danni'});
      });

      expect(result.current.items).not.toBe(initialResult.items);
      expect(result.current.items).toHaveLength(5);
      expect(result.current.items[0]).toBe(initialResult.items[0]);
      expect(result.current.items[1]).toBe(initialResult.items[1]);
      expect(result.current.items[2]).toEqual({name: 'Devon'});
      expect(result.current.items[3]).toEqual({name: 'Danni'});
      expect(result.current.items[4]).toBe(initialResult.items[2]);
    });

    it('should return state as-is if no item for the key', () => {
      const {result} = renderHook(() => useListData({initialItems, getKey}));
      const initialResult = result.current;

      act(() => {
        result.current.insertAfter('John', {name: 'Devon'});
      });

      expect(result.current.items).toBe(initialResult.items);
    });

    it('should insert items to empty items regardless of the key', () => {
      const {result} = renderHook(() =>
        useListData({initialItems: [], getKey})
      );
      const initialResult = result.current;

      act(() => {
        result.current.insertAfter('Sam', {name: 'Devon'}, {name: 'Danni'});
      });

      expect(result.current.items).not.toBe(initialResult.items);
      expect(result.current.items).toEqual([{name: 'Devon'}, {name: 'Danni'}]);
    });
  });

  it('should prepend items', () => {
    const {result} = renderHook(() => useListData({initialItems, getKey}));
    const initialResult = result.current;

    act(() => {
      result.current.prepend({name: 'Devon'}, {name: 'Danni'});
    });

    expect(result.current.items).not.toBe(initialResult.items);
    expect(result.current.items).toHaveLength(5);
    expect(result.current.items[0]).toEqual({name: 'Devon'});
    expect(result.current.items[1]).toEqual({name: 'Danni'});
    expect(result.current.items[2]).toBe(initialResult.items[0]);
    expect(result.current.items[3]).toBe(initialResult.items[1]);
    expect(result.current.items[4]).toBe(initialResult.items[2]);
  });

  it('should append items', () => {
    const {result} = renderHook(() => useListData({initialItems, getKey}));
    const initialResult = result.current;

    act(() => {
      result.current.append({name: 'Devon'}, {name: 'Danni'});
    });

    expect(result.current.items).not.toBe(initialResult.items);
    expect(result.current.items).toHaveLength(5);
    expect(result.current.items[0]).toBe(initialResult.items[0]);
    expect(result.current.items[1]).toBe(initialResult.items[1]);
    expect(result.current.items[2]).toBe(initialResult.items[2]);
    expect(result.current.items[3]).toEqual({name: 'Devon'});
    expect(result.current.items[4]).toEqual({name: 'Danni'});
  });

  // ...

  describe('remove', () => {
    it('should remove an item', () => {
      const {result} = renderHook(() =>
        useListData({
          initialItems,
          getKey,
          initialSelectedKeys: ['Sam', 'Julia'],
        })
      );
      const initialResult = result.current;

      act(() => {
        result.current.remove('Sam');
      });

      expect(result.current.items).not.toBe(initialResult.items);
      expect(result.current.items).toHaveLength(2);
      expect(result.current.items[0]).toBe(initialResult.items[0]);
      expect(result.current.items[1]).toBe(initialResult.items[2]);
      expect(result.current.selectedKeys).not.toBe(initialResult.selectedKeys);
      expect(result.current.selectedKeys).toEqual(new Set(['Julia']));
    });
  });

  describe('move', () => {
    it('should move an item', () => {
      const {result} = renderHook(() => useListData({initialItems, getKey}));
      const initialResult = result.current;

      act(() => {
        result.current.move('Sam', 0);
      });

      expect(result.current.items).not.toBe(initialResult.items);
      expect(result.current.items).toHaveLength(3);
      expect(result.current.items[0]).toBe(initialResult.items[1]);
      expect(result.current.items[1]).toBe(initialResult.items[0]);
      expect(result.current.items[2]).toBe(initialResult.items[2]);
    });
  });

  describe('update', () => {
    it('should update an item', () => {
      const {result} = renderHook(() => useListData({initialItems, getKey}));
      const initialResult = result.current;

      act(() => {
        result.current.update('Sam', {name: 'Devon'});
      });

      expect(result.current.items).not.toBe(initialResult.items);
      expect(result.current.items).toHaveLength(3);
      expect(result.current.items[0]).toBe(initialResult.items[0]);
      expect(result.current.items[1]).not.toBe(initialResult.items[1]);
      expect(result.current.items[1]).toEqual({name: 'Devon'});
      expect(result.current.items[2]).toBe(initialResult.items[2]);
    });
  });
});
