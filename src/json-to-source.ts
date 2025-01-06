import { readFile } from "node:fs/promises";
import type { Item, SourceJson } from "./source-json.js";

/**
 * @returns a parsed Date or log an error and returns "now".
 */
export const parseItemDate = (id: string, date: Date | string): Date => {
  const parsedDate = new Date(date);
  if (!parsedDate || isNaN(parsedDate.getTime())) {
    console.error(`Wrong date format on entry: ${id}, use now instead.`);
    return new Date();
  }
  return parsedDate;
};

/**
 * Convert an object to an Item or throw.
 * @returns an valid item or throw an error.
 */
export const fromAnyItemToItem = (
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  anyItem: any,
  index: number,
): Item => {
  const id = anyItem?.id;
  const anyFront = anyItem?.card?.front;
  const frontMain = anyFront?.main;
  const anyBack = anyItem?.card?.back;
  const backMain = anyBack?.main;
  if (!id || !frontMain || !backMain) {
    throw new Error(
      `Error reading source json, item without id (${id}) or text. Index: ${index}.`,
    );
  }
  const front = {
    main: frontMain,
    variations: anyFront?.variations ?? [],
  };
  const back = {
    main: backMain,
    variations: anyBack?.variations ?? [],
  };
  const card = { front, back };
  return {
    id,
    card,
    last_revision: parseItemDate(id, anyItem?.last_revision),
    categories: anyItem?.categories?.length ? anyItem.categories : [],
    revision_count: anyItem.revision_count ?? 0,
    favorite_lvl: anyItem.favorite_lvl ?? 0,
    errors_last: anyItem.errors_last ?? 0,
    errors_total: anyItem.errors_total ?? 0,
  };
};

/**
 * Read and set up the source json file (or show error and returns null).
 * @returns a SourceJson or null.
 */
export const parseJsonSource = async (
  sourcePath: string | URL,
): Promise<SourceJson | null> => {
  let items: Item[] | null = null;
  try {
    const contents = await readFile(sourcePath, { encoding: "utf8" });
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const anySourceJson: any = JSON.parse(contents);
    const anyItems = anySourceJson?.items;
    if (!anyItems || !anyItems.length) {
      throw new Error("Error reading source json, no items found.");
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    items = anyItems.map((anyItem: any, index: number) =>
      fromAnyItemToItem(anyItem, index),
    );
  } catch (err) {
    console.error((err as Error).message);
  }
  return items ? { items } : null;
};
