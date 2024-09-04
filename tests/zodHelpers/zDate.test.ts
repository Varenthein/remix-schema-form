import * as z from "zod";
import { tryToGetZodErrorMsg } from "../utils/tryToGetZodErrorMsg";
import { zDate } from "../../src/utils/zodSchemaHelpers/zDate";

const testDate = new Date("1995-02-21T03:24:00");
const testDateMinusOneDay = new Date("1995-02-21T03:24:00");
testDateMinusOneDay.setDate(testDateMinusOneDay.getDate() - 1);
const testDatePlusOneDay = new Date("1995-02-21T03:24:00");
testDatePlusOneDay.setDate(testDatePlusOneDay.getDate() + 1);

test("should properly parse valid input data (no options)", () => {
  const mySchema = z.object({
    test: zDate(),
  });

  expect(mySchema.parse({ test: undefined })).toEqual({ test: undefined });
  expect(mySchema.parse({ test: testDate.toString() })).toEqual({
    test: testDate,
  });
});

test("should require string if required option is set to true", () => {
  const mySchema = z.object({
    test: zDate({
      required: true,
    }),
  });

  expect(mySchema.parse({ test: testDate.toString() })).toEqual({
    test: testDate,
  });
  expect(() => mySchema.parse({ test: undefined })).toThrowError(z.ZodError);
});

test("should throw error if minDate options provided and the value is too low", () => {
  const mySchema = z.object({
    test: zDate({
      required: true,
      minDate: testDate,
    }),
  });

  expect(mySchema.parse({ test: testDate.toString() })).toEqual({
    test: testDate,
  });
  expect(mySchema.parse({ test: testDatePlusOneDay.toString() })).toEqual({
    test: testDatePlusOneDay,
  });
  expect(() => mySchema.parse({ test: undefined })).toThrowError(z.ZodError);
  expect(() => mySchema.parse({ test: testDateMinusOneDay })).toThrowError(
    z.ZodError
  );
});

test("should throw error if maxDate options provided and the value is too high", () => {
  const mySchema = z.object({
    test: zDate({
      required: true,
      maxDate: testDate,
    }),
  });

  expect(mySchema.parse({ test: testDate.toString() })).toEqual({
    test: testDate,
  });
  expect(mySchema.parse({ test: testDateMinusOneDay.toString() })).toEqual({
    test: testDateMinusOneDay,
  });
  expect(() => mySchema.parse({ test: undefined })).toThrowError(z.ZodError);
  expect(() => mySchema.parse({ test: testDatePlusOneDay })).toThrowError(
    z.ZodError
  );
});

test("should throw proper error message if input is undefined and required option is set to true", () => {
  const mySchema = z.object({
    test: zDate({
      required: true,
    }),
  });

  expect(
    tryToGetZodErrorMsg(() =>
      mySchema.parse({ test: undefined })
    )
  ).toEqual("required");
});

test("should throw proper error message if minDate option provided and the value is too low", () => {
  const mySchema = z.object({
    test: zDate({
      required: true,
      minDate: testDate,
    }),
  });

  expect(
    tryToGetZodErrorMsg(() =>
      mySchema.parse({ test: testDatePlusOneDay.toString() })
    )
  ).toEqual(null);
  expect(
    tryToGetZodErrorMsg(() => mySchema.parse({ test: testDate.toString() }))
  ).toEqual(null);
  expect(
    tryToGetZodErrorMsg(() =>
      mySchema.parse({ test: testDateMinusOneDay.toString() })
    )
  ).toEqual("dateTooEarly|min=" + testDate.toLocaleDateString());
});

test("should throw proper error message if maxDate option provided and the value is too high", () => {
  const mySchema = z.object({
    test: zDate({
      required: true,
      maxDate: testDate,
    }),
  });

  expect(
    tryToGetZodErrorMsg(() =>
      mySchema.parse({ test: testDateMinusOneDay.toString() })
    )
  ).toEqual(null);
  expect(
    tryToGetZodErrorMsg(() => mySchema.parse({ test: testDate.toString() }))
  ).toEqual(null);
  expect(
    tryToGetZodErrorMsg(() =>
      mySchema.parse({ test: testDatePlusOneDay.toString() })
    )
  ).toEqual("dateTooLate|max=" + testDate.toLocaleDateString());
});
