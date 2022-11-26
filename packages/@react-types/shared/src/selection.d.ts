export interface SingleSelection {
  disallowEmptySelection?: boolean;
  selectedKey?: React.Key | null;
  defaultSelectedKey?: React.Key;
  onSelectionChange?: (key: Key) => unknown;
}

export type SelectionMode = 'none' | 'single' | 'multiple';
export type Selection = 'all' | Set<React.Key>;
export interface MultipleSelection {
  selectionMode?: SelectionMode;
  disallowEmptySelection?: boolean;
  selectedKeys?: 'all' | Iterable<React.Key>;
  defaultSelectedKeys?: 'all' | Iterable<React.Key>;
  onSelectionChange?: (selection: Selection) => unknown;
  disabledKeys?: Iterable<Key>;
}
