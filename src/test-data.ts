import type { Item } from "./source-json.js";

const now = new Date();

export const generateTestItems = (howMany: number): Item[] => {
  return Array.from([howMany]).map((index) => generateTestItem(index));
};

const generateTestItem = (index: number): Item => {
  return {
    id: `${index}`,
    card: {
      front: {
        key: `front-${index}`,
        variations: [`front-var1-${index}`],
      },
      back: {
        key: `back-${index}`,
        variations: [`front-back1-${index}`],
      },
    },
    last_revision: now,
    revision_count: 0,
    favorite_lvl: 0,
    error_count: 0,
  };
};
