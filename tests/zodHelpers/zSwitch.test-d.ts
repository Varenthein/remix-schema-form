import * as z from "zod";
import { zSwitch } from "../../src/utils/zodSchemaHelpers/zSwitch";

test("should return boolean type if valid data provided", () => {
  const mySchema = z.object({
    test: zSwitch()
  })

 expectTypeOf<z.infer<typeof mySchema>>().toEqualTypeOf<{
    test: boolean
 }>()

});

