import { getTableColumns, Table } from "@workspace/db";

export const getFields = <T extends Table>(
  table: T,
  ...fields: (keyof T["_"]["columns"])[]
) => {
  const allColumns = getTableColumns(table);
  return Object.fromEntries(
    fields.map((field) => [field, allColumns[field]]),
  ) as Pick<typeof allColumns, keyof typeof allColumns>;
};
