import * as z from "zod";
import { zEmail } from "../../src/utils/zodSchemaHelpers/zEmail";

test("should return string type if valid data provided (no options)", () => {
  const mySchema = z.object({
    test: zEmail(),
  });

  expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test: string;
  }>();
});

test("should return string type if valid data provided (min option set)", () => {
  const mySchema = z.object({
    test: zEmail({ min: 2 }),
  });

  expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test: string;
  }>();
});

test("should return string type if valid data provided (max option set)", () => {
  const mySchema = z.object({
    test: zEmail({ max: 2 }),
  });

  expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test: string;
  }>();
});

test("should return string type if valid data provided (min + max options set)", () => {
  const mySchema = z.object({
    test: zEmail({ min: 2, max: 4 }),
  });

  expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test: string;
  }>();
});
