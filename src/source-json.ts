export type Cards =  Record<string, string>;

export interface Item {
    source_key_text: string,
    source_value_text: string,
    cards: Cards,
    last_revision: Date,
    revision_count: number,
    favorite_lvl: number,
    error_count: number
}

export interface SourceJson {
    items: Item[]
}
