import * as z from "zod";
import { zCheckbox } from "../../src/utils/zodSchemaHelpers/zCheckbox";
import { tryToGetZodErrorMsg } from "../utils/tryToGetZodErrorMsg";

test("should properly parse input data if boolean used (not required)", () => {
  const mySchema = z.object({
    test: zCheckbox(),
  });

  expect(mySchema.parse({ test: true })).toEqual({ test: true });
  expect(mySchema.parse({ test: false })).toEqual({ test: false });
});

test("should require true if required flag is set to true", () => {
  const mySchema = z.object({
    test: zCheckbox({
      required: true,
    }),
  });

  expect(mySchema.parse({ test: true })).toEqual({ test: true });
  expect(() => mySchema.parse({ test: false })).toThrowError(z.ZodError);
});

test("should throw proper error messages if data is invalid", () => {
  const mySchema = z.object({
    test: zCheckbox({}),
  });

  const items = ["true", "false", "foo", 0, 1, null, undefined, {}];
  for (const item of items) {
    expect(() => mySchema.parse({ test: item })).toThrowError(z.ZodError);
    expect(tryToGetZodErrorMsg(() => mySchema.parse({ test: item }))).toEqual(
      "invalid"
    );
  }
});

test("should throw proper error messages if false provided to required schema", () => {
  const mySchema = z.object({
    test: zCheckbox({
      required: true,
    }),
  });

  expect(() => mySchema.parse({ test: false })).toThrowError(z.ZodError);
  expect(tryToGetZodErrorMsg(() => mySchema.parse({ test: false }))).toEqual(
    "required"
  );
});
