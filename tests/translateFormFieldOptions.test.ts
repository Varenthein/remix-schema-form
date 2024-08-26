import { translateFormFieldsOptions } from "../src/utils/translateFormFieldOptions";

const translateFunc = (key: string) => key + "_translated";

test("translateFormFieldOptions works correctly with different good values", () => {
  const testCases = [
    [{ name: "val" }, { name: true }, { name: "val_translated" }],
    [{ name: "val" }, undefined, { name: "val" }],
    [
      { name: "val", arr: ["a", "b", "c"] },
      undefined,
      { name: "val", arr: ["a", "b", "c"] },
    ],
    [
      { name: "val", arr: ["a", "b", "c"] },
      { arr: true },
      { name: "val", arr: ["a_translated", "b_translated", "c_translated"] },
    ],
    [
      {
        obj: {
          a: "str",
          b: "str",
        },
      },
      {
        obj: {
          a: true,
        },
      },
      {
        obj: {
          a: "str_translated",
          b: "str",
        },
      },
    ],
    [
      {
        obj: {
          a: "str",
          b: "str",
        },
      },
      {
        obj: {
          b: true,
        },
      },
      {
        obj: {
          a: "str",
          b: "str_translated",
        },
      },
    ],
    [
      {
        obj: {
          a: "str",
          b: "str",
        },
      },
      undefined,
      {
        obj: {
          a: "str",
          b: "str",
        },
      },
    ],
    [
      {
        obj: {
          a: ["str"],
          b: "str",
        },
      },
      {
        obj: {
          a: true,
        },
      },
      {
        obj: {
          a: ["str_translated"],
          b: "str",
        },
      },
    ],
    [
      {
        obj: {
          a: [{ c: "val", d: "val" }],
          b: "str",
        },
      },
      {
        obj: {
          a: {
            c: true,
          },
        },
      },
      {
        obj: {
          a: [{ c: "val_translated", d: "val" }],
          b: "str",
        },
      },
    ],
    [
      {
        obj: {
          a: {
            c: "str",
            d: "str",
          },
          b: "str",
        },
      },
      {
        obj: {
          a: {
            d: true,
          },
        },
      },
      {
        obj: {
          a: {
            c: "str",
            d: "str_translated",
          },
          b: "str",
        },
      },
    ],
    [
      {
        obj: {
          a: [
            {
              c: "str",
              d: "str",
            },
          ],
          b: "str",
        },
      },
      {
        obj: {
          a: {
            d: true,
          },
          b: true,
        },
      },
      {
        obj: {
          a: [
            {
              c: "str",
              d: "str_translated",
            },
          ],
          b: "str_translated",
        },
      },
    ],
  ] as const;

  for (const testCase of testCases) {
    expect(
      translateFormFieldsOptions(translateFunc, testCase[0], testCase[1])
    ).toEqual(testCase[2]);
  }
});
