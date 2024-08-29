import { defaultTranslateFunc } from "../src/utils/defaultTranslateFunc"

vi.mock('../src/utils/defaultErrors.ts', () => ({
  defaultErrors: {
    required: "Required",
    tooLong: "Too long (max {{max}})",
    notInRange: "Not in range (min {{min}} - max: {{max}})"
  }
}))

test("defaultTranslateFunc works properly", () => {
  expect(defaultTranslateFunc("required")).toEqual("Required");
  expect(defaultTranslateFunc("tooLong", { max: "10" })).toEqual("Too long (max 10)");
  expect(defaultTranslateFunc("tooLong", { max: "2" })).toEqual("Too long (max 2)");
  expect(defaultTranslateFunc("notInRange", { min: "2", max: "4" })).toEqual("Not in range (min 2 - max: 4)");
  expect(defaultTranslateFunc("notInRange", { min: "2", max: "4" })).toEqual("Not in range (min 2 - max: 4)");
  expect(defaultTranslateFunc("notInRange", { max: "4" })).toEqual("Not in range (min {{min}} - max: 4)");
  expect(defaultTranslateFunc("invalidKey")).toEqual("invalidKey");
  expect(defaultTranslateFunc("Other key")).toEqual("Other key");
})