import { z } from "zod";

export const zSelectOptional = z.string({ message: "invalid" }).optional();
