import { AnyFormFieldsSchema } from "./types";

export const schemaHasConditionalFields = (schema: AnyFormFieldsSchema) =>
  Object.values(schema).some((i) => i.conditioned);
