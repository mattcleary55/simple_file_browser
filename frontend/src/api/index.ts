import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL; // Your backend URL

export const fetchFiles = async (selectedBucket: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/files?bucketname=${selectedBucket}`
  );
  return response.data;
};
