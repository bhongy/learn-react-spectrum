import {ReactElement, ReactNode} from 'react';

export interface ItemProps<T> {
  // Rendered contents of the item or child items.
  children: ReactNode;
  // A list of child items objects. Used for dynamic collections.
  childItems?: Iterable<T>;
}

export type ItemElement<T> = ReactElement<ItemProps<T>>;
export type ItemRenderer<T> = (item: T) => ItemElement<T>;
