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

test("should return proper (date/undefined) type if valid data and minDate options provided (but with required = false)", () => {
  const mySchema = z.object({
    test: zDate({
      minDate: new Date(),
    }),
  });

  expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test?: Date | undefined;
  }>();
});

test("should return proper (date/undefined) type if valid data and maxDate options provided (but with required = false)", () => {
  const mySchema = z.object({
    test: zDate({
      maxDate: new Date(),
    }),
  });

  expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test?: Date | undefined;
  }>();
});

test("should return proper (date/undefined) type if valid data and minDate+maxDate options provided (but with required = false)", () => {
  const mySchema = z.object({
    test: zDate({
      minDate: new Date(),
      maxDate: new Date(),
    }),
  });

  expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test?: Date | undefined;
  }>();
});

test("should return proper type if valid data and minDate options provided (required = true)", () => {
  const mySchema = z.object({
    test: zDate({
      required: true,
      minDate: new Date(),
    }),
  });

  expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test: Date;
  }>();
});

test("should return proper type if valid data and maxDate options provided (required = true)", () => {
  const mySchema = z.object({
    test: zDate({
      required: true,
      maxDate: new Date(),
    }),
  });

  expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test: Date;
  }>();
});

test("should return proper type if valid data and minDate+maxDate options provided (required = true)", () => {
  const mySchema = z.object({
    test: zDate({
      required: true,
      minDate: new Date(),
      maxDate: new Date(),
    }),
  });

  expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test: Date;
  }>();
});
