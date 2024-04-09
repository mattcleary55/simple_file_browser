require("dotenv").config();

// Importing necessary modules and middleware
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import { s3Client } from "./awsClient";
import { listFilesAndGenerateUrls } from "./s3Operations";

// Express app setup
const app = express();
const { PORT = 3000, S3_BUCKET_NAME } = process.env;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.get(
  "/files",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bucketName = req.query.bucketname || S3_BUCKET_NAME;

      if (typeof bucketName !== "string") {
        throw new Error("Bucket name is not specified.");
      }

      const files = await listFilesAndGenerateUrls(bucketName, s3Client);
      res.json({ bucketName, files });
    } catch (error) {
      next(error);
    }
  }
);

// Error handling middleware
app.use(
  (error: Error, req: Request, res: Response, next: NextFunction): void => {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ error: errorMessage });
  }
);

// Start the server
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
  });
}

export default app;
