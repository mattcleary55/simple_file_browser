import request from "supertest";
import app from "../src/server";
import { listFilesAndGenerateUrls } from "../src/s3Operations";

jest.mock("../src/s3Operations");

describe("GET /files endpoint", () => {
  beforeEach(() => {
    (listFilesAndGenerateUrls as jest.Mock).mockReset();
  });

  it("should return a list of files and their metadata", async () => {
    (listFilesAndGenerateUrls as jest.Mock).mockResolvedValue([
      {
        fileName: "file1.txt",
        url: "http://mockedurl.com/file1.txt",
        lastModified: new Date().toISOString(),
      },
      {
        fileName: "file2.txt",
        url: "http://mockedurl.com/file2.txt",
        lastModified: new Date().toISOString(),
      },
    ]);

    const res = await request(app).get("/files");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("files");
    expect(res.body.files).toHaveLength(2);
  });

  it("should respond with a 500 error for general server errors", async () => {
    (listFilesAndGenerateUrls as jest.Mock).mockRejectedValue(
      new Error("Internal Server Error")
    );

    const res = await request(app).get("/files");

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Internal Server Error");
  });
});
