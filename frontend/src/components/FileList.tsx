import React, { useState, useEffect } from "react";
import { fetchFiles } from "../api";
import { formatDate, formatBytes } from "../helpers";

const buckets = import.meta.env.VITE_AVAILABLE_BUCKETS.split(", ");

interface File {
  fileName: string;
  url: string;
  lastModified: number; // Assuming this is a Unix timestamp in milliseconds
  size: number; // Assuming size is in bytes
}

const FileList: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedBucket, setSelectedBucket] = useState<string>(buckets[0]);

  const [bucketName, setBucketName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { bucketName, files } = await fetchFiles(selectedBucket);
        setErrorMessage(null);
        setBucketName(bucketName);
        setFiles(files);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching files:", error);
        setErrorMessage("Error fetching files.");
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedBucket) {
      fetchData();
    }
  }, [selectedBucket]);

  const handleBucketChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBucket(event.target.value);
  };

  return (
    <div>
      <div className="mb-8">
        <label
          htmlFor="bucket-selector"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Select Bucket
        </label>

        <select
          id="bucket-selector"
          value={selectedBucket}
          onChange={handleBucketChange}
          className="shadow border rounded py-2 px-3 form-select block w-full leading-tight focus:outline-none focus:shadow-outline"
        >
          {buckets.map((bucket: string, i: number) => (
            <option key={i} value={bucket}>
              {bucket}
            </option>
          ))}
        </select>
      </div>

      {errorMessage && !isLoading && <h3>{errorMessage}</h3>}

      {isLoading && !errorMessage ? (
        <div className="spinner mx-auto mt-10"></div>
      ) : (
        <>
          <h2 className="block text-gray-700 text-sm font-bold mb-2">
            File List for {bucketName}
          </h2>

          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  File Name
                </th>

                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Last Modified
                </th>

                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Size
                </th>

                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {files.map((file, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-5 py-2 border-b border-gray-200 text-sm text-gray-900">
                    {file.fileName}
                  </td>

                  <td className="px-5 py-2 border-b border-gray-200 text-sm text-gray-900">
                    {formatDate(file.lastModified)}
                  </td>

                  <td className="px-5 py-2 border-b border-gray-200 text-sm text-gray-900">
                    {formatBytes(file.size)}
                  </td>

                  <td className="px-5 py-2 border-b border-gray-200 text-sm">
                    <a
                      href={file.url}
                      className="text-blue-500 hover:text-blue-600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default FileList;
