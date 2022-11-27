import {act, render, renderHook} from '@testing-library/react';
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

    describe('when inserting with a key that does not exist', () => {
      it('should return state as-is', () => {
        const {result} = renderHook(() => useListData({initialItems, getKey}));
        const initialResult = result.current;

        act(() => {
          result.current.insertBefore('fakeKey', {name: 'Devon'});
        });

        expect(result.current.items).toBe(initialResult.items);
      });

      it('should not wipe list state', () => {
        const {result} = renderHook(() =>
          useListData({
            initialItems,
            getKey,
            initialSelectedKeys: ['Sam', 'Julia'],
            initialFilterText: 'test',
          })
        );
        const initialResult = result.current;

        act(() => {
          result.current.insertBefore('fakeKey', {name: 'Devon'});
        });

        expect(result.current.items).toBe(initialResult.items);
        expect(result.current.selectedKeys).toBe(initialResult.selectedKeys);
        expect(result.current.filterText).toBe(initialResult.filterText);
      });
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

    describe('when inserting with a key that does not exist', () => {
      it('should return state as-is', () => {
        const {result} = renderHook(() => useListData({initialItems, getKey}));
        const initialResult = result.current;

        act(() => {
          result.current.insertAfter('fakeKey', {name: 'Devon'});
        });

        expect(result.current.items).toBe(initialResult.items);
      });

      it('should not wipe list state', () => {
        const {result} = renderHook(() =>
          useListData({
            initialItems,
            getKey,
            initialSelectedKeys: ['Sam', 'Julia'],
            initialFilterText: 'test',
          })
        );
        const initialResult = result.current;

        act(() => {
          result.current.insertAfter('fakeKey', {name: 'Devon'});
        });

        expect(result.current.items).toBe(initialResult.items);
        expect(result.current.selectedKeys).toBe(initialResult.selectedKeys);
        expect(result.current.filterText).toBe(initialResult.filterText);
      });
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

    it('should remove multiple items', () => {
      const {result} = renderHook(() =>
        useListData({
          initialItems,
          getKey,
          initialSelectedKeys: ['Sam', 'David', 'Julia'],
        })
      );
      const initialResult = result.current;

      act(() => {
        result.current.remove('Sam', 'David');
      });

      expect(result.current.items).not.toBe(initialResult.items);
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toBe(initialResult.items[2]);
      // remove keys of the items being removed from the selection
      expect(result.current.selectedKeys).not.toBe(initialResult.selectedKeys);
      expect(result.current.selectedKeys).toEqual(new Set(['Julia']));
    });

    describe('when selection is "all"', () => {
      it('should preserve the selection', () => {
        const {result} = renderHook(() =>
          useListData({initialItems, getKey, initialSelectedKeys: 'all'})
        );

        act(() => {
          result.current.remove('Sam');
        });

        expect(result.current.selectedKeys).toEqual('all');
      });

      it('should change the selection to an empty set when the last item is removed', () => {
        const {result} = renderHook(() =>
          useListData({initialItems, getKey, initialSelectedKeys: 'all'})
        );

        act(() => {
          result.current.remove('Sam');
          result.current.remove('David');
          result.current.remove('Julia');
        });

        expect(result.current.items).toHaveLength(0);
        expect(result.current.selectedKeys).toEqual(new Set());
      });
    });
  });

  describe('removeSelectedItems', () => {
    it('should remove selected items', () => {
      const {result} = renderHook(() =>
        useListData({
          initialItems,
          getKey,
          initialSelectedKeys: ['Sam', 'Julia'],
        })
      );
      const initialResult = result.current;

      act(() => {
        result.current.removeSelectedItems();
      });

      expect(result.current.items).not.toBe(initialResult.items);
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toBe(initialResult.items[0]);
      expect(result.current.selectedKeys).not.toBe(initialResult.selectedKeys);
      expect(result.current.selectedKeys).toEqual(new Set());
    });

    it('should remove all items for "all" selection', () => {
      const {result} = renderHook(() =>
        useListData({initialItems, getKey, initialSelectedKeys: 'all'})
      );
      const initialResult = result.current;

      act(() => {
        result.current.removeSelectedItems();
      });

      expect(result.current.items).not.toBe(initialResult.items);
      expect(result.current.items).toHaveLength(0);
      expect(result.current.selectedKeys).not.toBe(initialResult.selectedKeys);
      expect(result.current.selectedKeys).toEqual(new Set());
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

  it('should return filtered items based on filter text', () => {
    const {result} = renderHook(() =>
      useListData({initialItems, getKey, filter})
    );

    expect(result.current.items).toHaveLength(3);
    expect(result.current.items).toEqual(initialItems);

    act(() => {
      result.current.setFilterText('Da');
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items).toEqual([{name: 'David'}]);
  });

  it('should filter items when initialFilterText is provided', () => {
    const {result} = renderHook(() =>
      useListData({initialItems, filter, initialFilterText: 'Sa'})
    );

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual({name: 'Sam'});
  });
});
