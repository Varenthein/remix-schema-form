import type {
  AnyFormFieldsSchema,
  AnySchemaConditionals,
  FormFieldSchema,
  SchemaWithOptionalConditionals,
} from "./types";

export const enhanceSchemaWithConditionals = <
  Schema extends AnyFormFieldsSchema,
  Conditionals extends AnySchemaConditionals
>(
  schema: Schema,
  conditionals: Conditionals
): SchemaWithOptionalConditionals<Schema> => {
  const enhancedSchema: Record<string, FormFieldSchema<string, string>> = {};

  for (const [key, value] of Object.entries(schema)) {
    if (conditionals[key])
      enhancedSchema[key as string] = {
        ...value,
        conditioned: conditionals[key] as (data: object) => Boolean,
      };
    else enhancedSchema[key as string] = value;
  }

  return enhancedSchema as SchemaWithOptionalConditionals<Schema>;
};
