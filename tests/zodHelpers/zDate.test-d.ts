import * as z from "zod";
import { zDate } from "../../src/utils/zodSchemaHelpers/zDate";

test("should return proper (date/undefined) type if valid data provided and required is not true", () => {
  const mySchema = z.object({
    test: zDate(),
  });

  expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test?: Date | undefined;
  }>();
});

test("should return date type if valid data provided and required is true", () => {
  const mySchema = z.object({
    test: zDate({
      required: true,
    }),
  });

  expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test: Date;
  }>();
});
