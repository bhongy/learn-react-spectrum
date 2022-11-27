import {Selection} from '@react-types/shared';
import {useMemo, useState} from 'react';
import * as arrayUtils from './utils/array';

export interface ListOptions<T> {
  initialItems?: T[];
  // The keys for the initial selected items.
  initialSelectedKeys?: 'all' | Iterable<React.Key>;
  // The initial text to filter the list by.
  initialFilterText?: string;
  // A function that returns a unique key for an item object.
  getKey?: (item: T) => React.Key;
  // A function that returns whether a item matches the current filter text.
  filter?: (item: T, filterText: string) => boolean;
}

export interface ListState<T> {
  items: T[];
  selectedKeys: Selection;
  filterText: string;
}

interface ListActions<T> {
  setSelectedKeys(keys: Selection): void;

  setFilterText(filterText: string): void;

  insert(index: number, ...values: T[]): void;

  insertBefore(key: React.Key, ...values: T[]): void;

  insertAfter(key: React.Key, ...values: T[]): void;

  prepend(...values: T[]): void;

  append(...values: T[]): void;

  remove(...keys: React.Key[]): void;
  // Moves an item within the list.
  move(key: React.Key, toIndex: number): void;

  // Moves one or more items before a given key.
  moveBefore(key: React.Key, keys: Iterable<React.Key>): void;

  // Moves one or more items after a given key.
  moveAfter(key: React.Key, keys: Iterable<React.Key>): void;

  // Removes all items from the list that are currently
  // in the set of selected items.
  removeSelectedItems(): void;
  // Update an item in the list.
  update(key: React.Key, newValue: T): void;
}

// ListData is the returned value of the hook which contains
// data and action props
export interface ListData<T> extends ListState<T>, ListActions<T> {
  getItem(key: React.Key): T | undefined;
}

export function useListData<T>(options: ListOptions<T>): ListData<T> {
  const {
    initialItems = [],
    initialSelectedKeys,
    initialFilterText = '',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getKey = (item: any) => item.id || item.key,
    filter,
  } = options;

  const [state, setState] = useState<ListState<T>>({
    items: initialItems,
    selectedKeys:
      initialSelectedKeys === 'all'
        ? 'all'
        : new Set(initialSelectedKeys ?? []),
    filterText: initialFilterText,
  });

  const itemsByKey = useMemo(
    () => createItemsByKey(state.items, getKey),
    [getKey, state.items]
  );

  const filteredItems = useMemo(
    () =>
      filter
        ? state.items.filter((item) => filter(item, state.filterText))
        : state.items,
    [filter, state.items, state.filterText]
  );

  const actions = createListActions({getKey, itemsByKey}, setState);

  return {
    ...state,
    items: filteredItems,
    ...actions,

    getItem(key) {
      return itemsByKey.item(key);
    },
  };
}

interface ItemsByKey<T> {
  index(key: React.Key): number | undefined;
  item(key: React.Key): T | undefined;
}

// createItemsByKey builds functions that allow constant time for querying
// the item or index for a given key.
//
// The underlying data structure (Map) is lazily instantiated only
// at the first query to ensure we don't do the work unless we have to.
function createItemsByKey<T>(
  items: T[],
  getKey: (item: T) => React.Key
): ItemsByKey<T> {
  let entries: Map<React.Key, {item: T; index: number}>;
  const getEntry = (key: React.Key) => {
    if (!entries) {
      entries = items.reduce(
        (m, item, index) => m.set(getKey(item), {item, index}),
        new Map()
      );
    }
    return entries.get(key);
  };

  return {
    index: (k) => getEntry(k)?.index,
    item: (k) => getEntry(k)?.item,
  };
}

interface CreateListActionsProps<T> {
  getKey: (item: T) => React.Key;
  itemsByKey: ItemsByKey<T>;
  // TODO: cursor?
}

function createListActions<T>(
  props: CreateListActionsProps<T>,
  dispatch: React.Dispatch<React.SetStateAction<ListState<T>>>
): ListActions<T> {
  const {getKey, itemsByKey} = props;

  // TODO:
  // - (dev) warn found duplicate keys
  // - (dev) warn found "" as key
  // - (dev) warn key is undefined
  // ^ memo these on unfiltered items

  return {
    setSelectedKeys(selectedKeys) {
      dispatch((state) => ({...state, selectedKeys}));
    },

    setFilterText(filterText) {
      dispatch((state) => ({...state, filterText}));
    },

    insert(index, ...values) {
      dispatch((state) => insert(state, index, ...values));
    },

    insertBefore(key, ...values) {
      dispatch((state) => {
        if (state.items.length === 0) {
          return insert(state, 0, ...values);
        }

        const i = itemsByKey.index(key);
        if (i == null) {
          return state;
        }
        return insert(state, i, ...values);
      });
    },

    insertAfter(key, ...values) {
      dispatch((state) => {
        if (state.items.length === 0) {
          return insert(state, 0, ...values);
        }

        const i = itemsByKey.index(key);
        if (i == null) {
          return state;
        }
        return insert(state, i + 1, ...values);
      });
    },

    prepend(...values) {
      dispatch((state) => insert(state, 0, ...values));
    },

    append(...values) {
      dispatch((state) => insert(state, state.items.length, ...values));
    },

    remove(...keys) {
      dispatch((state) => {
        const keySet = new Set(keys);

        // remove (unfiltered) items matching the keys
        const items = state.items.filter((item) => !keySet.has(getKey(item)));

        // remove selection keys matching the keys
        let selection: Selection = 'all';
        if (state.selectedKeys !== 'all') {
          selection = new Set(state.selectedKeys);
          for (const k of keys) {
            selection.delete(k);
          }
        }

        // if (cursor == null && items.length === 0) {
        if (items.length === 0) {
          selection = new Set();
        }

        return {...state, items, selectedKeys: selection};
      });
    },

    removeSelectedItems() {
      dispatch((state) => {
        const {selectedKeys} = state;

        if (selectedKeys === 'all') {
          return {...state, items: [], selectedKeys: new Set()};
        }

        const items = state.items.filter(
          (item) => !selectedKeys.has(getKey(item))
        );
        return {...state, items, selectedKeys: new Set()};
      });
    },

    move(key, toIndex) {
      dispatch((state) => {
        const i = itemsByKey.index(key);
        if (i == null) {
          return state;
        }

        const items = [...state.items];
        [items[i], items[toIndex]] = [items[toIndex], items[i]];
        return {...state, items};
      });
    },

    moveBefore(key, keys) {
      dispatch((state) => {
        const i = itemsByKey.index(key);
        if (i == null) {
          return state;
        }

        const ks = Array.isArray(keys) ? keys : [...keys];
        const indices = ks.map((k) =>
          state.items.findIndex((item) => getKey(item) === k)
        );
        return move(state, i, indices);
      });
    },

    moveAfter(key, keys) {
      dispatch((state) => {
        const i = itemsByKey.index(key);
        if (i == null) {
          return state;
        }

        const ks = Array.isArray(keys) ? keys : [...keys];
        const indices = ks.map((k) =>
          state.items.findIndex((item) => getKey(item) === k)
        );
        return move(state, i + 1, indices);
      });
    },

    update(key, newValue) {
      dispatch((state) => {
        const i = itemsByKey.index(key);
        if (i == null) {
          return state;
        }

        const items = [...state.items];
        items[i] = newValue;
        return {...state, items};
      });
    },
  };
}

function insert<T>(
  state: ListState<T>,
  index: number,
  ...values: T[]
): ListState<T> {
  const items = arrayUtils.insert(state.items, index, ...values);
  return {...state, items};
}

function move<T>(
  state: ListState<T>,
  toIndex: number,
  indices: number[]
): ListState<T> {
  const items = arrayUtils.move(state.items, toIndex, indices);
  return {...state, items};
}
