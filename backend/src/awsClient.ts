import { S3Client } from "@aws-sdk/client-s3";

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

if (
  typeof AWS_REGION === "undefined" ||
  typeof AWS_ACCESS_KEY_ID === "undefined" ||
  typeof AWS_SECRET_ACCESS_KEY === "undefined"
) {
  throw new Error(
    "AWS_REGION, AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY is undefined"
  );
}

export const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});
