import * as z from "zod";
import { zCheckbox } from "../../src/utils/zodSchemaHelpers/zCheckbox";

test("should return boolean type if valid data provided and required is not true", () => {
  const mySchema = z.object({
    test: zCheckbox(),
  });

  expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test: boolean;
  }>();
});

test("should return true type if valid data provided and required is true", () => {
  const mySchema = z.object({
    test: zCheckbox({
      required: true,
    }),
  });

  expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test: true;
  }>();
});
