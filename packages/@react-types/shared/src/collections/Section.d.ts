import {ReactNode} from 'react';
import {ItemElement, ItemRenderer} from './Item';

export interface SectionProps<T> {
  title?: ReactNode;
  // Static child items or a function to render children.
  children: ItemElement<T> | ItemElement<T>[] | ItemRenderer<T>;
  // Item objects in the section.
  items?: Iterable<T>;
}

export type SectionElement<T> = ReactElement<SectionProps<T>>;
