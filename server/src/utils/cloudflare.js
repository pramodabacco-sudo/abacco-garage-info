import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import crypto from "crypto";
import path from "path";

const s3 = new S3Client({
  region: "auto",

  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,

  credentials: {
    accessKeyId:
      process.env.R2_ACCESS_KEY_ID,

    secretAccessKey:
      process.env.R2_SECRET_ACCESS_KEY,
  },
});

export const uploadToCloudflare = async (
  file,
  garageVisitId
) => {
  try {

    const extension = path.extname(
      file.originalname
    );

    const uniqueId =
      crypto.randomUUID();

    const fileName = `garage-visits/${garageVisitId}/${uniqueId}${extension}`;

    const command = new PutObjectCommand({
      Bucket:
        process.env.R2_BUCKET_NAME,

      Key: fileName,

      Body: file.buffer,

      ContentType:
        file.mimetype,
    });

    await s3.send(command);

    return {
      imageUrl: `${process.env.R2_PUBLIC_URL}/${fileName}`,

      publicId: fileName,
    };

  } catch (error) {

    console.log(error);

    throw new Error(
      "R2 upload failed"
    );
  }
};