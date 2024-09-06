import * as z from "zod";
import { zFiles } from "../../src/utils/zodSchemaHelpers/zFiles";

test("should return proper type if valid data provided and minAmount is not true", () => {
  const mySchema = z.object({
    test: zFiles(),
  });

  expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test?: File[] | undefined;
  }>();
});

test("should return date type if valid data provided and minAmount is true", () => {
  const mySchema = z.object({
    test: zFiles({
      minAmount: 1,
    }),
  });

  expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test: File[];
  }>();
});

test("should return proper type if valid data and accept options provided (but with no minAmount)", () => {
  const mySchema = z.object({
    test: zFiles({
      accept: ["image/png"],
    }),
  });

  expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test?: File[] | undefined;
  }>();
});

test("should return proper type if valid data and maxSize options provided (but with no minAmount)", () => {
  const mySchema = z.object({
    test: zFiles({
      maxSize: 1024 * 1024 * 5,
    }),
  });

  expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test?: File[] | undefined;
  }>();
});

test("should return proper type if valid data and accept options provided and minOption is set", () => {
  const mySchema = z.object({
    test: zFiles({
      minAmount: 1,
      accept: ["image/png"],
    }),
  });

  expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test: File[];
  }>();
});

test("should return proper type if valid data and maxSize options provided and minOption is set", () => {
  const mySchema = z.object({
    test: zFiles({
      minAmount: 1,
      maxSize: 1024 * 1024 * 5,
    }),
  });

  expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test: File[];
  }>();
});
