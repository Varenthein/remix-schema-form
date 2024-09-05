import * as z from "zod";
import { zFile } from "../../src/utils/zodSchemaHelpers/zFile";

test("should return proper type if valid data provided and required is not true", () => {
  const mySchema = z.object({
    test: zFile(),
  });

  expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test?: File | undefined
  }>();
});

test("should return date type if valid data provided and required is true", () => {
  const mySchema = z.object({
    test: zFile({
      required: true,
    }),
  });

  expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test: File
  }>();
});

test("should return proper  type if valid data and accept options provided (but with required = false)", () => {
  const mySchema = z.object({
    test: zFile({
      accept: ["image/png"]
    }),
  });

  expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test?: File | undefined
  }>();
});

test("should return proper type if valid data and maxSize options provided and required is set to true", () => {
  const mySchema = z.object({
    test: zFile({
      required: true,
      maxSize: 1024 * 1024 * 5,
    }),
  });

  expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test: File
  }>();
});

test("should return proper type if valid data and accept options provided and required is set to true", () => {
  const mySchema = z.object({
    test: zFile({
      required: true,
      accept: ["image/png"]
    }),
  });

  expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test: File
  }>();
});

test("should return proper type if valid data and maxSize options provided and required is set to true", () => {
  const mySchema = z.object({
    test: zFile({
      required: true,
      maxSize: 1024 * 1024 * 5,
    }),
  });

  expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test: File
  }>();
});

