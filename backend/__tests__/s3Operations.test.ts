import { S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { listFilesAndGenerateUrls } from "../src/s3Operations";

jest.mock("@aws-sdk/client-s3");
jest.mock("@aws-sdk/s3-request-presigner");

describe("listFilesAndGenerateUrls", () => {
  let mockS3Client: S3Client;

  beforeEach(() => {
    mockS3Client = new S3Client({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return an array of file data with signed URLs", async () => {
    // Mock the response of ListObjectsCommand
    (mockS3Client.send as jest.Mock).mockResolvedValueOnce({
      Contents: [
        { Key: "file1.txt", LastModified: new Date("2024-04-10") },
        { Key: "file2.txt", LastModified: new Date("2024-04-11") },
      ],
    });

    // Mock URL generation
    (getSignedUrl as jest.Mock).mockResolvedValueOnce(
      "http://signedurl.com/file1.txt"
    );
    (getSignedUrl as jest.Mock).mockResolvedValueOnce(
      "http://signedurl.com/file2.txt"
    );

    const bucketName = "example-bucket";
    const result = await listFilesAndGenerateUrls(bucketName, mockS3Client);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      fileName: "file1.txt",
      url: "http://signedurl.com/file1.txt",
      lastModified: new Date("2024-04-10"),
    });
    expect(result[1]).toEqual({
      fileName: "file2.txt",
      url: "http://signedurl.com/file2.txt",
      lastModified: new Date("2024-04-11"),
    });
  });

  it("should return an empty array if no files found", async () => {
    // Mock the response of ListObjectsCommand with no Contents
    (mockS3Client.send as jest.Mock).mockResolvedValueOnce({});

    const bucketName = "example-bucket";
    const result = await listFilesAndGenerateUrls(bucketName, mockS3Client);

    expect(result).toEqual([]);
  });

  it("should throw an error if file Key is missing", async () => {
    // Mock the response of ListObjectsCommand with missing Key
    (mockS3Client.send as jest.Mock).mockResolvedValueOnce({
      Contents: [{ LastModified: new Date("2024-04-10") }],
    });

    const bucketName = "example-bucket";
    await expect(
      listFilesAndGenerateUrls(bucketName, mockS3Client)
    ).rejects.toThrow("File Key is missing");
  });
});
