import {Key} from 'react';
import {ItemElement} from './Item';
import {SectionElement} from './Section';

/**
 * Collection is a generic interface to access a readonly sequential
 * collection of unique keyed items.
 */
export interface Collection<T> extends Iterable<T> {
  // The number of items in the collection.
  readonly size: number;

  // Iterate over all keys in the collection.
  getKeys(): Iterable<Key>;

  // Get an item by its key.
  getItem(key: Key): T | undefined;

  // Get an item by the index of its key.
  at(index: number): T | undefined;

  // Get the key that comes before the given key in the collection.
  getKeyBefore(key: Key): Key | undefined;

  // Get the key that comes after the given key in the collection.
  getKeyAfter(key: Key): Key | undefined;

  // Get the first key in the collection.
  getFirstKey(): Key | undefined;

  // Get the last key in the collection.
  getLastKey(): Key | undefined;
}

export interface Node<T> {
  // The type of item this node represents.
  // type: string;
  type: 'item' | 'section';
  // A unique key for the node.
  key: Key;
  // The object value the node was created from.
  value: T;

  // The loaded children of this node.
  childNodes: Iterable<Node<T>>;

  // The index of this node within its parent.
  index?: number;

  // The key of the parent node.
  parentKey?: Key;
  // The key of the node before this node.
  prevKey?: Key;
  // The key of the node after this node.
  nextKey?: Key;
}

export type CollectionElement<T> = ItemElement<T> | SectionElement<T>;
export type CollectionRenderer<T> = (item: T) => CollectionElement<T>;
export type CollectionChildren<T> =
  | CollectionElement<T>
  | CollectionElement<T>[]
  | CollectionRenderer<T>;

export interface CollectionBase<T> {
  children: CollectionChildren<T>;
}
