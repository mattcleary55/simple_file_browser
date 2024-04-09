import {
  S3Client,
  ListObjectsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface FileData {
  fileName: string;
  url: string;
  lastModified: Date | undefined;
  size: number | undefined;
}

export const listFilesAndGenerateUrls = async (
  bucketName: string,
  s3Client: S3Client
): Promise<FileData[]> => {
  const data = await s3Client.send(
    new ListObjectsCommand({ Bucket: bucketName })
  );

  if (!data.Contents) {
    return [];
  }

  return Promise.all(
    data.Contents.map(async (file) => {
      if (!file.Key) {
        throw new Error("File Key is missing");
      }

      const getObjectCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: file.Key,
      });

      const signedUrl = await getSignedUrl(s3Client, getObjectCommand, {
        expiresIn: 3600,
      });

      return {
        fileName: file.Key,
        url: signedUrl,
        lastModified: file.LastModified,
        size: file.Size,
      };
    })
  );
};
