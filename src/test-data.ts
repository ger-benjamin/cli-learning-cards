import type { Item } from "./source-json.js";

export const generateTestItems = (howMany: number): Item[] => {
  return Array(howMany)
    .fill(null)
    .map((_, index) => generateTestItem(index));
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
    last_revision: new Date(),
    revision_count: 0,
    favorite_lvl: 0,
    errors_last: 0,
    errors_total: 0,
  };
};
