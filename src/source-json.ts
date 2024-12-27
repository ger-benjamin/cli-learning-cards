export interface Side {
  main: string;
  variations: string[];
}

export interface Card {
  front: Side;
  back: Side;
}

export interface Item {
  id: string;
  card: Card;
  categories: string[];
  last_revision: Date;
  revision_count: number;
  favorite_lvl: number;
  errors_last: number;
  errors_total: number;
}

export interface SourceJson {
  items: Item[];
}
