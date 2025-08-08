import { z } from "zod";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { verify } from "jsonwebtoken";
import { parse } from "cookie";

const f = createUploadthing();

const authenticateRequest = async (req: Request) => {
  const cookies = parse(req.headers.get("cookie") || "");
  const token = cookies.token;

  if (!token) {
    throw new UploadThingError("No authorization token provided");
  }

  try {
    const decoded: any = verify(token, process.env.JWT_SECRET!);
    return { userId: decoded.userId };
  } catch (err) {
    console.error("JWT verification failed:", err);
    throw new UploadThingError("Unauthorized: Invalid token");
  }
};

export const ourFileRouter = {
  imageAndGifUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
    "image/gif": {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .input(z.object({ tempID: z.string() }))
    .middleware(async ({ req, input }) => {
      const user = await authenticateRequest(req);

      return {
        userId: user.userId,
        tempID: input.tempID,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("Temp ID:", metadata.tempID);
      console.log("File URL:", file.ufsUrl);

      return {
        uploadedBy: metadata.userId,
        tempID: metadata.tempID,
        fileUrl: file.ufsUrl,
        fileKey: file.key,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
