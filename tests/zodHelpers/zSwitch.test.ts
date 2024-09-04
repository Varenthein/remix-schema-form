import * as z from "zod";
import { tryToGetZodErrorMsg } from "../utils/tryToGetZodErrorMsg";
import { zSwitch } from "../../src/utils/zodSchemaHelpers/zSwitch";

test("should properly parse input data if boolean used", () => {
  const mySchema = z.object({
    test: zSwitch(),
  });

  expect(mySchema.parse({ test: true })).toEqual({ test: true });
  expect(mySchema.parse({ test: false })).toEqual({ test: false });
});

test("should throw proper error messages if data is invalid", () => {
  const mySchema = z.object({
    test: zSwitch(),
  });

  const items = ["true", "false", "foo", 0, 1, null, undefined, {}];
  for (const item of items) {
    expect(() => mySchema.parse({ test: item })).toThrowError(z.ZodError);
    expect(tryToGetZodErrorMsg(() => mySchema.parse({ test: item }))).toEqual(
      "invalid"
    );
  }
});
