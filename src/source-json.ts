export interface Side {
  key: string;
  variations: string[];
}

export interface Card {
  front: Side;
  back: Side;
}

export interface Item {
  id: string;
  card: Card;
  last_revision: Date;
  revision_count: number;
  favorite_lvl: number;
  error_count: number;
}

export interface SourceJson {
  items: Item[];
}
