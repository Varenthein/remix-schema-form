import * as z from "zod";
import { tryToGetZodErrorMsg } from "../utils/tryToGetZodErrorMsg";
import { zEmail } from "../../src/utils/zodSchemaHelpers/zEmail";

test("should properly parse valid input data (no options)", () => {
  const mySchema = z.object({
    test: zEmail(),
  });

  expect(mySchema.parse({ test: "test@example.com" })).toEqual({
    test: "test@example.com",
  });
  expect(mySchema.parse({ test: "test2@example.com" })).toEqual({
    test: "test2@example.com",
  });
});

test("should properly parse valid input data (with min options)", () => {
  const mySchema = z.object({
    test: zEmail({
      min: 2,
    }),
  });

  expect(mySchema.parse({ test: "abc@d.pl" })).toEqual({ test: "abc@d.pl" });
  expect(mySchema.parse({ test: "abc@def.pl" })).toEqual({
    test: "abc@def.pl",
  });
  expect(mySchema.parse({ test: "verlongname@verylongodmain.pl" })).toEqual({
    test: "verlongname@verylongodmain.pl",
  });
});

test("should properly parse valid input data (with max options)", () => {
  const mySchema = z.object({
    test: zEmail({
      max: 10,
    }),
  });

  expect(mySchema.parse({ test: "abc@d.pl" })).toEqual({ test: "abc@d.pl" });
  expect(mySchema.parse({ test: "abc@def.pl" })).toEqual({
    test: "abc@def.pl",
  });
});

test("should properly parse valid input data (with both min+max options)", () => {
  const mySchema = z.object({
    test: zEmail({
      min: 2,
      max: 10,
    }),
  });

  expect(mySchema.parse({ test: "abc@d.pl" })).toEqual({ test: "abc@d.pl" });
  expect(mySchema.parse({ test: "abc@def.pl" })).toEqual({
    test: "abc@def.pl",
  });
});

test("should throw error if input data is not valid e-mail", () => {
  const mySchema = z.object({
    test: zEmail(),
  });

  const items = [
    "test@example",
    "testexample.com",
    "test@@.example.com",
    "@example.com",
    null,
    undefined,
    {},
    [],
    5,
  ];
  for (const item of items)
    expect(() => mySchema.parse({ test: item })).toThrowError(z.ZodError);
});

test("should throw error if min option provided and the value is too low", () => {
  const mySchema = z.object({
    test: zEmail({
      min: 10,
    }),
  });

  expect(() => mySchema.parse({ test: "abc@d.pl" })).toThrowError(z.ZodError);
  expect(() => mySchema.parse({ test: "abc@de.pl" })).toThrowError(z.ZodError);
  expect(() => mySchema.parse({ test: "abc@def" })).toThrowError(z.ZodError);
});

test("should throw error if max option provided and the value is too high", () => {
  const mySchema = z.object({
    test: zEmail({
      max: 5,
    }),
  });

  expect(() => mySchema.parse({ test: "abc@d.pl" })).toThrowError(z.ZodError);
  expect(() => mySchema.parse({ test: "abc@de.pl" })).toThrowError(z.ZodError);
  expect(() => mySchema.parse({ test: "abc@def.pl" })).toThrowError(z.ZodError);
});

test("should throw proper error message if input is invalid type", () => {
  const mySchema = z.object({
    test: zEmail(),
  });

  const items = [undefined, null, {}, [], function () {}, true, false, 10, 0];
  for (const item of items) {
    expect(tryToGetZodErrorMsg(() => mySchema.parse({ test: item }))).toEqual(
      "invalid"
    );
  }
});

test("should throw proper error message if input is not valid e-mail", () => {
  const mySchema = z.object({
    test: zEmail(),
  });

  const items = [
    "test@example",
    "testexample.com",
    "test@@.example.com",
    "@example.com",
  ];
  for (const item of items) {
    expect(tryToGetZodErrorMsg(() => mySchema.parse({ test: item }))).toEqual(
      "invalidEmail"
    );
  }
});

test("should throw proper error message if min option provided and the value is too low", () => {
  const mySchema = z.object({
    test: zEmail({
      min: 10,
    }),
  });

  const items = ["a@b.pl", "a@bc.pl", "a@bcde.pl"];
  for (const item of items) {
    expect(tryToGetZodErrorMsg(() => mySchema.parse({ test: item }))).toEqual(
      "tooShort|min=10"
    );
  }
});

test("should throw proper error message if max option provided and the value is too high", () => {
  const mySchema = z.object({
    test: zEmail({
      max: 5,
    }),
  });

  const items = ["a@b.pl", "a@bc.pl", "a@bcde.pl"];
  for (const item of items) {
    expect(tryToGetZodErrorMsg(() => mySchema.parse({ test: item }))).toEqual(
      "tooLong|max=5"
    );
  }
});
