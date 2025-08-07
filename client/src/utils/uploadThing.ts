import { generateUploadButton, generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@discord/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();