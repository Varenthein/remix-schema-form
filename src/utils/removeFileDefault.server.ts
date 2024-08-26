import { promises as fs } from 'fs'
import path from "path";
import { FileRemoveFunc } from "./types";

export const removeFileDefault: FileRemoveFunc = (name: string) => {
  return fs.unlink(path.join(process.cwd(), "public", "uploads", name));
};
