import {
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  UploadHandler,
} from "@remix-run/node";
import { randomString } from "./randomString";
import { join } from "path";

export const defaultFileUploadHandler = (): UploadHandler => {
  return unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      directory: join("public", "uploads"),
      file: (args) => `${randomString(10)}-upload-${args.filename}`,
    }),
    unstable_createMemoryUploadHandler()
  );
};
